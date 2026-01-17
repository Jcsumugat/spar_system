import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    FileText,
    Filter,
    Download,
    TrendingUp,
    Building2,
    ClipboardCheck,
    FlaskConical,
    Award,
    BarChart3,
    RefreshCw,
    ChevronRight,
    ChevronLeft,
    X,
} from "lucide-react";

const barangays = [
    "Alegre",
    "Amar",
    "Bandoja",
    "Castillo",
    "Esparagoza",
    "Importante",
    "La Paz",
    "Malabor",
    "Martinez",
    "Natividad",
    "Poblacion",
    "Pitac",
    "Salazar",
    "San Francisco Norte",
    "San Francisco Sur",
    "San Isidro",
    "Santa Ana",
    "Santa Justa",
    "Santo Rosario",
    "Tigbaboy",
    "Tuno",
];

export default function Reports({
    auth,
    reportType = "overview",
    stats = {},
    savedReports = [],
}) {
    const [activeTab, setActiveTab] = useState(reportType);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [filters, setFilters] = useState({
        date_from: "",
        date_to: "",
        search: "",
        // Business filters
        business_type: "",
        barangay: "",
        permit_status: "",
        // Inspection filters
        result: "",
        inspection_type: "",
        inspector_id: "",
        // Permit filters
        status: "",
        permit_type: "",
        expiring_soon: false,
        // Lab filters
        application_type: "",
        overall_result: "",
        // Activity filters
        action: "",
        user_id: "",
    });

    const reportTypes = [
        { id: "overview", name: "Overview", icon: TrendingUp, color: "blue" },
        { id: "business", name: "Business", icon: Building2, color: "indigo" },
        {
            id: "inspection",
            name: "Inspection",
            icon: ClipboardCheck,
            color: "purple",
        },
        { id: "permit", name: "Permit", icon: Award, color: "green" },
        { id: "lab", name: "Lab Reports", icon: FlaskConical, color: "orange" },
    ];

    const dateRanges = [
        { id: "all", label: "All Time" },
        { id: "today", label: "Today" },
        { id: "week", label: "This Week" },
        { id: "month", label: "This Month" },
        { id: "year", label: "This Year" },
        { id: "custom", label: "Custom Range" },
    ];
    useEffect(() => {
        if (activeTab !== "overview") {
            fetchReportData();
        }
    }, [activeTab]);

    useEffect(() => {
        if (dateRange !== "custom") {
            const dates = getDateRangeValues(dateRange);
            setFilters((prev) => ({ ...prev, ...dates }));
        }
    }, [dateRange]);

    // Debounce search and filters to avoid too many API calls
    useEffect(() => {
        if (activeTab === "overview") return;

        const timeoutId = setTimeout(() => {
            setCurrentPage(1); // Reset to first page when filters change
            fetchReportData();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [
        filters.date_from,
        filters.date_to,
        filters.search,
        filters.business_type,
        filters.barangay,
        filters.permit_status,
        filters.result,
        filters.inspection_type,
        filters.inspector_id,
        filters.status,
        filters.permit_type,
        filters.expiring_soon,
        filters.application_type,
        filters.overall_result,
        filters.action,
        filters.user_id,
    ]);

    // Reset to first page when changing tabs
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const getDateRangeValues = (range) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day

        let date_from = "";
        let date_to = "";

        switch (range) {
            case "today":
                date_from = today.toISOString().split("T")[0];
                date_to = today.toISOString().split("T")[0];
                break;
            case "week":
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                date_from = weekAgo.toISOString().split("T")[0];
                date_to = today.toISOString().split("T")[0];
                break;
            case "month":
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                date_from = monthAgo.toISOString().split("T")[0];
                date_to = today.toISOString().split("T")[0];
                break;
            case "year":
                const yearAgo = new Date(today);
                yearAgo.setFullYear(yearAgo.getFullYear() - 1);
                date_from = yearAgo.toISOString().split("T")[0];
                date_to = today.toISOString().split("T")[0];
                break;
            case "all":
                date_from = "";
                date_to = "";
                break;
            case "custom":
                // Don't override custom dates
                return {};
        }

        return { date_from, date_to };
    };

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            // Add common filters
            if (filters.date_from)
                params.append("date_from", filters.date_from);
            if (filters.date_to) params.append("date_to", filters.date_to);
            if (filters.search) params.append("search", filters.search);

            // Add report-specific filters
            switch (activeTab) {
                case "business":
                    if (filters.business_type)
                        params.append("business_type", filters.business_type);
                    if (filters.barangay)
                        params.append("barangay", filters.barangay);
                    if (filters.permit_status)
                        params.append("permit_status", filters.permit_status);
                    break;
                case "inspection":
                    if (filters.result) params.append("result", filters.result);
                    if (filters.inspection_type)
                        params.append(
                            "inspection_type",
                            filters.inspection_type
                        );
                    if (filters.inspector_id)
                        params.append("inspector_id", filters.inspector_id);
                    break;
                case "permit":
                    if (filters.status) params.append("status", filters.status);
                    if (filters.permit_type)
                        params.append("permit_type", filters.permit_type);
                    if (filters.expiring_soon)
                        params.append("expiring_soon", "1");
                    break;
                case "lab":
                    if (filters.application_type)
                        params.append(
                            "application_type",
                            filters.application_type
                        );
                    if (filters.overall_result)
                        params.append("overall_result", filters.overall_result);
                    break;
                case "activity":
                    if (filters.action) params.append("action", filters.action);
                    if (filters.user_id)
                        params.append("user_id", filters.user_id);
                    break;
            }

            const response = await fetch(`/reports/${activeTab}?${params}`);
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleDateChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));

        if (dateRange !== "custom") {
            setDateRange("custom");
        }
    };

    const getSearchPlaceholder = () => {
        switch (activeTab) {
            case "business":
                return "Search by business name, owner, or contact...";
            case "inspection":
                return "Search by business name or inspection number...";
            case "permit":
                return "Search by business name or permit number...";
            case "lab":
                return "Search by business name...";
            default:
                return "Search records...";
        }
    };

    const resetFilters = () => {
        setFilters({
            date_from: "",
            date_to: "",
            search: "",
            business_type: "",
            barangay: "",
            permit_status: "",
            result: "",
            inspection_type: "",
            inspector_id: "",
            status: "",
            permit_type: "",
            expiring_soon: false,
            application_type: "",
            overall_result: "",
            action: "",
            user_id: "",
        });
        setDateRange("all");
        setCurrentPage(1);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.search) count++;
        if (dateRange !== "all") count++;

        switch (activeTab) {
            case "business":
                if (filters.business_type) count++;
                if (filters.barangay) count++;
                if (filters.permit_status) count++;
                break;
            case "inspection":
                if (filters.result) count++;
                if (filters.inspection_type) count++;
                if (filters.inspector_id) count++;
                break;
            case "permit":
                if (filters.status) count++;
                if (filters.permit_type) count++;
                if (filters.expiring_soon) count++;
                break;
            case "lab":
                if (filters.application_type) count++;
                if (filters.overall_result) count++;
                break;
            case "activity":
                if (filters.action) count++;
                if (filters.user_id) count++;
                break;
        }
        return count;
    };

    const getTableColumns = () => {
        switch (activeTab) {
            case "business":
                return [
                    { key: "id", label: "#", width: "w-20" },
                    {
                        key: "business_name",
                        label: "Business Name",
                        width: "w-48",
                    },
                    { key: "owner_name", label: "Owner", width: "w-40" },
                    { key: "business_type", label: "Type", width: "w-40" },
                    { key: "barangay", label: "Barangay", width: "w-32" },
                    { key: "contact_number", label: "Contact", width: "w-32" },
                    { key: "permit_status", label: "Status", width: "w-32" },
                ];
            case "inspection":
                return [
                    {
                        key: "inspection_number",
                        label: "Inspection #",
                        width: "w-32",
                    },
                    { key: "business_name", label: "Business", width: "w-48" },
                    { key: "inspection_type", label: "Type", width: "w-32" },
                    { key: "inspection_date", label: "Date", width: "w-32" },
                    {
                        key: "inspector_name",
                        label: "Inspector",
                        width: "w-40",
                    },
                    { key: "result", label: "Result", width: "w-28" },
                ];
            case "permit":
                return [
                    { key: "permit_number", label: "Permit #", width: "w-32" },
                    { key: "business_name", label: "Business", width: "w-48" },
                    { key: "permit_type", label: "Type", width: "w-24" },
                    { key: "issue_date", label: "Issue Date", width: "w-32" },
                    { key: "expiry_date", label: "Expiry Date", width: "w-32" },
                    { key: "status", label: "Status", width: "w-32" },
                ];
            case "lab":
                return [
                    { key: "id", label: "#", width: "w-20" },
                    { key: "business_name", label: "Business", width: "w-48" },
                    { key: "application_type", label: "Type", width: "w-24" },
                    {
                        key: "submitted_by_name",
                        label: "Submitted By",
                        width: "w-40",
                    },
                    { key: "status", label: "Status", width: "w-28" },
                    { key: "overall_result", label: "Result", width: "w-24" },
                    { key: "submitted_at", label: "Date", width: "w-32" },
                ];
            default:
                return [];
        }
    };

    const renderCellValue = (item, column) => {
        const value = item[column.key];

        if (
            column.key === "status" ||
            column.key === "result" ||
            column.key === "permit_status"
        ) {
            const statusValue = value || "N/A";
            const statusLower = statusValue.toLowerCase();
            let statusClass = "bg-gray-100 text-gray-800 border-gray-200";

            if (["active", "approved", "pass"].includes(statusLower)) {
                statusClass = "bg-green-100 text-green-800 border-green-200";
            } else if (["pending", "under review"].includes(statusLower)) {
                statusClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
            } else if (
                ["denied", "rejected", "expired", "fail", "failed"].includes(
                    statusLower
                )
            ) {
                statusClass = "bg-red-100 text-red-800 border-red-200";
            } else if (["expiring soon"].includes(statusLower)) {
                statusClass = "bg-orange-100 text-orange-800 border-orange-200";
            }

            return (
                <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${statusClass}`}
                >
                    {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
                </span>
            );
        }

        if (column.key === "overall_result") {
            if (!value) return <span className="text-gray-400">-</span>;
            const resultClass =
                value === "pass"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200";
            return (
                <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${resultClass}`}
                >
                    {value}
                </span>
            );
        }

        // Format dates without time - matches Excel export format
        if (
            column.key.includes("date") ||
            column.key === "created_at" ||
            column.key === "submitted_at"
        ) {
            if (!value) return <span className="text-gray-400">-</span>;
            const date = new Date(value);
            // Format as MM/DD/YYYY (matching the Excel export)
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        }

        if (column.key === "business_type") {
            const icon = value === "Food Establishment" ? "🍽️" : "🏪";
            return (
                <span className="text-sm text-gray-700">
                    {icon} {value || "N/A"}
                </span>
            );
        }

        return <span className="text-sm text-gray-900">{value || "-"}</span>;
    };

    const [showExportMenu, setShowExportMenu] = useState(false);
    const [exporting, setExporting] = useState(false);

    const exportReport = async (format) => {
        setExporting(true);
        setShowExportMenu(false);

        try {
            // For print preview, open directly in new window using GET request
            if (format === "print") {
                const params = new URLSearchParams({
                    type: activeTab,
                    format: "print",
                    filters: JSON.stringify(filters),
                });

                // Open in new window
                window.open(`/reports/export?${params.toString()}`, "_blank");
                setExporting(false);
                return;
            }

            // For HTML preview (manual browser PDF), also open in new window
            if (format === "html") {
                const params = new URLSearchParams({
                    type: activeTab,
                    format: "html",
                    filters: JSON.stringify(filters),
                });

                // Open in new window
                window.open(`/reports/export?${params.toString()}`, "_blank");
                setExporting(false);
                return;
            }

            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            // For other formats (CSV, Excel, PDF), use fetch for download
            const response = await fetch("/reports/export", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                },
                body: JSON.stringify({
                    type: activeTab,
                    format: format,
                    filters,
                }),
                credentials: "same-origin",
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorMessage = `Export failed with status ${response.status}`;

                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage =
                        errorData.message || errorData.error || errorMessage;
                    console.error("Error details:", errorData);
                } else {
                    const errorText = await response.text();
                    console.error("Export error:", errorText);
                    errorMessage = errorText.substring(0, 200);
                }

                throw new Error(errorMessage);
            }

            // For direct downloads (Excel, CSV, PDF)
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;

            let extension = format;
            if (format === "excel") extension = "csv";

            const timestamp = new Date().toISOString().split("T")[0];
            a.download = `${activeTab}_report_${timestamp}.${extension}`;

            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 100);

            const formatName =
                format === "excel" ? "CSV" : format.toUpperCase();
            alert(`${formatName} report downloaded successfully!`);
        } catch (error) {
            console.error("Export error:", error);
            alert(`Export failed: ${error.message}`);
        } finally {
            setExporting(false);
        }
    };

    const renderOverview = () => {
        const defaultStats = {
            total_businesses: 0,
            active_permits: 0,
            pending_inspections: 0,
            pending_lab_reports: 0,
            this_month_businesses: 0,
            this_month_permits: 0,
            this_month_inspections: 0,
            expiring_permits: 0,
            ...stats,
        };
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Businesses"
                        value={defaultStats.total_businesses}
                        change={`+${defaultStats.this_month_businesses} this month`}
                        icon={Building2}
                        color="blue"
                        trend="up"
                    />
                    <StatCard
                        title="Active Permits"
                        value={defaultStats.active_permits}
                        change={`+${defaultStats.this_month_permits} this month`}
                        icon={Award}
                        color="green"
                        trend="up"
                    />
                    <StatCard
                        title="Pending Inspections"
                        value={defaultStats.pending_inspections}
                        change={`${defaultStats.this_month_inspections} this month`}
                        icon={ClipboardCheck}
                        color="yellow"
                        trend="neutral"
                    />
                    <StatCard
                        title="Pending Lab Reports"
                        value={defaultStats.pending_lab_reports}
                        change={`${defaultStats.expiring_permits} expiring soon`}
                        icon={FlaskConical}
                        color="red"
                        trend="down"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Quick Reports
                            </h3>
                            <BarChart3 className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reportTypes.slice(1).map((report) => {
                                const Icon = report.icon;
                                return (
                                    <button
                                        key={report.id}
                                        onClick={() => setActiveTab(report.id)}
                                        className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-white border border-gray-200 rounded-lg p-4 text-left transition-all duration-200 hover:shadow-md hover:border-blue-300"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="inline-flex p-2 rounded-lg bg-blue-100 text-blue-600 mb-3">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <h4 className="font-semibold text-gray-900 mb-1">
                                                    {report.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    View detailed{" "}
                                                    {report.name.toLowerCase()}{" "}
                                                    analytics
                                                </p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Saved Reports
                            </h3>
                            <FileText className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                            {savedReports && savedReports.length > 0 ? (
                                savedReports.slice(0, 5).map((report) => (
                                    <div
                                        key={report.id}
                                        className="group p-3 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-200"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm truncate">
                                                    {report.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {report.report_type}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-sm text-gray-500">
                                        No saved reports yet
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Create custom reports to save them
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSpecificFilters = () => {
        switch (activeTab) {
            case "business":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Type
                            </label>
                            <select
                                value={filters.business_type}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "business_type",
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">All Types</option>
                                <option value="Food Establishment">
                                    Food Establishment
                                </option>
                                <option value="Non-Food Establishment">
                                    Non-Food Establishment
                                </option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Barangay
                            </label>
                            <select
                                value={filters.barangay}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "barangay",
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">All Barangays</option>
                                {barangays.map((barangay) => (
                                    <option key={barangay} value={barangay}>
                                        {barangay}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Permit Status
                            </label>
                            <select
                                value={filters.permit_status}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "permit_status",
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Expired">Expired</option>
                                <option value="Pending">Pending</option>
                                <option value="No Permit">No Permit</option>
                            </select>
                        </div>
                    </div>
                );

            case "inspection":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Result
                            </label>
                            <select
                                value={filters.result}
                                onChange={(e) =>
                                    handleFilterChange("result", e.target.value)
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">All Results</option>
                                <option value="Approved">Approved</option>
                                <option value="Denied">Denied</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Inspection Type
                            </label>
                            <select
                                value={filters.inspection_type}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "inspection_type",
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">All Types</option>
                                <option value="Initial">Initial</option>
                                <option value="Renewal">Renewal</option>
                            </select>
                        </div>
                    </div>
                );

            case "permit":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    handleFilterChange("status", e.target.value)
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Expired">Expired</option>
                                <option value="Expiring Soon">
                                    Expiring Soon
                                </option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Permit Type
                            </label>
                            <select
                                value={filters.permit_type}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "permit_type",
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">All Types</option>
                                <option value="New">New</option>
                                <option value="Renewal">Renewal</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.expiring_soon}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "expiring_soon",
                                            e.target.checked
                                        )
                                    }
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Show Expiring Soon Only
                                </span>
                            </label>
                        </div>
                    </div>
                );

            case "lab":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Application Type
                            </label>
                            <select
                                value={filters.application_type}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "application_type",
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                11:29 PM<option value="">All Types</option>
                                <option value="New">New</option>
                                <option value="Renewal">Renewal</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Overall Result
                            </label>
                            <select
                                value={filters.overall_result}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "overall_result",
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">All Results</option>
                                <option value="pass">Pass</option>
                                <option value="fail">Fail</option>
                            </select>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderFilters = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Filters
                    </h3>
                    {getActiveFiltersCount() > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getActiveFiltersCount()} active
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    {getActiveFiltersCount() > 0 && (
                        <button
                            onClick={resetFilters}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reset
                        </button>
                    )}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {showFilters ? "Hide" : "Show"} Filters
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="space-y-4">
                    {/* Date Range Pills */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Date Range
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {dateRanges.map((range) => (
                                <button
                                    key={range.id}
                                    onClick={() => setDateRange(range.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        dateRange === range.id
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {dateRange === "custom" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.date_from}
                                    onChange={(e) =>
                                        handleDateChange(
                                            "date_from",
                                            e.target.value
                                        )
                                    }
                                    max={filters.date_to || undefined}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.date_to}
                                    onChange={(e) =>
                                        handleDateChange(
                                            "date_to",
                                            e.target.value
                                        )
                                    }
                                    min={filters.date_from || undefined}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {/* Specific Filters */}
                    {renderSpecificFilters()}
                    {/* Search Bar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) =>
                                    handleFilterChange("search", e.target.value)
                                }
                                placeholder={getSearchPlaceholder()}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            {filters.search && (
                                <button
                                    onClick={() =>
                                        handleFilterChange("search", "")
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Pagination Logic
    const getPaginatedData = () => {
        if (!reportData?.data) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return reportData.data.slice(startIndex, endIndex);
    };

    const totalPages = reportData?.data
        ? Math.ceil(reportData.data.length / itemsPerPage)
        : 0;
    const startRecord =
        reportData?.data?.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endRecord = Math.min(
        currentPage * itemsPerPage,
        reportData?.data?.length || 0
    );

    const renderPagination = () => {
        if (!reportData?.data || reportData.data.length === 0) return null;

        const pageNumbers = [];
        const maxPageButtons = 5;
        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxPageButtons / 2)
        );
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        if (endPage - startPage < maxPageButtons - 1) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-semibold">{startRecord}</span> to{" "}
                        <span className="font-semibold">{endRecord}</span> of{" "}
                        <span className="font-semibold">
                            {reportData.data.length}
                        </span>{" "}
                        results
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">
                            Rows per page:
                        </label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        First
                    </button>
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </button>

                    <div className="flex space-x-1">
                        {startPage > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    1
                                </button>
                                {startPage > 2 && (
                                    <span className="px-3 py-2 text-sm text-gray-500">
                                        ...
                                    </span>
                                )}
                            </>
                        )}

                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    currentPage === number
                                        ? "bg-blue-600 text-white border border-blue-600"
                                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                {number}
                            </button>
                        ))}

                        {endPage < totalPages && (
                            <>
                                {endPage < totalPages - 1 && (
                                    <span className="px-3 py-2 text-sm text-gray-500">
                                        ...
                                    </span>
                                )}
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Last
                    </button>
                </div>
            </div>
        );
    };

    const renderDataTable = () => {
        if (loading) {
            return (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
                        </div>
                        <p className="mt-6 text-gray-600 font-medium">
                            Loading report data...
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Please wait while we fetch the information
                        </p>
                    </div>
                </div>
            );
        }

        if (!reportData || !reportData.data || reportData.data.length === 0) {
            return (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                    <div className="text-center text-gray-500">
                        <div className="inline-flex p-4 rounded-full bg-gray-100 mb-4">
                            <FileText className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Data Available
                        </h3>
                        <p className="text-gray-600">
                            No records found matching your criteria.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Try adjusting your filters or date range.
                        </p>
                    </div>
                </div>
            );
        }

        const columns = getTableColumns();
        const paginatedData = getPaginatedData();

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header with Export */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {reportTypes.find((r) => r.id === activeTab)?.name}{" "}
                            Report
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Total of {reportData.data.length} records
                        </p>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            disabled={exporting || !reportData?.data?.length}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {exporting ? "Exporting..." : "Export Report"}
                        </button>

                        {showExportMenu && !exporting && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                <div className="py-1">
                                    <button
                                        onClick={() => exportReport("excel")}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors flex items-center gap-3"
                                    >
                                        <FileText className="w-5 h-5 text-green-600" />
                                        <div>
                                            <div className="font-medium">
                                                Export as Excel
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                CSV format
                                            </div>
                                        </div>
                                    </button>

                                    <div className="border-t border-gray-200 my-1"></div>

                                    <button
                                        onClick={() => exportReport("pdf")}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors flex items-center gap-3"
                                    >
                                        <FileText className="w-5 h-5 text-red-600" />
                                        <div>
                                            <div className="font-medium">
                                                Download PDF
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Auto-download PDF file
                                            </div>
                                        </div>
                                    </button>

                                    <div className="border-t border-gray-200 my-1"></div>

                                    <button
                                        onClick={() => exportReport("print")}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-3"
                                    >
                                        <svg
                                            className="w-5 h-5 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                            />
                                        </svg>
                                        <div>
                                            <div className="font-medium">
                                                Print Document
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Auto-opens print dialog
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className={`${column.width} px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider`}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {paginatedData.map((item, index) => (
                                <tr
                                    key={item.id || index}
                                    className="hover:bg-blue-50 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-6 py-4 whitespace-nowrap"
                                        >
                                            {column.key === "id" ? (
                                                <span className="text-sm font-medium text-gray-900">
                                                    {(currentPage - 1) *
                                                        itemsPerPage +
                                                        index +
                                                        1}
                                                </span>
                                            ) : (
                                                renderCellValue(item, column)
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {renderPagination()}
            </div>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Reports" />

            <div className="py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Reports
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Comprehensive reporting and data analysis
                                    dashboard
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Report Type Tabs */}
                    <div className="mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                            <div className="flex gap-2 overflow-x-auto">
                                {reportTypes.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() =>
                                                setActiveTab(type.id)
                                            }
                                            className={`flex items-center gap-2 px-6 py-3 rounded-lg whitespace-nowrap transition-all font-medium ${
                                                activeTab === type.id
                                                    ? "bg-blue-600 text-white shadow-md"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {type.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {activeTab === "overview" ? (
                        renderOverview()
                    ) : (
                        <>
                            {renderFilters()}
                            {renderDataTable()}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
function StatCard({ title, value, change, icon: Icon, color, trend }) {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        yellow: "from-yellow-500 to-yellow-600",
        red: "from-red-500 to-red-600",
    };
    const trendColors = {
        up: "text-green-600 bg-green-50",
        down: "text-red-600 bg-red-50",
        neutral: "text-gray-600 bg-gray-50",
    };

    return (
        <div className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-5 rounded-full -mr-16 -mt-16`}
            ></div>

            <div className="relative">
                <div className="flex items-start justify-between mb-4">
                    <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}
                    >
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                    {title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
                <div
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${trendColors[trend]}`}
                >
                    {change}
                </div>
            </div>
        </div>
    );
}
