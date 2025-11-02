import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Search,
    Plus,
    FileText,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    Filter,
    Download,
} from "lucide-react";

export default function Index({ auth, permits, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [permitType, setPermitType] = useState(filters.permit_type || "all");
    const [status, setStatus] = useState(filters.status || "all");
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = () => {
        router.get(
            route("permits.index"),
            { search, permit_type: permitType, status },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handlePermitTypeChange = (newType) => {
        setPermitType(newType);
        router.get(
            route("permits.index"),
            { search, permit_type: newType, status },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        router.get(
            route("permits.index"),
            { search, permit_type: permitType, status: newStatus },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (permit) => {
        if (
            confirm(
                `Are you sure you want to delete permit ${permit.permit_number}?`
            )
        ) {
            router.delete(route("permits.destroy", permit.id), {
                preserveScroll: true,
            });
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
            Active: <CheckCircle className="w-3 h-3" />,
            "Expiring Soon": <AlertCircle className="w-3 h-3" />,
            Expired: <XCircle className="w-3 h-3" />,
            Revoked: <XCircle className="w-3 h-3" />,
            Pending: <Clock className="w-3 h-3" />,
        };

        return (
            <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
            >
                {icons[status]}
                {status}
            </span>
        );
    };

    const getPermitTypeBadge = (type) => {
        return (
            <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                    type === "New"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-purple-50 text-purple-700"
                }`}
            >
                {type}
            </span>
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Sanitary Permits
                    </h2>
                    <Link
                        href={route("permits.create")}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Permit
                    </Link>
                </div>
            }
        >
            <Head title="Sanitary Permits" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Permits
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage sanitary permits and certifications
                        </p>
                    </div>
                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && handleSearch()
                                        }
                                        placeholder="Search by permit number or business name..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                                >
                                    Search
                                </button>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                                >
                                    <Filter className="w-4 h-4" />
                                    Filters
                                </button>
                            </div>

                            {showFilters && (
                                <div className="pt-4 border-t border-gray-200 space-y-4">
                                    {/* Permit Type Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Filter by Permit Type
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {["all", "New", "Renewal"].map(
                                                (type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() =>
                                                            handlePermitTypeChange(
                                                                type
                                                            )
                                                        }
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                            permitType === type
                                                                ? "bg-blue-600 text-white shadow-md"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        {type === "all"
                                                            ? "All Types"
                                                            : type}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Filter by Status
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                "all",
                                                "Active",
                                                "Pending",
                                                "Expiring Soon",
                                                "Expired",
                                                "Revoked",
                                            ].map((statusOption) => (
                                                <button
                                                    key={statusOption}
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            statusOption
                                                        )
                                                    }
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                        status === statusOption
                                                            ? "bg-blue-600 text-white shadow-md"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {statusOption === "all"
                                                        ? "All Status"
                                                        : statusOption}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Permits Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Permit Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Business
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date Issued
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Expiry Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {permits.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-12 text-center"
                                            >
                                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                <p className="text-gray-500 text-sm">
                                                    No permits found
                                                </p>
                                                {(search ||
                                                    permitType !== "all" ||
                                                    status !== "all") && (
                                                    <button
                                                        onClick={() => {
                                                            setSearch("");
                                                            setPermitType(
                                                                "all"
                                                            );
                                                            setStatus("all");
                                                            router.get(
                                                                route(
                                                                    "permits.index"
                                                                )
                                                            );
                                                        }}
                                                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                    >
                                                        Clear filters
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ) : (
                                        permits.data.map((permit) => {
                                            const daysUntilExpiry =
                                                getDaysUntilExpiry(
                                                    permit.expiry_date
                                                );

                                            return (
                                                <tr
                                                    key={permit.id}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {
                                                                    permit.permit_number
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {
                                                                permit.business
                                                                    ?.business_name
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {
                                                                permit.business
                                                                    ?.owner_name
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getPermitTypeBadge(
                                                            permit.permit_type
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(
                                                            permit.issue_date
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {formatDate(
                                                                permit.expiry_date
                                                            )}
                                                        </div>
                                                        {permit.status ===
                                                            "Active" &&
                                                            daysUntilExpiry <=
                                                                30 &&
                                                            daysUntilExpiry >
                                                                0 && (
                                                                <div className="text-xs text-orange-600 mt-1">
                                                                    {
                                                                        daysUntilExpiry
                                                                    }{" "}
                                                                    days left
                                                                </div>
                                                            )}
                                                        {permit.status ===
                                                            "Expired" &&
                                                            daysUntilExpiry <
                                                                0 && (
                                                                <div className="text-xs text-red-600 mt-1">
                                                                    Expired{" "}
                                                                    {Math.abs(
                                                                        daysUntilExpiry
                                                                    )}{" "}
                                                                    days ago
                                                                </div>
                                                            )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(
                                                            permit.status
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <Link
                                                                    href={route(
                                                                        "permits.show",
                                                                        permit.id
                                                                    )}
                                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                                    title="View"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Link>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            permit
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <Link
                                                                href={route(
                                                                    "permits.print",
                                                                    permit.id
                                                                )}
                                                                className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors border border-purple-200"
                                                                title="Print Permit"
                                                            >
                                                                <Download className="w-3.5 h-3.5" />
                                                                Print
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {permits.data.length > 0 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-700">
                                        Showing{" "}
                                        <span className="font-medium">
                                            {permits.from}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-medium">
                                            {permits.to}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-medium">
                                            {permits.total}
                                        </span>{" "}
                                        results
                                    </div>
                                    <div className="flex gap-2">
                                        {permits.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || "#"}
                                                preserveState
                                                preserveScroll
                                                className={`px-3 py-1 rounded text-sm ${
                                                    link.active
                                                        ? "bg-blue-600 text-white"
                                                        : link.url
                                                        ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
