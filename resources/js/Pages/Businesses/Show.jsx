import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Building2,
    MapPin,
    User,
    Phone,
    FileText,
    ClipboardCheck,
    Calendar,
    ArrowLeft,
    AlertCircle,
    Mail,
} from "lucide-react";

export default function Show({ auth, business }) {
    const getStatusBadge = (status) => {
        const styles = {
            Active: "bg-green-100 text-green-800",
            "Expiring Soon": "bg-yellow-100 text-yellow-800",
            Expired: "bg-red-100 text-red-800",
            Pending: "bg-blue-100 text-blue-800",
            Passed: "bg-green-100 text-green-800",
            "Passed with Conditions": "bg-yellow-100 text-yellow-800",
            Failed: "bg-red-100 text-red-800",
        };
        return styles[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Business - ${business.business_name}`} />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            href="/lab-reports"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Lab Reports</span>
                        </Link>
                    </div>

                    {/* Page Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Building2 className="w-8 h-8 text-orange-600" />
                            <h1 className="text-3xl font-bold text-gray-900">
                                {business.business_name}
                            </h1>
                        </div>
                        <p className="text-gray-600">
                            Business Type: {business.business_type}
                        </p>
                    </div>

                    {/* Alert if no permits */}
                    {(!business.sanitary_permits ||
                        business.sanitary_permits.length === 0) && (
                        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-orange-900">
                                    No Active Permits
                                </h3>
                                <p className="text-sm text-orange-700 mt-1">
                                    This business does not have any active
                                    sanitary permits. Please issue a permit to
                                    ensure compliance.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Business Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Business Details Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Business Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Owner Name
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {business.owner_name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Contact Number
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {business.contact_number ||
                                                    "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    {business.email && (
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Email
                                                </p>
                                                <p className="font-medium text-gray-900">
                                                    {business.email}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Business Type
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {business.business_type}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 md:col-span-2">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Address
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {business.address}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Barangay: {business.barangay}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sanitary Permits Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Sanitary Permits
                                    </h2>
                                    <Link
                                        href={`/lab-reports/create?business_id=${business.id}`}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Issue New Permit
                                    </Link>
                                </div>

                                {business.sanitary_permits &&
                                business.sanitary_permits.length > 0 ? (
                                    <div className="space-y-4">
                                        {business.sanitary_permits.map(
                                            (permit) => (
                                                <div
                                                    key={permit.id}
                                                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {
                                                                    permit.permit_number
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Permit Type:{" "}
                                                                {
                                                                    permit.permit_type
                                                                }
                                                            </p>
                                                        </div>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                                                permit.status
                                                            )}`}
                                                        >
                                                            {permit.status}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-gray-600">
                                                                Issue Date
                                                            </p>
                                                            <p className="font-medium text-gray-900">
                                                                {new Date(
                                                                    permit.issue_date
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-600">
                                                                Expiry Date
                                                            </p>
                                                            <p className="font-medium text-gray-900">
                                                                {new Date(
                                                                    permit.expiry_date
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        {permit.issued_by && (
                                                            <div className="col-span-2">
                                                                <p className="text-gray-600">
                                                                    Issued By
                                                                </p>
                                                                <p className="font-medium text-gray-900">
                                                                    {
                                                                        permit
                                                                            .issued_by
                                                                            .name
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                                                        <Link
                                                            href={`/permits/${permit.id}`}
                                                            className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                                        >
                                                            View Details
                                                        </Link>
                                                        <Link
                                                            href={`/permits/${permit.id}/edit`}
                                                            className="px-3 py-1.5 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                                                        >
                                                            Edit
                                                        </Link>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 font-medium mb-2">
                                            No Permits Issued
                                        </p>
                                        <p className="text-sm text-gray-500 mb-4">
                                            This business doesn't have any
                                            sanitary permits yet.
                                        </p>
                                        <Link
                                            href={`/lab-reports/create?business_id=${business.id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Issue First Permit
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
