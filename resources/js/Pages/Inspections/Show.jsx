import { useState, useEffect } from "react";
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
    MapPin,
    Briefcase,
} from "lucide-react";

export default function Show({ auth, inspection }) {
    const labReport = inspection.lab_report;

    // Initialize document statuses from lab report if it exists
    const getInitialDocumentStatus = (result) => {
        if (!result) return "pending";
        return result === "pass" ? "approved" : "rejected";
    };

    const [showPassModal, setShowPassModal] = useState(false);
    const [showFailModal, setShowFailModal] = useState(false);
    const [passWithConditions, setPassWithConditions] = useState(false);
    const [findings, setFindings] = useState(inspection.findings || "");
    const [recommendations, setRecommendations] = useState(
        inspection.recommendations || ""
    );
    const [processing, setProcessing] = useState(false);

    const [documentStatuses, setDocumentStatuses] = useState({
        fecalysis: labReport
            ? getInitialDocumentStatus(labReport.fecalysis_result)
            : "pending",
        xray_sputum: labReport
            ? getInitialDocumentStatus(labReport.xray_sputum_result)
            : "pending",
        receipt: labReport
            ? getInitialDocumentStatus(labReport.receipt_result)
            : "pending",
        dti: labReport
            ? getInitialDocumentStatus(labReport.dti_result)
            : "pending",
    });

    const [documentRemarks, setDocumentRemarks] = useState({
        fecalysis: inspection.fecalysis_inspector_remarks || "",
        xray_sputum: inspection.xray_sputum_inspector_remarks || "",
        receipt: inspection.receipt_inspector_remarks || "",
        dti: inspection.dti_inspector_remarks || "",
    });

    const handleDocumentStatusChange = (docType, status) => {
        setDocumentStatuses((prev) => ({
            ...prev,
            [docType]: status,
        }));
    };

    const handleDocumentRemarksChange = (docType, remarks) => {
        setDocumentRemarks((prev) => ({
            ...prev,
            [docType]: remarks,
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
                document_remarks: documentRemarks,
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
                document_statuses: documentStatuses,
                document_remarks: documentRemarks,
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
                document_statuses: documentStatuses,
                document_remarks: documentRemarks,
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

    const isPending = inspection.result === "Pending";

    const documentsByType = {
        fecalysis: labReport
            ? {
                  file_path: labReport.fecalysis_photo_url,
                  uploader: labReport.submitted_by,
                  created_at: labReport.submitted_at,
                  remarks: labReport.fecalysis_remarks,
              }
            : null,
        xray_sputum: labReport
            ? {
                  file_path: labReport.xray_sputum_photo_url,
                  uploader: labReport.submitted_by,
                  created_at: labReport.submitted_at,
                  remarks: labReport.xray_sputum_remarks,
              }
            : null,
        receipt: labReport
            ? {
                  file_path: labReport.receipt_photo_url,
                  uploader: labReport.submitted_by,
                  created_at: labReport.submitted_at,
                  remarks: labReport.receipt_remarks,
              }
            : null,
        dti: labReport
            ? {
                  file_path: labReport.dti_photo_url,
                  uploader: labReport.submitted_by,
                  created_at: labReport.submitted_at,
                  remarks: labReport.dti_remarks,
              }
            : null,
    };

    const documentLabels = {
        fecalysis: "Fecalysis Examination Result",
        xray_sputum: "X-Ray Examination",
        receipt: "Sputum Examination",
        dti: "DTI Business Registration",
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Inspection ${inspection.inspection_number}`} />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
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
                            </div>
                        </div>
                    </div>

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

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Inspection Information
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Business Type
                                    </p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">
                                        {inspection.business?.business_type ||
                                            "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Location
                                    </p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">
                                        {inspection.business?.address || "N/A"}
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
                                            <div>
                                                {getDocumentStatusBadge(
                                                    documentStatuses[type]
                                                )}
                                            </div>
                                        </div>

                                        {document ? (
                                            <div className="space-y-3">
                                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                    <img
                                                        src={document.file_path}
                                                        alt={
                                                            documentLabels[type]
                                                        }
                                                        className="max-h-64 mx-auto rounded"
                                                    />
                                                    <div className="flex gap-2 mt-3">
                                                        <a
                                                            href={
                                                                document.file_path
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View Full Size
                                                        </a>
                                                        <a
                                                            href={
                                                                document.file_path
                                                            }
                                                            download
                                                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Download
                                                        </a>
                                                    </div>
                                                </div>

                                                {document.remarks && (
                                                    <div className="p-3 bg-blue-50 rounded-lg">
                                                        <p className="text-sm text-blue-900">
                                                            <span className="font-medium">
                                                                Submitter Notes:
                                                            </span>{" "}
                                                            {document.remarks}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Show saved inspector remarks for non-pending inspections */}
                                                {!isPending &&
                                                    documentRemarks[type] && (
                                                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                                            <p className="text-sm text-purple-900">
                                                                <span className="font-medium">
                                                                    Inspector
                                                                    Remarks:
                                                                </span>{" "}
                                                                {
                                                                    documentRemarks[
                                                                        type
                                                                    ]
                                                                }
                                                            </p>
                                                        </div>
                                                    )}

                                                {isPending && (
                                                    <div className="space-y-3">
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

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Inspector
                                                                Remarks
                                                                (Optional)
                                                            </label>
                                                            <textarea
                                                                value={
                                                                    documentRemarks[
                                                                        type
                                                                    ]
                                                                }
                                                                onChange={(e) =>
                                                                    handleDocumentRemarksChange(
                                                                        type,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                rows="3"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                                placeholder="Add any specific notes about this document (e.g., quality issues, missing information, corrections needed)..."
                                                            />
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

                    {isPending && (
                        <div className="flex justify-end gap-3 mb-6">
                            <button
                                onClick={handleSaveProgress}
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
                            >
                                <Save className="w-5 h-5" />
                                Save Progress
                            </button>
                            <button
                                onClick={() => setShowFailModal(true)}
                                disabled={!canFail() || processing}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                            >
                                <XCircle className="w-5 h-5" />
                                Failed Inspection
                            </button>
                            <button
                                onClick={() => setShowPassModal(true)}
                                disabled={!canPass() || processing}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Passed Inspection
                            </button>
                        </div>
                    )}
                </div>
            </div>

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
                                        Passed Inspection
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
                                        : "Passed Inspection"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                        Failed Inspection
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
                                        : "Failed Inspection"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
