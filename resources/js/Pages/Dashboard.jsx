import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    FileText,
    Building2,
    ClipboardCheck,
    AlertTriangle,
    TrendingUp,
    Calendar,
    Users,
    CheckCircle,
} from "lucide-react";

export default function Dashboard({
    auth,
    stats,
    recentPermits,
    upcomingInspections,
    expiringPermits,
}) {
    const statCards = [
        {
            title: "Total Businesses",
            value: stats.totalBusinesses,
            icon: Building2,
            color: "bg-blue-500",
            textColor: "text-blue-600",
            bgLight: "bg-blue-50",
        },
        {
            title: "Active Permits",
            value: stats.activePermits,
            icon: FileText,
            color: "bg-green-500",
            textColor: "text-green-600",
            bgLight: "bg-green-50",
        },
        {
            title: "Pending Inspections",
            value: stats.pendingInspections,
            icon: ClipboardCheck,
            color: "bg-yellow-500",
            textColor: "text-yellow-600",
            bgLight: "bg-yellow-50",
        },
        {
            title: "Open Violations",
            value: stats.openViolations,
            icon: AlertTriangle,
            color: "bg-red-500",
            textColor: "text-red-600",
            bgLight: "bg-red-50",
        },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            Active: "bg-green-100 text-green-800",
            "Expiring Soon": "bg-yellow-100 text-yellow-800",
            Expired: "bg-red-100 text-red-800",
            Pending: "bg-blue-100 text-blue-800",
            Passed: "bg-green-100 text-green-800",
            Failed: "bg-red-100 text-red-800",
        };
        return styles[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Dashboard
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Welcome back, {auth.user.name}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            {stat.title}
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">
                                            {stat.value}
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Expiring Permits */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Expiring Permits
                                    </h2>
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <div className="p-6">
                                {expiringPermits?.length > 0 ? (
                                    <div className="space-y-4">
                                        {expiringPermits.map((permit) => (
                                            <div
                                                key={permit.id}
                                                className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {
                                                            permit.business
                                                                .business_name
                                                        }
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Expires:{" "}
                                                        {new Date(
                                                            permit.expiry_date
                                                        ).toLocaleDateString()}
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
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No expiring permits
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Upcoming Inspections */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Upcoming Inspections
                                    </h2>
                                    <ClipboardCheck className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <div className="p-6">
                                {upcomingInspections?.length > 0 ? (
                                    <div className="space-y-4">
                                        {upcomingInspections.map(
                                            (inspection) => (
                                                <div
                                                    key={inspection.id}
                                                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">
                                                            {
                                                                inspection
                                                                    .business
                                                                    .business_name
                                                            }
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {new Date(
                                                                inspection.inspection_date
                                                            ).toLocaleDateString()}{" "}
                                                            at{" "}
                                                            {
                                                                inspection.inspection_time
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Type:{" "}
                                                            {
                                                                inspection.inspection_type
                                                            }
                                                        </p>
                                                    </div>
                                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No upcoming inspections
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Permits */}
                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Recent Permits
                                </h2>
                                <FileText className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Permit Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Business Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Issue Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentPermits?.length > 0 ? (
                                        recentPermits.map((permit) => (
                                            <tr
                                                key={permit.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {permit.permit_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {
                                                        permit.business
                                                            .business_name
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {permit.permit_type}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(
                                                        permit.issue_date
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                                            permit.status
                                                        )}`}
                                                    >
                                                        {permit.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                No recent permits
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
