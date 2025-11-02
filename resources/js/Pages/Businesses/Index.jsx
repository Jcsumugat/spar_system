import { Head, Link, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import {
    Building2,
    Search,
    Filter,
    Plus,
    Phone,
    Mail,
    MapPin,
    FileText,
    ClipboardCheck,
    AlertTriangle,
    Edit,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    X,
    User,
    Briefcase,
    Users,
} from "lucide-react";

export default function Index({ auth, businesses, barangays, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [barangayFilter, setBarangayFilter] = useState(
        filters.barangay || "all"
    );
    const [typeFilter, setTypeFilter] = useState(
        filters.business_type || "all"
    );
    const [showFilters, setShowFilters] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState(null);

    const editForm = useForm({
        business_name: "",
        owner_name: "",
        business_type: "",
        address: "",
        barangay: "",
        contact_number: "",
        email: "",
        establishment_category: "",
        number_of_employees: "",
        is_active: true,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("businesses.index"),
            {
                search: search,
                barangay: barangayFilter,
                business_type: typeFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleReset = () => {
        setSearch("");
        setBarangayFilter("all");
        setTypeFilter("all");
        router.get(route("businesses.index"));
    };

    const handleDelete = (business) => {
        if (
            confirm(
                `Are you sure you want to delete ${business.business_name}? This action cannot be undone.`
            )
        ) {
            router.delete(route("businesses.destroy", business.id));
        }
    };

    const handleView = (business) => {
        setSelectedBusiness(business);
        setViewModal(true);
    };

    const handleEdit = (business) => {
        setSelectedBusiness(business);
        editForm.setData({
            business_name: business.business_name,
            owner_name: business.owner_name,
            business_type: business.business_type,
            address: business.address,
            barangay: business.barangay,
            contact_number: business.contact_number,
            email: business.email || "",
            establishment_category: business.establishment_category || "",
            number_of_employees: business.number_of_employees || "",
            is_active: business.is_active,
        });
        setEditModal(true);
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        editForm.put(route("businesses.update", selectedBusiness.id), {
            onSuccess: () => {
                setEditModal(false);
                setSelectedBusiness(null);
            },
        });
    };

    const getStatusBadge = (business) => {
        if (!business.is_active) {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    Inactive
                </span>
            );
        }
        if (business.sanitary_permits_count > 0) {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Active
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                No Permit
            </span>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Businesses" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Businesses
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Manage registered businesses and
                                    establishments
                                </p>
                            </div>
                            <Link
                                href={route("businesses.create")}
                                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Register Business
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Businesses
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {businesses.total}
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Food Establishments
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {
                                            businesses.data.filter(
                                                (b) =>
                                                    b.business_type === "Food"
                                            ).length
                                        }
                                    </p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <Building2 className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Non-Food Establishments
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {
                                            businesses.data.filter(
                                                (b) =>
                                                    b.business_type ===
                                                    "Non-Food Establishment"
                                            ).length
                                        }
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg">
                                    <Building2 className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Active Permits
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {
                                            businesses.data.filter(
                                                (b) =>
                                                    b.sanitary_permits_count > 0
                                            ).length
                                        }
                                    </p>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-lg">
                                    <FileText className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-50 p-4 mb-6">
                        <form onSubmit={handleSearch}>
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Search */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            placeholder="Search by business name, owner, or contact..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Filter Toggle (Mobile) */}
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    <Filter className="w-5 h-5 mr-2" />
                                    Filters
                                </button>

                                {/* Desktop Filters */}
                                <div className="hidden lg:flex gap-4">
                                    <select
                                        value={barangayFilter}
                                        onChange={(e) =>
                                            setBarangayFilter(e.target.value)
                                        }
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">
                                            All Barangays
                                        </option>
                                        {barangays.map((barangay) => (
                                            <option
                                                key={barangay}
                                                value={barangay}
                                            >
                                                {barangay}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={typeFilter}
                                        onChange={(e) =>
                                            setTypeFilter(e.target.value)
                                        }
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="Food Establishment">
                                            Food Establishment
                                        </option>
                                        <option value="Non-Food Establishment">
                                            Non-Food Establishment
                                        </option>
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-1">
                                    <button
                                        type="submit"
                                        className="flex-1 lg:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Search
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Filters */}
                            {showFilters && (
                                <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
                                    <select
                                        value={barangayFilter}
                                        onChange={(e) =>
                                            setBarangayFilter(e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">
                                            All Barangays
                                        </option>
                                        {barangays.map((barangay) => (
                                            <option
                                                key={barangay}
                                                value={barangay}
                                            >
                                                {barangay}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={typeFilter}
                                        onChange={(e) =>
                                            setTypeFilter(e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="Food Establishment">
                                            Food Establishment
                                        </option>
                                        <option value="Non-Food Establishment">
                                            Non-Food Establishment
                                        </option>
                                    </select>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Business List */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {businesses.data.length > 0 ? (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Business
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Owner
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Location
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {businesses.data.map((business) => (
                                                <tr
                                                    key={business.id}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {
                                                                    business.business_name
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                                                <Phone className="w-3 h-3 mr-1" />
                                                                {
                                                                    business.contact_number
                                                                }
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {
                                                                business.owner_name
                                                            }
                                                        </div>
                                                        {business.email && (
                                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                                                <Mail className="w-3 h-3 mr-1" />
                                                                {business.email}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                business.business_type ===
                                                                "Food Establishment"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-purple-100 text-purple-800"
                                                            }`}
                                                        >
                                                            {
                                                                business.business_type
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 flex items-start">
                                                            <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                <div>
                                                                    {
                                                                        business.barangay
                                                                    }
                                                                </div>
                                                                <div className="text-gray-500 text-xs mt-1">
                                                                    {
                                                                        business.address
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(
                                                            business
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <button
                                                                onClick={() =>
                                                                    handleView(
                                                                        business
                                                                    )
                                                                }
                                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="View"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        business
                                                                    )
                                                                }
                                                                className="p-1 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        business
                                                                    )
                                                                }
                                                                className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden divide-y divide-gray-200">
                                    {businesses.data.map((business) => (
                                        <div
                                            key={business.id}
                                            className="p-4 hover:bg-gray-50"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900">
                                                        {business.business_name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {business.owner_name}
                                                    </p>
                                                </div>
                                                {getStatusBadge(business)}
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center text-gray-600">
                                                    <Phone className="w-4 h-4 mr-2" />
                                                    {business.contact_number}
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <MapPin className="w-4 h-4 mr-2" />
                                                    {business.barangay}
                                                </div>
                                                <div>
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            business.business_type ===
                                                            "Food Establishment"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-purple-100 text-purple-800"
                                                        }`}
                                                    >
                                                        {business.business_type}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 text-sm">
                                                {business.sanitary_permits_count >
                                                    0 && (
                                                    <div className="flex items-center">
                                                        <FileText className="w-4 h-4 text-blue-600 mr-1" />
                                                        <span>
                                                            {
                                                                business.sanitary_permits_count
                                                            }{" "}
                                                            Permit
                                                            {business.sanitary_permits_count !==
                                                            1
                                                                ? "s"
                                                                : ""}
                                                        </span>
                                                    </div>
                                                )}
                                                {business.inspections_count >
                                                    0 && (
                                                    <div className="flex items-center">
                                                        <ClipboardCheck className="w-4 h-4 text-green-600 mr-1" />
                                                        <span>
                                                            {
                                                                business.inspections_count
                                                            }{" "}
                                                            Inspection
                                                            {business.inspections_count !==
                                                            1
                                                                ? "s"
                                                                : ""}
                                                        </span>
                                                    </div>
                                                )}
                                                {business.violations_count >
                                                    0 && (
                                                    <div className="flex items-center">
                                                        <AlertTriangle className="w-4 h-4 text-red-600 mr-1" />
                                                        <span>
                                                            {
                                                                business.violations_count
                                                            }{" "}
                                                            Violation
                                                            {business.violations_count !==
                                                            1
                                                                ? "s"
                                                                : ""}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1 mt-4">
                                                <button
                                                    onClick={() =>
                                                        handleView(business)
                                                    }
                                                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 text-center rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleEdit(business)
                                                    }
                                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(business)
                                                    }
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing{" "}
                                        <span className="font-medium">
                                            {businesses.from}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-medium">
                                            {businesses.to}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-medium">
                                            {businesses.total}
                                        </span>{" "}
                                        results
                                    </div>
                                    <div className="flex gap-1">
                                        {businesses.prev_page_url && (
                                            <Link
                                                href={businesses.prev_page_url}
                                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </Link>
                                        )}
                                        {businesses.next_page_url && (
                                            <Link
                                                href={businesses.next_page_url}
                                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No businesses found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {search ||
                                    barangayFilter !== "all" ||
                                    typeFilter !== "all"
                                        ? "Try adjusting your search or filters"
                                        : "Get started by registering your first business"}
                                </p>
                                {!search &&
                                    barangayFilter === "all" &&
                                    typeFilter === "all" && (
                                        <Link
                                            href={route("businesses.create")}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Plus className="w-5 h-5 mr-2" />
                                            Register Business
                                        </Link>
                                    )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* View Modal */}
            {viewModal && selectedBusiness && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                Business Details
                            </h2>
                            <button
                                onClick={() => setViewModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Business Info */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Business Information
                                    </h3>
                                    {getStatusBadge(selectedBusiness)}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Business Name
                                        </label>
                                        <div className="flex items-center mt-1">
                                            <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                                            <p className="text-gray-900">
                                                {selectedBusiness.business_name}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Business Type
                                        </label>
                                        <div className="flex items-center mt-1">
                                            <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                                            <p className="text-gray-900">
                                                {selectedBusiness.business_type}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedBusiness.establishment_category && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Category
                                            </label>
                                            <p className="text-gray-900 mt-1">
                                                {
                                                    selectedBusiness.establishment_category
                                                }
                                            </p>
                                        </div>
                                    )}
                                    {selectedBusiness.number_of_employees && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Number of Employees
                                            </label>
                                            <div className="flex items-center mt-1">
                                                <Users className="w-4 h-4 text-gray-400 mr-2" />
                                                <p className="text-gray-900">
                                                    {
                                                        selectedBusiness.number_of_employees
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Owner Info */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Owner Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Owner Name
                                        </label>
                                        <div className="flex items-center mt-1">
                                            <User className="w-4 h-4 text-gray-400 mr-2" />
                                            <p className="text-gray-900">
                                                {selectedBusiness.owner_name}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Contact Number
                                        </label>
                                        <div className="flex items-center mt-1">
                                            <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                            <p className="text-gray-900">
                                                {
                                                    selectedBusiness.contact_number
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    {selectedBusiness.email && (
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium text-gray-500">
                                                Email
                                            </label>
                                            <div className="flex items-center mt-1">
                                                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                                <p className="text-gray-900">
                                                    {selectedBusiness.email}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Location Info */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Location
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Barangay
                                        </label>
                                        <div className="flex items-center mt-1">
                                            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                            <p className="text-gray-900">
                                                {selectedBusiness.barangay}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Full Address
                                        </label>
                                        <p className="text-gray-900 mt-1">
                                            {selectedBusiness.address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Statistics
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-blue-900">
                                            {
                                                selectedBusiness.sanitary_permits_count
                                            }
                                        </p>
                                        <p className="text-sm text-blue-600">
                                            Permit
                                            {selectedBusiness.sanitary_permits_count !==
                                            1
                                                ? "s"
                                                : ""}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 text-center">
                                        <ClipboardCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-green-900">
                                            {selectedBusiness.inspections_count}
                                        </p>
                                        <p className="text-sm text-green-600">
                                            Inspection
                                            {selectedBusiness.inspections_count !==
                                            1
                                                ? "s"
                                                : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                            <button
                                onClick={() => setViewModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setViewModal(false);
                                    handleEdit(selectedBusiness);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Edit Business
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal && selectedBusiness && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                Edit Business
                            </h2>
                            <button
                                onClick={() => {
                                    setEditModal(false);
                                    editForm.reset();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit}>
                            <div className="p-6 space-y-6">
                                {/* Business Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Business Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Business Name
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    editForm.data.business_name
                                                }
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "business_name",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            {editForm.errors.business_name && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {
                                                        editForm.errors
                                                            .business_name
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Business Type
                                                </label>
                                                <select
                                                    value={
                                                        editForm.data
                                                            .business_type
                                                    }
                                                    onChange={(e) =>
                                                        editForm.setData(
                                                            "business_type",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                >
                                                    <option value="Food Establishment">
                                                        Food Establishment
                                                    </option>
                                                    <option value="Non-Food Establishment">
                                                        Non-Food Establishment
                                                    </option>
                                                </select>
                                                {editForm.errors
                                                    .business_type && (
                                                    <p className="text-red-600 text-sm mt-1">
                                                        {
                                                            editForm.errors
                                                                .business_type
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Establishment Category
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        editForm.data
                                                            .establishment_category
                                                    }
                                                    onChange={(e) =>
                                                        editForm.setData(
                                                            "establishment_category",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="e.g., Restaurant, Hotel"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Number of Employees
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    editForm.data
                                                        .number_of_employees
                                                }
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "number_of_employees",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Owner Information */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Owner Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Owner Name
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.data.owner_name}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "owner_name",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            {editForm.errors.owner_name && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {editForm.errors.owner_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Contact Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        editForm.data
                                                            .contact_number
                                                    }
                                                    onChange={(e) =>
                                                        editForm.setData(
                                                            "contact_number",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                                {editForm.errors
                                                    .contact_number && (
                                                    <p className="text-red-600 text-sm mt-1">
                                                        {
                                                            editForm.errors
                                                                .contact_number
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={editForm.data.email}
                                                    onChange={(e) =>
                                                        editForm.setData(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                {editForm.errors.email && (
                                                    <p className="text-red-600 text-sm mt-1">
                                                        {editForm.errors.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Location
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Barangay
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.data.barangay}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "barangay",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            {editForm.errors.barangay && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {editForm.errors.barangay}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Address
                                            </label>
                                            <textarea
                                                value={editForm.data.address}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "address",
                                                        e.target.value
                                                    )
                                                }
                                                rows="3"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            {editForm.errors.address && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {editForm.errors.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="border-t border-gray-200 pt-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={editForm.data.is_active}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "is_active",
                                                    e.target.checked
                                                )
                                            }
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Business is active
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditModal(false);
                                        editForm.reset();
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editForm.processing
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
