import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Search, Plus, Eye, Filter, ClipboardCheck } from "lucide-react";

export default function Index({ auth, inspections, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [inspectionType, setInspectionType] = useState(
        filters.inspection_type || "all"
    );
    const [result, setResult] = useState(filters.result || "all");
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = () => {
        router.get(
            route("inspections.index"),
            { search, inspection_type: inspectionType, result },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleInspectionTypeChange = (newType) => {
        setInspectionType(newType);
        router.get(
            route("inspections.index"),
            { search, inspection_type: newType, result },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleResultChange = (newResult) => {
        setResult(newResult);
        router.get(
            route("inspections.index"),
            { search, inspection_type: inspectionType, result: newResult },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const getResultBadge = (result) => {
        const styles = {
            Passed: "bg-green-100 text-green-800 border-green-200",
            Failed: "bg-red-100 text-red-800 border-red-200",
            Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            "Passed with Conditions":
                "bg-blue-100 text-blue-800 border-blue-200",
        };

        return (
            <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    styles[result] ||
                    "bg-gray-100 text-gray-800 border-gray-200"
                }`}
            >
                {result}
            </span>
        );
    };

    const getInspectionTypeBadge = (type) => {
        const colors = {
            Initial: "bg-blue-50 text-blue-700",
            Renewal: "bg-purple-50 text-purple-700",
            "Follow-up": "bg-orange-50 text-orange-700",
            "Complaint-based": "bg-red-50 text-red-700",
            Random: "bg-gray-50 text-gray-700",
        };

        return (
            <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                    colors[type] || "bg-gray-50 text-gray-700"
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Inspections
                    </h2>
                    <Link
                        href={route("inspections.create")}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Inspection
                    </Link>
                </div>
            }
        >
            <Head title="Inspections" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                        placeholder="Search by inspection number or business name..."
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
                                    {/* Inspection Type Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Filter by Inspection Type
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                "all",
                                                "Initial",
                                                "Renewal",
                                                "Follow-up",
                                                "Complaint-based",
                                                "Random",
                                            ].map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() =>
                                                        handleInspectionTypeChange(
                                                            type
                                                        )
                                                    }
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                        inspectionType === type
                                                            ? "bg-blue-600 text-white shadow-md"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {type === "all"
                                                        ? "All Types"
                                                        : type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Result Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Filter by Result
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                "all",
                                                "Pending",
                                                "Passed",
                                                "Passed with Conditions",
                                                "Failed",
                                            ].map((resultOption) => (
                                                <button
                                                    key={resultOption}
                                                    onClick={() =>
                                                        handleResultChange(
                                                            resultOption
                                                        )
                                                    }
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                        result === resultOption
                                                            ? "bg-blue-600 text-white shadow-md"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {resultOption === "all"
                                                        ? "All Results"
                                                        : resultOption}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Inspections Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Inspection #
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Business
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Inspector
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Inspection Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Result
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {inspections.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-12 text-center"
                                            >
                                                <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                <p className="text-gray-500 text-sm">
                                                    No inspections found
                                                </p>
                                                {(search ||
                                                    inspectionType !== "all" ||
                                                    result !== "all") && (
                                                    <button
                                                        onClick={() => {
                                                            setSearch("");
                                                            setInspectionType(
                                                                "all"
                                                            );
                                                            setResult("all");
                                                            router.get(
                                                                route(
                                                                    "inspections.index"
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
                                        inspections.data.map((inspection) => (
                                            <tr
                                                key={inspection.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <ClipboardCheck className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {
                                                                inspection.inspection_number
                                                            }
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {
                                                            inspection.business
                                                                ?.business_name
                                                        }
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {
                                                            inspection.business
                                                                ?.owner_name
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getInspectionTypeBadge(
                                                        inspection.inspection_type
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {inspection.inspector
                                                        ?.name || "Unassigned"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(
                                                        inspection.inspection_date
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getResultBadge(
                                                        inspection.result
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                    <Link
                                                        href={route(
                                                            "inspections.show",
                                                            inspection.id
                                                        )}
                                                        className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Inspect
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {inspections.data.length > 0 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-700">
                                        Showing{" "}
                                        <span className="font-medium">
                                            {inspections.from}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-medium">
                                            {inspections.to}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-medium">
                                            {inspections.total}
                                        </span>{" "}
                                        results
                                    </div>
                                    <div className="flex gap-2">
                                        {inspections.links.map(
                                            (link, index) => (
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
                                            )
                                        )}
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
