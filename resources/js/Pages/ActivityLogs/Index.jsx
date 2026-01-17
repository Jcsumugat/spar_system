import { useState } from "react";
import { usePage } from "@inertiajs/react";
import {
    Clock,
    Filter,
    Download,
    Search,
    ChevronLeft,
    ChevronRight,
    FileText,
    Building2,
    ClipboardCheck,
    FlaskConical,
    User,
    File,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Printer,
    Eye,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ActivityLogsIndex() {
    const { auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        user_id: "",
        action: "",
        model_type: "",
        date_from: "",
        date_to: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    // Sample data - Replace with actual API call
    const sampleLogs = [
        {
            id: 1,
            user_name: "Jc Sumugat",
            user_email: "jcsumugatxd@gmail.com",
            action: "created",
            model_type: "App\\Models\\Business",
            model_id: 10,
            description: "Created business Tibiao Bakery",
            ip_address: "127.0.0.1",
            created_at: "2025-10-30T06:20:47.000000Z",
        },
        {
            id: 2,
            user_name: "Jc Sumugat",
            user_email: "jcsumugatxd@gmail.com",
            action: "approved",
            model_type: "App\\Models\\Inspection",
            model_id: 10,
            description:
                "Approved inspection INS-2025-0009 and issued permit SP-2025-00007",
            ip_address: "127.0.0.1",
            created_at: "2025-11-01T04:38:10.000000Z",
        },
        {
            id: 3,
            user_name: "Rica Mae Remoting",
            user_email: "rica@gmail.com",
            action: "updated",
            model_type: "App\\Models\\Business",
            model_id: 15,
            description: "Updated business ukay-ukay store",
            ip_address: "127.0.0.1",
            created_at: "2025-11-30T20:23:15.000000Z",
        },
        {
            id: 4,
            user_name: "Jc Sumugat",
            user_email: "jcsumugatxd@gmail.com",
            action: "deleted",
            model_type: "App\\Models\\Business",
            model_id: 12,
            description: "Deleted business Sample",
            ip_address: "127.0.0.1",
            created_at: "2025-11-06T05:35:56.000000Z",
        },
        {
            id: 5,
            user_name: "Jc Sumugat",
            user_email: "jcsumugatxd@gmail.com",
            action: "printed",
            model_type: "App\\Models\\SanitaryPermit",
            model_id: 9,
            description: "Printed sanitary permit SP-2025-00001",
            ip_address: "127.0.0.1",
            created_at: "2025-11-03T02:06:32.000000Z",
        },
        {
            id: 6,
            user_name: "Jc Sumugat",
            user_email: "jcsumugatxd@gmail.com",
            action: "denied",
            model_type: "App\\Models\\Inspection",
            model_id: 15,
            description: "Denied inspection INS-2025-0004",
            ip_address: "127.0.0.1",
            created_at: "2025-11-04T22:14:07.000000Z",
        },
    ];

    const users = [
        { id: 16, name: "Jc Sumugat" },
        { id: 17, name: "Rica Mae Remoting" },
    ];

    const actions = [
        "created",
        "updated",
        "deleted",
        "approved",
        "denied",
        "printed",
        "viewed",
    ];

    const modelTypes = [
        "App\\Models\\Business",
        "App\\Models\\Inspection",
        "App\\Models\\SanitaryPermit",
        "App\\Models\\LabReport",
        "App\\Models\\User",
    ];

    const getActionBadgeColor = (action) => {
        const colors = {
            created: "bg-green-100 text-green-800",
            updated: "bg-blue-100 text-blue-800",
            deleted: "bg-red-100 text-red-800",
            approved: "bg-green-100 text-green-800",
            denied: "bg-yellow-100 text-yellow-800",
            printed: "bg-purple-100 text-purple-800",
            viewed: "bg-gray-100 text-gray-800",
        };
        return colors[action] || "bg-gray-100 text-gray-800";
    };

    const getActionIcon = (action) => {
        const icons = {
            created: CheckCircle,
            updated: Edit,
            deleted: Trash2,
            approved: CheckCircle,
            denied: XCircle,
            printed: Printer,
            viewed: Eye,
        };
        const Icon = icons[action] || File;
        return <Icon className="w-4 h-4" />;
    };

    const getModelIcon = (modelType) => {
        if (modelType.includes("Business"))
            return <Building2 className="w-5 h-5 text-blue-600" />;
        if (modelType.includes("Inspection"))
            return <ClipboardCheck className="w-5 h-5 text-green-600" />;
        if (modelType.includes("Permit"))
            return <FileText className="w-5 h-5 text-purple-600" />;
        if (modelType.includes("LabReport"))
            return <FlaskConical className="w-5 h-5 text-orange-600" />;
        if (modelType.includes("User"))
            return <User className="w-5 h-5 text-gray-600" />;
        return <File className="w-5 h-5 text-gray-600" />;
    };

    const formatModelName = (modelType) => {
        return modelType.replace("App\\Models\\", "");
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        // Implement search logic
    };

    const clearFilters = () => {
        setFilters({
            user_id: "",
            action: "",
            model_type: "",
            date_from: "",
            date_to: "",
        });
        setSearchTerm("");
        setCurrentPage(1);
    };

    const exportLogs = () => {
        alert("Export functionality would download filtered logs as CSV/Excel");
    };

    // Filter logs based on current filters
    const filteredLogs = sampleLogs.filter((log) => {
        if (
            filters.user_id &&
            log.user_name !==
                users.find((u) => u.id === parseInt(filters.user_id))?.name
        )
            return false;
        if (filters.action && log.action !== filters.action) return false;
        if (filters.model_type && log.model_type !== filters.model_type)
            return false;
        if (
            searchTerm &&
            !log.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !log.user_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
            return false;
        return true;
    });

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    Activity Logs
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Complete audit trail of system activities
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                            {Object.values(filters).some((v) => v) && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {showFilters && (
                            <div className="p-4 border-b border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* User Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            User
                                        </label>
                                        <select
                                            value={filters.user_id}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "user_id",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">All Users</option>
                                            {users.map((user) => (
                                                <option
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Action Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Action
                                        </label>
                                        <select
                                            value={filters.action}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "action",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">
                                                All Actions
                                            </option>
                                            {actions.map((action, idx) => (
                                                <option
                                                    key={idx}
                                                    value={action}
                                                >
                                                    {action
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        action.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Model Type Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Model Type
                                        </label>
                                        <select
                                            value={filters.model_type}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "model_type",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">All Types</option>
                                            {modelTypes.map((type, idx) => (
                                                <option key={idx} value={type}>
                                                    {formatModelName(type)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date From */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date From
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.date_from}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "date_from",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Date To */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date To
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.date_to}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "date_to",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Search Bar */}
                        <div className="p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && handleSearch()
                                    }
                                    placeholder="Search by description or user name..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Activity Logs Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Timestamp
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Model
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedLogs.length > 0 ? (
                                        paginatedLogs.map((log) => (
                                            <tr
                                                key={log.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(log.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm mr-3">
                                                            {log.user_name
                                                                ?.charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {log.user_name}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {log.user_email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(
                                                            log.action
                                                        )}`}
                                                    >
                                                        {getActionIcon(
                                                            log.action
                                                        )}
                                                        {log.action
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            log.action.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {getModelIcon(
                                                            log.model_type
                                                        )}
                                                        <span className="text-sm text-gray-900">
                                                            {formatModelName(
                                                                log.model_type
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-md">
                                                        {log.description}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-12 text-center"
                                            >
                                                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                <p className="text-gray-600">
                                                    No activity logs found
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Try adjusting your filters
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {paginatedLogs.length > 0 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.max(1, prev - 1)
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        totalPages,
                                                        prev + 1
                                                    )
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing{" "}
                                                <span className="font-medium">
                                                    {(currentPage - 1) *
                                                        itemsPerPage +
                                                        1}
                                                </span>{" "}
                                                to{" "}
                                                <span className="font-medium">
                                                    {Math.min(
                                                        currentPage *
                                                            itemsPerPage,
                                                        filteredLogs.length
                                                    )}
                                                </span>{" "}
                                                of{" "}
                                                <span className="font-medium">
                                                    {filteredLogs.length}
                                                </span>{" "}
                                                results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                <button
                                                    onClick={() =>
                                                        setCurrentPage((prev) =>
                                                            Math.max(
                                                                1,
                                                                prev - 1
                                                            )
                                                        )
                                                    }
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>

                                                {[...Array(totalPages)].map(
                                                    (_, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    idx + 1
                                                                )
                                                            }
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                currentPage ===
                                                                idx + 1
                                                                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            {idx + 1}
                                                        </button>
                                                    )
                                                )}

                                                <button
                                                    onClick={() =>
                                                        setCurrentPage((prev) =>
                                                            Math.min(
                                                                totalPages,
                                                                prev + 1
                                                            )
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage ===
                                                        totalPages
                                                    }
                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </nav>
                                        </div>
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
