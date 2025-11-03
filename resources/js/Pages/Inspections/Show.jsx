import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeft,
    Building2,
    Calendar,
    User,
    ClipboardCheck,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
    Save,
    Download,
    Eye,
} from "lucide-react";

export default function Show({ auth, inspection }) {
    const [showPassModal, setShowPassModal] = useState(false);
    const [showFailModal, setShowFailModal] = useState(false);
    const [passWithConditions, setPassWithConditions] = useState(false);
    const [findings, setFindings] = useState(inspection.findings || "");
    const [recommendations, setRecommendations] = useState(
        inspection.recommendations || ""
    );
    const [processing, setProcessing] = useState(false);

    // Document status tracking (4 required documents)
    const [documentStatuses, setDocumentStatuses] = useState({
        fecalysis: "pending", // pending, approved, rejected
        xray_sputum: "pending",
        receipt: "pending",
        dti: "pending",
    });

    const handleDocumentStatusChange = (docType, status) => {
        setDocumentStatuses((prev) => ({
            ...prev,
            [docType]: status,
        }));
    };

    const allDocumentsReviewed = Object.values(documentStatuses).every(
        (status) => status !== "pending"
    );

    const allDocumentsApproved = Object.values(documentStatuses).every(
        (status) => status === "approved"
    );

    const hasRejectedDocuments = Object.values(documentStatuses).some(
        (status) => status === "rejected"
    );

    const canPass = () => {
        return allDocumentsReviewed && allDocumentsApproved;
    };

    const canFail = () => {
        return allDocumentsReviewed;
    };

    const handleSaveProgress = () => {
        setProcessing(true);
        router.post(
            route("inspections.save-progress", inspection.id),
            {
                findings,
                recommendations,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    alert("Progress saved successfully!");
                },
                onFinish: () => setProcessing(false),
            }
        );
    };

    const handlePass = () => {
        if (!canPass()) {
            alert(
                "All documents must be reviewed and approved before passing the inspection."
            );
            return;
        }

        setProcessing(true);

        router.post(
            route("inspections.pass", inspection.id),
            {
                findings,
                recommendations,
                pass_with_conditions: passWithConditions,
                document_statuses: documentStatuses, // ✅ ADDED: Send document statuses
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowPassModal(false);
                },
                onFinish: () => setProcessing(false),
            }
        );
    };

    const handleFail = () => {
        if (!canFail()) {
            alert("Please review all documents before failing the inspection.");
            return;
        }

        if (!findings.trim()) {
            alert("Please provide findings/reasons for failure.");
            return;
        }

        setProcessing(true);

        router.post(
            route("inspections.fail", inspection.id),
            {
                findings,
                recommendations,
                document_statuses: documentStatuses, // ✅ ADDED: Send document statuses
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowFailModal(false);
                },
                onFinish: () => setProcessing(false),
            }
        );
    };

    // ✅ UPDATED: Match database enum values (Approved, Denied, Pending)
    const getStatusBadge = (status) => {
        const styles = {
            Approved: "bg-green-100 text-green-800 border-green-200",
            Denied: "bg-red-100 text-red-800 border-red-200",
            Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };

        return (
            <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${
                    styles[status] ||
                    "bg-gray-100 text-gray-800 border-gray-200"
                }`}
            >
                {status}
            </span>
        );
    };

    const getDocumentStatusBadge = (status) => {
        const styles = {
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
            pending: "bg-yellow-100 text-yellow-800",
        };

        const labels = {
            approved: "Approved",
            rejected: "Rejected",
            pending: "Pending Review",
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                    styles[status] || "bg-gray-100 text-gray-800"
                }`}
            >
                {labels[status] || status}
            </span>
        );
    };

    // ✅ UPDATED: Check for "Pending" (matches database enum)
    const isPending = inspection.result === "Pending";

    // ✅ Get lab report from inspection
    const labReport = inspection.lab_report;

    // ✅ Map documents from lab report
    const documentsByType = {
        fecalysis: labReport
            ? {
                  file_path: labReport.fecalysis_photo_url?.replace(
                      "/storage/",
                      ""
                  ),
                  uploader: labReport.submitted_by,
                  created_at: labReport.submitted_at,
                  remarks: labReport.fecalysis_remarks,
              }
            : null,
        xray_sputum: labReport
            ? {
                  file_path: labReport.xray_sputum_photo_url?.replace(
                      "/storage/",
                      ""
                  ),
                  uploader: labReport.submitted_by,
                  created_at: labReport.submitted_at,
                  remarks: labReport.xray_sputum_remarks,
              }
            : null,
        receipt: labReport
            ? {
                  file_path: labReport.receipt_photo_url?.replace(
                      "/storage/",
                      ""
                  ),
                  uploader: labReport.submitted_by,
                  created_at: labReport.submitted_at,
                  remarks: labReport.receipt_remarks,
              }
            : null,
        dti: labReport
            ? {
                  file_path: labReport.dti_photo_url?.replace("/storage/", ""),
                  uploader: labReport.submitted_by,
                  created_at: labReport.submitted_at,
                  remarks: labReport.dti_remarks,
              }
            : null,
    };

    const documentLabels = {
        fecalysis: "Fecalysis Examination Result",
        xray_sputum: "X-Ray / Sputum Examination",
        receipt: "Payment Receipt",
        dti: "DTI Business Registration",
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Inspection ${inspection.inspection_number}`} />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route("inspections.index")}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Inspections
                        </Link>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Inspection Details
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    {inspection.inspection_number}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {getStatusBadge(inspection.result)}
                                {isPending && (
                                    <>
                                        <button
                                            onClick={handleSaveProgress}
                                            disabled={processing}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Progress
                                        </button>
                                        <button
                                            onClick={() =>
                                                setShowFailModal(true)
                                            }
                                            disabled={!canFail() || processing}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Fail
                                        </button>
                                        <button
                                            onClick={() =>
                                                setShowPassModal(true)
                                            }
                                            disabled={!canPass() || processing}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Pass
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Document Review Status */}
                    {isPending && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700">
                                        Document Review Progress
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Review all 4 required documents
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {
                                            Object.values(
                                                documentStatuses
                                            ).filter((s) => s !== "pending")
                                                .length
                                        }
                                        /4
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Documents Reviewed
                                    </p>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${
                                        allDocumentsApproved
                                            ? "bg-green-600"
                                            : hasRejectedDocuments
                                            ? "bg-red-600"
                                            : "bg-blue-600"
                                    }`}
                                    style={{
                                        width: `${
                                            (Object.values(
                                                documentStatuses
                                            ).filter((s) => s !== "pending")
                                                .length /
                                                4) *
                                            100
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Inspection Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Inspection Information
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Business
                                    </p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">
                                        {inspection.business?.business_name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {inspection.business?.owner_name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Inspector
                                    </p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">
                                        {inspection.inspector?.name ||
                                            "Unassigned"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Inspection Date
                                    </p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">
                                        {new Date(
                                            inspection.inspection_date
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <ClipboardCheck className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Inspection Type
                                    </p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">
                                        {inspection.inspection_type}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documents Review Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Required Documents Review
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Review each document and mark as approved or
                                rejected
                            </p>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {Object.entries(documentsByType).map(
                                ([type, document], index) => (
                                    <div key={type} className="p-6">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm font-medium text-gray-500">
                                                        #{index + 1}
                                                    </span>
                                                    <span className="text-base font-semibold text-gray-900">
                                                        {documentLabels[type]}
                                                    </span>
                                                </div>
                                                {document && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs text-gray-500">
                                                            Uploaded by:{" "}
                                                            {document.uploader
                                                                ?.name ||
                                                                "Unknown"}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            •
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(
                                                                document.created_at
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {!isPending && (
                                                <div>
                                                    {getDocumentStatusBadge(
                                                        documentStatuses[type]
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {document ? (
                                            <div className="space-y-3">
                                                {/* Document Preview */}
                                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                    <img
                                                        src={`/storage/${document.file_path}`}
                                                        alt={
                                                            documentLabels[type]
                                                        }
                                                        className="max-h-64 mx-auto rounded"
                                                    />
                                                    <div className="flex gap-2 mt-3">
                                                        <a
                                                            href={`/storage/${document.file_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View Full Size
                                                        </a>
                                                        <a
                                                            href={`/storage/${document.file_path}`}
                                                            download
                                                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Download
                                                        </a>
                                                    </div>
                                                </div>

                                                {/* Document Notes */}
                                                {document.remarks && (
                                                    <div className="p-3 bg-blue-50 rounded-lg">
                                                        <p className="text-sm text-blue-900">
                                                            <span className="font-medium">
                                                                Notes:
                                                            </span>{" "}
                                                            {document.remarks}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Review Actions */}
                                                {isPending && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Review Decision
                                                        </label>
                                                        <div className="space-y-2">
                                                            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                                <input
                                                                    type="radio"
                                                                    name={`document-${type}`}
                                                                    checked={
                                                                        documentStatuses[
                                                                            type
                                                                        ] ===
                                                                        "approved"
                                                                    }
                                                                    onChange={() =>
                                                                        handleDocumentStatusChange(
                                                                            type,
                                                                            "approved"
                                                                        )
                                                                    }
                                                                    className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500"
                                                                />
                                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    Approve
                                                                    Document
                                                                </span>
                                                            </label>
                                                            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                                <input
                                                                    type="radio"
                                                                    name={`document-${type}`}
                                                                    checked={
                                                                        documentStatuses[
                                                                            type
                                                                        ] ===
                                                                        "rejected"
                                                                    }
                                                                    onChange={() =>
                                                                        handleDocumentStatusChange(
                                                                            type,
                                                                            "rejected"
                                                                        )
                                                                    }
                                                                    className="w-4 h-4 text-red-600 focus:ring-2 focus:ring-red-500"
                                                                />
                                                                <XCircle className="w-5 h-5 text-red-600" />
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    Reject
                                                                    Document
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                <p className="text-gray-500 text-sm">
                                                    Document not uploaded
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Findings and Recommendations */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Findings & Recommendations
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Findings
                                </label>
                                <textarea
                                    value={findings}
                                    onChange={(e) =>
                                        setFindings(e.target.value)
                                    }
                                    rows="4"
                                    disabled={!isPending}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                                    placeholder="Describe the findings from the inspection..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Recommendations
                                </label>
                                <textarea
                                    value={recommendations}
                                    onChange={(e) =>
                                        setRecommendations(e.target.value)
                                    }
                                    rows="4"
                                    disabled={!isPending}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                                    placeholder="Provide recommendations for improvement..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pass Modal */}
            {showPassModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Pass Inspection
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {inspection.inspection_number}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-900 font-medium mb-1">
                                    All documents have been approved
                                </p>
                                <p className="text-xs text-blue-700">
                                    {
                                        Object.values(documentStatuses).filter(
                                            (s) => s === "approved"
                                        ).length
                                    }{" "}
                                    out of 4 documents approved
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={passWithConditions}
                                        onChange={(e) =>
                                            setPassWithConditions(
                                                e.target.checked
                                            )
                                        }
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Pass with conditions (requires
                                        follow-up)
                                    </span>
                                </label>
                            </div>

                            <p className="text-sm text-gray-700 mb-4">
                                Are you sure you want to pass this inspection?
                                This will allow the business to proceed with
                                their permit issuance or renewal.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowPassModal(false)}
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePass}
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {processing
                                        ? "Processing..."
                                        : "Pass Inspection"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Fail Modal */}
            {showFailModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <XCircle className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Fail Inspection
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {inspection.inspection_number}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4 p-4 bg-red-50 rounded-lg">
                                <p className="text-sm text-red-900 font-medium mb-1">
                                    Documents rejected:{" "}
                                    {
                                        Object.values(documentStatuses).filter(
                                            (s) => s === "rejected"
                                        ).length
                                    }
                                </p>
                                <p className="text-xs text-red-700">
                                    Documents must be corrected and resubmitted
                                </p>
                            </div>

                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex gap-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-yellow-800">
                                        Please ensure you have documented all
                                        issues and provided detailed findings
                                        before failing this inspection.
                                    </p>
                                </div>
                            </div>

                            {!findings.trim() && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">
                                        ⚠️ Findings are required when failing an
                                        inspection
                                    </p>
                                </div>
                            )}

                            <p className="text-sm text-gray-700 mb-4">
                                Are you sure you want to fail this inspection?
                                The business will need to address the issues and
                                request a re-inspection.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowFailModal(false)}
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFail}
                                    disabled={processing || !findings.trim()}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {processing
                                        ? "Processing..."
                                        : "Fail Inspection"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
