import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeft,
    Building2,
    Calendar,
    User,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Edit,
    Trash2,
    Download,
    MapPin,
} from "lucide-react";

export default function Show({ auth, permit }) {
    const handleDelete = () => {
        if (
            confirm(
                `Are you sure you want to delete permit ${permit.permit_number}? This action cannot be undone.`
            )
        ) {
            router.delete(route("permits.destroy", permit.id));
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            Active: "bg-green-100 text-green-800 border-green-200",
            "Expiring Soon": "bg-yellow-100 text-yellow-800 border-yellow-200",
            Expired: "bg-red-100 text-red-800 border-red-200",
            Revoked: "bg-gray-100 text-gray-800 border-gray-200",
            Pending: "bg-blue-100 text-blue-800 border-blue-200",
        };

        const icons = {
            Active: <CheckCircle className="w-4 h-4" />,
            "Expiring Soon": <AlertCircle className="w-4 h-4" />,
            Expired: <XCircle className="w-4 h-4" />,
            Revoked: <XCircle className="w-4 h-4" />,
            Pending: <Clock className="w-4 h-4" />,
        };

        return (
            <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}
            >
                {icons[status]}
                {status}
            </span>
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getDaysUntilExpiry = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatRoleName = (role) => {
        const roleMap = {
            Admin: "Lab Inspector",
            Staff: "Lab Assistant",
            "Sanitary Inspector": "Sanitary Inspector",
        };
        return roleMap[role] || role;
    };
    const daysUntilExpiry = getDaysUntilExpiry(permit.expiry_date);
    console.log("Permit data:", permit);
    console.log("Issued by:", permit.issued_by);
    console.log("Approved by:", permit.approved_by);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Permit ${permit.permit_number}`} />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route("permits.index")}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Permits
                        </Link>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Sanitary Permit Details
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    {permit.permit_number}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {getStatusBadge(permit.status)}
                            </div>
                        </div>
                    </div>

                    {/* Expiry Warning */}
                    {permit.status === "Active" &&
                        daysUntilExpiry <= 30 &&
                        daysUntilExpiry > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800">
                                            Permit Expiring Soon
                                        </p>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            This permit will expire in{" "}
                                            {daysUntilExpiry} days on{" "}
                                            {formatDate(permit.expiry_date)}.
                                            Please initiate renewal process.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    {permit.status === "Expired" && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-red-800">
                                        Permit Expired
                                    </p>
                                    <p className="text-sm text-red-700 mt-1">
                                        This permit expired{" "}
                                        {Math.abs(daysUntilExpiry)} days ago on{" "}
                                        {formatDate(permit.expiry_date)}.
                                        Business operations are not authorized.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Permit Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Permit Information
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    Permit Number
                                </p>
                                <p className="text-base font-semibold text-gray-900">
                                    {permit.permit_number}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    Permit Type
                                </p>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                        permit.permit_type === "New"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-purple-100 text-purple-800"
                                    }`}
                                >
                                    {permit.permit_type}
                                </span>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">
                                        Issue Date
                                    </p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {formatDate(permit.issue_date)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">
                                        Expiry Date
                                    </p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {formatDate(permit.expiry_date)}
                                    </p>
                                    {permit.status === "Active" &&
                                        daysUntilExpiry > 0 && (
                                            <p className="text-xs text-gray-600 mt-1">
                                                {daysUntilExpiry} days remaining
                                            </p>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Business Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Business Information
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    Business Name
                                </p>
                                <p className="text-base font-semibold text-gray-900">
                                    {permit.business?.business_name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    Owner Name
                                </p>
                                <p className="text-base font-semibold text-gray-900">
                                    {permit.business?.owner_name}
                                </p>
                            </div>

                            <div className="md:col-span-2 flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">
                                        Address
                                    </p>
                                    <p className="text-base text-gray-900">
                                        {permit.business?.address}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    Business Type
                                </p>
                                <p className="text-base text-gray-900">
                                    {permit.business?.business_type}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    Contact Number
                                </p>
                                <p className="text-base text-gray-900">
                                    {permit.business?.contact_number ||
                                        "Not provided"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Issuance Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Issuance Details
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">
                                        Issued By
                                    </p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {permit.issued_by?.name || "Unknown"}
                                        {permit.issued_by?.role && (
                                            <span className="text-sm font-normal text-gray-600">
                                                {" "}
                                                (
                                                {formatRoleName(
                                                    permit.issued_by.role
                                                )}
                                                )
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">
                                            Approved By
                                        </p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {permit.approved_by?.name ||
                                                "Unknown"}
                                            {permit.approved_by?.role && (
                                                <span className="text-sm font-normal text-gray-600">
                                                    {" "}
                                                    (
                                                    {formatRoleName(
                                                        permit.approved_by.role
                                                    )}
                                                    )
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Remarks */}
                    {permit.remarks && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Remarks
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-900 whitespace-pre-wrap">
                                    {permit.remarks}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
