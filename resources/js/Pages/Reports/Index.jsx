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
    Search,
    ChevronRight,
} from "lucide-react";

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
    const [filters, setFilters] = useState({
        date_from: "",
        date_to: "",
        search: "",
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
        { id: "activity", name: "Activity", icon: FileText, color: "pink" },
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
    }, [activeTab, dateRange]);

    useEffect(() => {
        if (dateRange !== "custom") {
            const dates = getDateRangeValues(dateRange);
            setFilters((prev) => ({ ...prev, ...dates }));
        }
    }, [dateRange]);

    const getDateRangeValues = (range) => {
        const today = new Date();
        let date_from = "";
        let date_to = new Date().toISOString().split("T")[0];

        switch (range) {
            case "today":
                date_from = date_to;
                break;
            case "week":
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                date_from = weekAgo.toISOString().split("T")[0];
                break;
            case "month":
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                date_from = monthAgo.toISOString().split("T")[0];
                break;
            case "year":
                const yearAgo = new Date(today);
                yearAgo.setFullYear(yearAgo.getFullYear() - 1);
                date_from = yearAgo.toISOString().split("T")[0];
                break;
            case "all":
                date_from = "";
                date_to = "";
                break;
        }

        return { date_from, date_to };
    };

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(
                Object.entries(filters).filter(([_, value]) => value !== "")
            );
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

    const applyFilters = () => {
        fetchReportData();
        setShowFilters(false);
    };

    const resetFilters = () => {
        setFilters({ date_from: "", date_to: "", search: "" });
        setDateRange("all");
        setShowFilters(false);
    };

    const getTableColumns = () => {
        switch (activeTab) {
            case "business":
                return [
                    { key: "id", label: "ID", width: "w-20" },
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
                    { key: "id", label: "ID", width: "w-20" },
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
            case "activity":
                return [
                    { key: "id", label: "ID", width: "w-20" },
                    { key: "user_name", label: "User", width: "w-40" },
                    { key: "action", label: "Action", width: "w-28" },
                    { key: "model_type", label: "Module", width: "w-32" },
                    { key: "description", label: "Description", width: "w-64" },
                    { key: "created_at", label: "Date", width: "w-40" },
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

        if (
            column.key.includes("date") ||
            column.key === "created_at" ||
            column.key === "submitted_at"
        ) {
            if (!value) return <span className="text-gray-400">-</span>;
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                ...(column.key === "created_at" && {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            });
        }

        if (column.key === "action") {
            const actionColors = {
                created: "text-blue-700 bg-blue-50 border-blue-200",
                updated: "text-purple-700 bg-purple-50 border-purple-200",
                deleted: "text-red-700 bg-red-50 border-red-200",
                approved: "text-green-700 bg-green-50 border-green-200",
                denied: "text-red-700 bg-red-50 border-red-200",
                printed: "text-gray-700 bg-gray-50 border-gray-200",
            };
            const colorClass =
                actionColors[value?.toLowerCase()] ||
                "text-gray-700 bg-gray-50 border-gray-200";

            return (
                <span
                    className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md border ${colorClass}`}
                >
                    {value}
                </span>
            );
        }

        if (column.key === "model_type") {
            const modelName = value ? value.split("\\").pop() : "N/A";
            return <span className="text-sm text-gray-700">{modelName}</span>;
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
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const response = await fetch("/reports/export", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                    Accept: "application/json",
                },
                body: JSON.stringify({ type: activeTab, format, filters }),
                credentials: "same-origin",
            });

            // Check if response is ok
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Export error response:", errorText);
                alert(
                    `Export failed: ${response.status} - ${response.statusText}`
                );
                setExporting(false);
                return;
            }

            if (format === "csv" || format === "excel") {
                // Handle file download for CSV/Excel
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${activeTab}_report_${
                    new Date().toISOString().split("T")[0]
                }.${format === "excel" ? "csv" : format}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                alert(`${format.toUpperCase()} exported successfully!`);
            } else if (format === "pdf") {
                // Handle PDF preview/print
                const html = await response.text();
                const printWindow = window.open("", "_blank");
                if (printWindow) {
                    printWindow.document.write(html);
                    printWindow.document.close();
                    setTimeout(() => {
                        printWindow.print();
                    }, 500);
                } else {
                    alert("Please allow pop-ups to view the PDF");
                }
            }
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

    const renderFilters = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Filters & Date Range
                    </h3>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    {showFilters ? "Hide" : "Show"} Filters
                </button>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quick Date Range
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

            <div
                className={`space-y-4 ${
                    showFilters || dateRange === "custom"
                        ? "block"
                        : "hidden lg:block"
                }`}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {dateRange === "custom" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    From Date
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
                                        handleFilterChange(
                                            "date_to",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </>
                    )}

                    <div
                        className={
                            dateRange === "custom" ? "" : "md:col-span-2"
                        }
                    >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search in report..."
                                value={filters.search}
                                onChange={(e) =>
                                    handleFilterChange("search", e.target.value)
                                }
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        onClick={applyFilters}
                        disabled={exporting}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={resetFilters}
                        disabled={exporting}
                        className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reset
                    </button>

                    {/* Export Dropdown */}
                    <div className="ml-auto relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            disabled={exporting}
                            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm hover:shadow-md font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4" />
                            {exporting ? "Exporting..." : "Export"}
                            <ChevronRight
                                className={`w-4 h-4 transition-transform ${
                                    showExportMenu ? "rotate-90" : ""
                                }`}
                            />
                        </button>

                        {showExportMenu && !exporting && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                <div className="py-1">
                                    <button
                                        onClick={() => exportReport("csv")}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors flex items-center gap-3"
                                    >
                                        <FileText className="w-4 h-4 text-green-600" />
                                        <div>
                                            <div className="font-medium">
                                                Export as CSV
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Comma-separated values
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => exportReport("excel")}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors flex items-center gap-3"
                                    >
                                        <FileText className="w-4 h-4 text-green-600" />
                                        <div>
                                            <div className="font-medium">
                                                Export as Excel
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Microsoft Excel format
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => exportReport("pdf")}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors flex items-center gap-3"
                                    >
                                        <FileText className="w-4 h-4 text-green-600" />
                                        <div>
                                            <div className="font-medium">
                                                Export as PDF
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Printable document
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

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

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Report Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(reportData.summary || {}).map(
                            ([key, value]) => (
                                <div
                                    key={key}
                                    className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="text-3xl font-bold text-blue-600 mb-1">
                                        {typeof value === "number"
                                            ? Math.round(value)
                                            : value}
                                    </div>
                                    <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">
                                        {key.replace(/_/g, " ")}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

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
                        <tbody className="divide-y divide-gray-200">
                            {reportData.data.slice(0, 50).map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-blue-50 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-6 py-4 whitespace-nowrap"
                                        >
                                            {renderCellValue(item, column)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Showing{" "}
                        <span className="font-semibold text-gray-900">
                            {Math.min(50, reportData.data.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-900">
                            {reportData.data.length}
                        </span>{" "}
                        results
                    </p>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Reports & Analytics" />

            <div className="py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Reports & Analytics
                            </h1>
                        </div>
                        <p className="text-gray-600 ml-14">
                            Comprehensive reporting and data analysis dashboard
                        </p>
                    </div>

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
