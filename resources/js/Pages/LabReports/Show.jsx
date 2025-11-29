import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeft,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Calendar,
    Building2,
    FileText,
    Image as ImageIcon,
    Download,
} from "lucide-react";
import { useState } from "react";

export default function Show({ auth, labReport }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleDelete = () => {
        if (
            confirm(
                "Are you sure you want to delete this lab report? This action cannot be undone."
            )
        ) {
            router.delete(route("lab-reports.destroy", labReport.id));
        }
    };

    // Helper function to format role names
    const formatRoleName = (role) => {
        const roleMap = {
            Admin: "Lab Inspector",
            Staff: "Lab Assistant",
            "Sanitary Inspector": "Sanitary Inspector",
        };
        return roleMap[role] || role;
    };

    const getStatusBadge = () => {
        const badge = labReport.status_badge;
        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.class}`}
            >
                {labReport.status === "approved" && (
                    <CheckCircle className="w-4 h-4 mr-1" />
                )}
                {labReport.status === "rejected" && (
                    <XCircle className="w-4 h-4 mr-1" />
                )}
                {labReport.status === "pending" && (
                    <Clock className="w-4 h-4 mr-1" />
                )}
                {badge.text}
            </span>
        );
    };

    const getResultBadge = (result, isPending = false) => {
        // Show "Pending Inspection" for pending reports or null results
        if (isPending || !result) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="w-4 h-4 mr-1" />
                    Pending Inspection
                </span>
            );
        }

        if (result === "pass") {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Pass
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <XCircle className="w-4 h-4 mr-1" />
                Fail
            </span>
        );
    };

    const ImageModal = ({ imageUrl, onClose }) => {
        if (!imageUrl) return null;

        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div className="relative max-w-4xl max-h-full">
                    <img
                        src={imageUrl}
                        alt="Full size"
                        className="max-w-full max-h-screen object-contain"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    };

    // Check if report is pending
    const isPending = labReport.status === "pending";

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Lab Report Details" />

            <div className="py-6">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route("lab-reports.index")}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Lab Reports
                        </Link>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Lab Report Details
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Submitted on{" "}
                                    {new Date(
                                        labReport.submitted_at
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                            {isPending && (
                                <div className="flex gap-2">
                                    <Link
                                        href={route(
                                            "lab-reports.edit",
                                            labReport.id
                                        )}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Banner */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Status
                                    </p>
                                    {getStatusBadge()}
                                </div>
                                <div className="border-l border-gray-300 h-12"></div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Overall Result
                                    </p>
                                    {getResultBadge(
                                        labReport.overall_result,
                                        isPending
                                    )}
                                </div>
                                <div className="border-l border-gray-300 h-12"></div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Application Type
                                    </p>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            labReport.application_type === "new"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-purple-100 text-purple-800"
                                        }`}
                                    >
                                        {labReport.application_type === "new"
                                            ? "New Application"
                                            : "Renewal"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Business Information */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Building2 className="w-5 h-5 mr-2" />
                            Business Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Business Name
                                </p>
                                <p className="text-base font-medium text-gray-900">
                                    {labReport.business.business_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Owner Name
                                </p>
                                <p className="text-base font-medium text-gray-900">
                                    {labReport.business.owner_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Address</p>
                                <p className="text-base font-medium text-gray-900">
                                    {labReport.business.address}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Business Type
                                </p>
                                <p className="text-base font-medium text-gray-900">
                                    {labReport.business.business_type}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Test Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Fecalysis */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                                <span className="flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Fecalysis Examination
                                </span>
                                {getResultBadge(
                                    labReport.fecalysis_result,
                                    isPending
                                )}
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Photo
                                    </p>
                                    <img
                                        src={labReport.fecalysis_photo_url}
                                        alt="Fecalysis"
                                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() =>
                                            setSelectedImage(
                                                labReport.fecalysis_photo_url
                                            )
                                        }
                                    />
                                </div>
                                {labReport.fecalysis_remarks && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Remarks
                                        </p>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                                            {labReport.fecalysis_remarks}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* X-Ray/Sputum */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                                <span className="flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    X-Ray/Sputum
                                </span>
                                {getResultBadge(
                                    labReport.xray_sputum_result,
                                    isPending
                                )}
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Photo
                                    </p>
                                    <img
                                        src={labReport.xray_sputum_photo_url}
                                        alt="X-Ray/Sputum"
                                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() =>
                                            setSelectedImage(
                                                labReport.xray_sputum_photo_url
                                            )
                                        }
                                    />
                                </div>
                                {labReport.xray_sputum_remarks && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Remarks
                                        </p>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                                            {labReport.xray_sputum_remarks}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Receipt */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                                <span className="flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Receipt
                                </span>
                                {getResultBadge(
                                    labReport.receipt_result,
                                    isPending
                                )}
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Photo
                                    </p>
                                    <img
                                        src={labReport.receipt_photo_url}
                                        alt="Receipt"
                                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() =>
                                            setSelectedImage(
                                                labReport.receipt_photo_url
                                            )
                                        }
                                    />
                                </div>
                                {labReport.receipt_remarks && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Remarks
                                        </p>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                                            {labReport.receipt_remarks}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* DTI */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                                <span className="flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    DTI Registration
                                </span>
                                {getResultBadge(
                                    labReport.dti_result,
                                    isPending
                                )}
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Photo
                                    </p>
                                    <img
                                        src={labReport.dti_photo_url}
                                        alt="DTI"
                                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() =>
                                            setSelectedImage(
                                                labReport.dti_photo_url
                                            )
                                        }
                                    />
                                </div>
                                {labReport.dti_remarks && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Remarks
                                        </p>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                                            {labReport.dti_remarks}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* General Remarks */}
                    {labReport.general_remarks && (
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                General Remarks
                            </h2>
                            <p className="text-gray-900 whitespace-pre-wrap">
                                {labReport.general_remarks}
                            </p>
                        </div>
                    )}

                    {/* Inspector Remarks */}
                    {labReport.inspector_remarks && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Inspector Remarks
                            </h2>
                            <p className="text-gray-900 whitespace-pre-wrap">
                                {labReport.inspector_remarks}
                            </p>
                        </div>
                    )}

                    {/* Submission Details */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Submission Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Submitted By
                                    </p>
                                    <p className="text-base font-medium text-gray-900">
                                        {labReport.submitted_by?.name ||
                                            "Unknown"}
                                        {labReport.submitted_by?.role && (
                                            <span className="text-sm font-normal text-gray-600">
                                                {" "}
                                                (
                                                {formatRoleName(
                                                    labReport.submitted_by.role
                                                )}
                                                )
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Submitted At
                                    </p>
                                    <p className="text-base font-medium text-gray-900">
                                        {new Date(
                                            labReport.submitted_at
                                        ).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                            {labReport.inspected_by && (
                                <>
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Inspected By
                                            </p>
                                            <p className="text-base font-medium text-gray-900">
                                                {labReport.inspected_by.name}
                                                {labReport.inspected_by
                                                    .role && (
                                                    <span className="text-sm font-normal text-gray-600">
                                                        {" "}
                                                        (
                                                        {formatRoleName(
                                                            labReport
                                                                .inspected_by
                                                                .role
                                                        )}
                                                        )
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Inspected At
                                            </p>
                                            <p className="text-base font-medium text-gray-900">
                                                {new Date(
                                                    labReport.inspected_at
                                                ).toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <ImageModal
                    imageUrl={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </AuthenticatedLayout>
    );
}
