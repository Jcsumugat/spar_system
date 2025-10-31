import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    FileText,
    Building2,
    ClipboardCheck,
    TrendingUp,
    Calendar,
    Users,
    AlertCircle,
    BarChart3,
    PieChart,
    RefreshCw,
} from "lucide-react";

export default function Dashboard({
    stats = {},
    charts = {},
    recentActivities = {},
    alerts = {},
    userData = {},
    notifications = [],
    compliance = {},
}) {
    // Get auth from usePage hook
    const { auth } = usePage().props;

    // Safety check for auth
    if (!auth || !auth.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Businesses",
            value: stats.total_businesses || 0,
            icon: Building2,
            color: "bg-blue-500",
            textColor: "text-blue-600",
            bgLight: "bg-blue-50",
            trend: `${stats.active_businesses || 0} active`,
        },
        {
            title: "Active Permits",
            value: stats.active_permits || 0,
            icon: FileText,
            color: "bg-green-500",
            textColor: "text-green-600",
            bgLight: "bg-green-50",
            trend: `${stats.total_permits || 0} total`,
        },
        {
            title: "Pending Inspections",
            value: stats.pending_inspections || 0,
            icon: ClipboardCheck,
            color: "bg-yellow-500",
            textColor: "text-yellow-600",
            bgLight: "bg-yellow-50",
            trend: `${stats.inspections_this_month || 0} this month`,
        },
        {
            title: "Compliance Rate",
            value: `${compliance.compliance_rate || 0}%`,
            icon: TrendingUp,
            color: "bg-purple-500",
            textColor: "text-purple-600",
            bgLight: "bg-purple-50",
            trend: `${compliance.compliant_businesses || 0} compliant`,
        },
    ];

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
            <Head title="Dashboard" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Dashboard Overview
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Welcome back, {auth.user.name}! Here's what's
                            happening today.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                        {statCards.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">
                                            {stat.title}
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {stat.trend}
                                        </p>
                                    </div>
                                    <div
                                        className={`${stat.bgLight} p-3 rounded-lg`}
                                    >
                                        <stat.icon
                                            className={`w-6 h-6 ${stat.textColor}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Permit Status
                                </h3>
                                <FileText className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Expiring Soon
                                    </span>
                                    <span className="font-semibold text-yellow-600">
                                        {stats.expiring_permits || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Expired
                                    </span>
                                    <span className="font-semibold text-red-600">
                                        {stats.expired_permits || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Pending Renewals
                                    </span>
                                    <span className="font-semibold text-blue-600">
                                        {stats.pending_renewals || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Inspection Results
                                </h3>
                                <ClipboardCheck className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Passed
                                    </span>
                                    <span className="font-semibold text-green-600">
                                        {stats.passed_inspections || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Failed
                                    </span>
                                    <span className="font-semibold text-red-600">
                                        {stats.failed_inspections || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        This Month
                                    </span>
                                    <span className="font-semibold text-blue-600">
                                        {stats.inspections_this_month || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alerts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                        {/* Expiring Permits Alert */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4 sm:p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                        Permits Expiring Soon
                                    </h2>
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                {alerts.expiringPermits?.length > 0 ? (
                                    <div className="space-y-3 max-h-80 overflow-y-auto">
                                        {alerts.expiringPermits.map(
                                            (permit) => (
                                                <div
                                                    key={permit.id}
                                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:border-yellow-300 transition-colors gap-3"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">
                                                            {permit.business
                                                                ?.business_name ||
                                                                "N/A"}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Permit:{" "}
                                                            {
                                                                permit.permit_number
                                                            }
                                                        </p>
                                                        <p className="text-xs text-red-600 mt-1">
                                                            Expires:{" "}
                                                            {new Date(
                                                                permit.expiry_date
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href={`/permits/${permit.id}`}
                                                        className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors text-center sm:text-left whitespace-nowrap"
                                                    >
                                                        View
                                                    </Link>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No permits expiring in the next 30 days
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Businesses Without Permits */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4 sm:p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                        Businesses Without Active Permits
                                    </h2>
                                    <AlertCircle className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                {alerts.businessesWithoutPermits?.length > 0 ? (
                                    <div className="space-y-3 max-h-80 overflow-y-auto">
                                        {alerts.businessesWithoutPermits.map(
                                            (business) => (
                                                <div
                                                    key={business.id}
                                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200 gap-3"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">
                                                            {
                                                                business.business_name
                                                            }
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {
                                                                business.owner_name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {business.barangay}
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href={`/businesses/${business.id}`}
                                                        className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors text-center whitespace-nowrap"
                                                    >
                                                        View
                                                    </Link>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        All businesses have active permits
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pending Renewals */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                    Pending Renewals
                                </h2>
                                <RefreshCw className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                        <div className="p-4 sm:p-6">
                            {alerts.pendingRenewals?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {alerts.pendingRenewals.map((renewal) => (
                                        <div
                                            key={renewal.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 gap-3"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">
                                                    {renewal.business
                                                        ?.business_name ||
                                                        "N/A"}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Previous:{" "}
                                                    {renewal.previous_permit
                                                        ?.permit_number ||
                                                        "N/A"}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                    <span
                                                        className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(
                                                            renewal.renewal_status
                                                        )}`}
                                                    >
                                                        {renewal.renewal_status}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Requested:{" "}
                                                        {new Date(
                                                            renewal.renewal_request_date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/renewals/${renewal.id}`}
                                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors text-center whitespace-nowrap"
                                            >
                                                Process
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">
                                    No pending renewals
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                        {/* Recent Permits */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4 sm:p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                        Recent Permits
                                    </h2>
                                    <FileText className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                {recentActivities.permits?.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentActivities.permits.map(
                                            (permit) => (
                                                <div
                                                    key={permit.id}
                                                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 text-sm truncate">
                                                            {permit.business
                                                                ?.business_name ||
                                                                "N/A"}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {
                                                                permit.permit_number
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                                                                permit.status
                                                            )}`}
                                                        >
                                                            {permit.status}
                                                        </span>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(
                                                                permit.created_at
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No recent permits
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Recent Inspections */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4 sm:p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                        Recent Inspections
                                    </h2>
                                    <ClipboardCheck className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                {recentActivities.inspections?.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentActivities.inspections.map(
                                            (inspection) => (
                                                <div
                                                    key={inspection.id}
                                                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 text-sm truncate">
                                                            {inspection.business
                                                                ?.business_name ||
                                                                "N/A"}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {
                                                                inspection.inspection_type
                                                            }{" "}
                                                            •{" "}
                                                            {inspection
                                                                .inspector
                                                                ?.name || "N/A"}
                                                        </p>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                                                                inspection.result
                                                            )}`}
                                                        >
                                                            {inspection.result}
                                                        </span>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(
                                                                inspection.inspection_date
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No recent inspections
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                        {/* Business Type Distribution */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Business Type Distribution
                                </h3>
                                <PieChart className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="space-y-3">
                                {charts.businessesByType?.length > 0 ? (
                                    charts.businessesByType.map((item) => {
                                        const total =
                                            charts.businessesByType.reduce(
                                                (sum, i) => sum + i.total,
                                                0
                                            );
                                        const percentage =
                                            total > 0
                                                ? (
                                                      (item.total / total) *
                                                      100
                                                  ).toFixed(1)
                                                : 0;
                                        return (
                                            <div key={item.business_type}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-700">
                                                        {item.business_type}
                                                    </span>
                                                    <span className="font-medium text-gray-900">
                                                        {item.total} (
                                                        {percentage}%)
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500 text-center py-4">
                                        No data available
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Top Barangays */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Top Barangays by Business Count
                                </h3>
                                <BarChart3 className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="space-y-3">
                                {charts.businessesByBarangay?.length > 0 ? (
                                    charts.businessesByBarangay.map((item) => {
                                        const maxTotal = Math.max(
                                            ...charts.businessesByBarangay.map(
                                                (i) => i.total
                                            )
                                        );
                                        const percentage =
                                            maxTotal > 0
                                                ? (
                                                      (item.total / maxTotal) *
                                                      100
                                                  ).toFixed(1)
                                                : 0;
                                        return (
                                            <div key={item.barangay}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-700">
                                                        {item.barangay}
                                                    </span>
                                                    <span className="font-medium text-gray-900">
                                                        {item.total}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full transition-all"
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500 text-center py-4">
                                        No data available
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Specific Data for Inspectors */}
                    {userData && Object.keys(userData).length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                My Inspections
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        This Month
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {userData.myInspections}
                                    </p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        Total Inspections
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {userData.myInspectionsTotal}
                                    </p>
                                </div>
                            </div>
                            {userData.myRecentInspections?.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                        Recent Inspections
                                    </h3>
                                    <div className="space-y-2">
                                        {userData.myRecentInspections.map(
                                            (inspection) => (
                                                <div
                                                    key={inspection.id}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">
                                                            {
                                                                inspection
                                                                    .business
                                                                    .business_name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            {new Date(
                                                                inspection.inspection_date
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                                                            inspection.result
                                                        )}`}
                                                    >
                                                        {inspection.result}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
