import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Bell,
    CheckCircle,
    Trash2,
    FileText,
    ClipboardCheck,
    RefreshCw,
    Building2,
    FlaskConical,
    Check,
    AlertCircle,
} from "lucide-react";

export default function Index({ auth, notifications, unreadCount }) {
    const getNotificationIcon = (type) => {
        switch (type) {
            case "permit_expiring":
                return <FileText className="w-5 h-5 text-yellow-600" />;
            case "inspection_due":
                return <ClipboardCheck className="w-5 h-5 text-blue-600" />;
            case "renewal_pending":
                return <RefreshCw className="w-5 h-5 text-orange-600" />;
            case "lab_report_submitted":
                return <FlaskConical className="w-5 h-5 text-purple-600" />;
            case "lab_report_reviewed":
                return <FlaskConical className="w-5 h-5 text-green-600" />;
            case "business_registered":
                return <Building2 className="w-5 h-5 text-green-600" />;
            case "inspection_approved":
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case "inspection_denied":
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getNotificationTime = (date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffMs = now - notifDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return notifDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleNotificationClick = (notification) => {
        // Mark as read if unread
        if (!notification.read_at) {
            router.post(
                route("notifications.read", notification.id),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        navigateToNotification(notification);
                    },
                }
            );
        } else {
            navigateToNotification(notification);
        }
    };

    const navigateToNotification = (notification) => {
        if (!notification.data) return;

        const data =
            typeof notification.data === "string"
                ? JSON.parse(notification.data)
                : notification.data;

        // Navigate based on notification type
        if (notification.type === "lab_report_submitted") {
            if (data.inspection_id) {
                router.visit(route("inspections.show", data.inspection_id));
            } else if (data.lab_report_id) {
                router.visit(route("lab-reports.show", data.lab_report_id));
            }
        } else if (
            [
                "inspection_progress_saved",
                "inspection_approved",
                "inspection_denied",
                "inspection_due",
            ].includes(notification.type) &&
            data.inspection_id
        ) {
            router.visit(route("inspections.show", data.inspection_id));
        } else if (
            notification.type === "lab_report_reviewed" &&
            data.lab_report_id
        ) {
            router.visit(route("lab-reports.show", data.lab_report_id));
        } else if (notification.type === "permit_expiring" && data.permit_id) {
            router.visit(route("permits.show", data.permit_id));
        } else if (data.business_id) {
            router.visit(route("businesses.show", data.business_id));
        }
    };

    const handleMarkAllRead = () => {
        if (unreadCount === 0) {
            return;
        }
        if (confirm("Mark all notifications as read?")) {
            router.post(route("notifications.read-all"));
        }
    };

    const handleDelete = (e, notificationId) => {
        e.stopPropagation();
        if (
            confirm("Delete this notification? This action cannot be undone.")
        ) {
            router.delete(route("notifications.destroy", notificationId));
        }
    };

    const unreadNotifications = notifications.data.filter((n) => !n.read_at);
    const readNotifications = notifications.data.filter((n) => n.read_at);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Notifications" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Notifications
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    {unreadCount > 0
                                        ? `You have ${unreadCount} unread notification${
                                              unreadCount > 1 ? "s" : ""
                                          }`
                                        : "All caught up!"}
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Mark All as Read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-4">
                        {/* Unread Notifications */}
                        {unreadNotifications.length > 0 && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                                    <h2 className="text-sm font-semibold text-blue-900">
                                        Unread ({unreadNotifications.length})
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {unreadNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification
                                                )
                                            }
                                            className="px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors relative"
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    {getNotificationIcon(
                                                        notification.type
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        {getNotificationTime(
                                                            notification.created_at
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                                    <button
                                                        onClick={(e) =>
                                                            handleDelete(
                                                                e,
                                                                notification.id
                                                            )
                                                        }
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete notification"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Read Notifications */}
                        {readNotifications.length > 0 && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                                    <h2 className="text-sm font-semibold text-gray-900">
                                        Earlier ({readNotifications.length})
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {readNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification
                                                )
                                            }
                                            className="px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 mt-1 opacity-60">
                                                    {getNotificationIcon(
                                                        notification.type
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-700">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        {getNotificationTime(
                                                            notification.created_at
                                                        )}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) =>
                                                        handleDelete(
                                                            e,
                                                            notification.id
                                                        )
                                                    }
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete notification"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {notifications.data.length === 0 && (
                            <div className="bg-white rounded-lg shadow p-12 text-center">
                                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No notifications
                                </h3>
                                <p className="text-sm text-gray-600">
                                    You don't have any notifications yet.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {notifications.links && notifications.links.length > 3 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            {notifications.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || "#"}
                                    preserveScroll
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
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
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
