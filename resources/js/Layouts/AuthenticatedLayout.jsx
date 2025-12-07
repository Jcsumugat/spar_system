import { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
    LayoutDashboard,
    Building2,
    FileText,
    ClipboardCheck,
    RefreshCw,
    BarChart3,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Bell,
    ChevronLeft,
    ChevronRight,
    FlaskConical,
    Check,
    Trash2,
} from "lucide-react";
import axios from "axios";

export default function AuthenticatedLayout({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationDropdownOpen, setNotificationDropdownOpen] =
        useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { url } = usePage();

    // Check user roles
    const isInspector = user.role === "Admin";
    const isAssistant = user.role === "Assistant";

    // Assistant navigation - only Dashboard
    const assistantNavigation = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            icon: LayoutDashboard,
            current: url === "/dashboard",
        },
    ];

    // Lab Staff navigation - only Lab Reports
    const labStaffNavigation = [
        {
            name: "Lab Reports",
            href: route("lab-reports.index"),
            icon: FlaskConical,
            current: url.startsWith("/lab-reports"),
        },
    ];

    const inspectorNavigation = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            icon: LayoutDashboard,
            current: url === "/dashboard",
        },
        {
            name: "Applicants",
            href: route("businesses.index"),
            icon: Building2,
            current: url.startsWith("/businesses"),
        },
        {
            name: "Permits",
            href: route("permits.index"),
            icon: FileText,
            current: url.startsWith("/permits"),
        },
        {
            name: "Inspections",
            href: route("inspections.index"),
            icon: ClipboardCheck,
            current: url.startsWith("/inspections"),
        },
        {
            name: "Lab Reports",
            href: route("lab-reports.index"),
            icon: FlaskConical,
            current: url.startsWith("/lab-reports"),
        },
        {
            name: "Reports",
            href: route("reports.index"),
            icon: BarChart3,
            current:
                url.startsWith("/reports") && !url.startsWith("/lab-reports"),
        },
    ];

    // Determine navigation based on user role
    const navigation = isAssistant
        ? assistantNavigation
        : isInspector
        ? inspectorNavigation
        : labStaffNavigation;

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(route("notifications.unread"));
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    // Load notifications on mount
    useEffect(() => {
        fetchNotifications();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);

        return () => clearInterval(interval);
    }, []);

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            await router.post(
                route("notifications.read", notificationId),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        fetchNotifications();
                    },
                }
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await router.post(
                route("notifications.read-all"),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        fetchNotifications();
                    },
                }
            );
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

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
            case "business_registered":
                return <Building2 className="w-5 h-5 text-green-600" />;
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
        return notifDate.toLocaleDateString();
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
        setProfileDropdownOpen(false);
        setSidebarOpen(false);
    };

    const confirmLogout = () => {
        router.post(route("logout"));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`fixed inset-y-0 left-0 z-30 bg-white shadow-lg transform transition-all duration-300 ease-in-out flex flex-col ${
                    sidebarCollapsed ? "w-20" : "w-64"
                } ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-700 to-blue-900 flex-shrink-0">
                    {!sidebarCollapsed ? (
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <img
                                    src="/images/tibiao_logo.png"
                                    alt="Tibiao Logo"
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <span className="text-white text-sm font-medium leading-tight">
                                Tibiao Antique
                                <br />
                                Rural Health Unit
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full">
                            <img
                                src="/images/tibiao-logo.png"
                                alt="Tibiao Logo"
                                className="w-10 h-10 object-contain"
                            />
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-white hover:text-gray-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* User Info */}
                {!sidebarCollapsed && (
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user.position || user.role}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Collapsed User Avatar */}
                {sidebarCollapsed && (
                    <div className="px-4 py-4 border-b border-gray-200 bg-gray-50 flex justify-center flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center ${
                                sidebarCollapsed
                                    ? "justify-center px-2"
                                    : "px-4"
                            } py-3 text-sm font-medium transition-colors ${
                                item.current
                                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-700"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                            }`}
                            title={sidebarCollapsed ? item.name : ""}
                        >
                            <item.icon
                                className={`w-5 h-5 ${
                                    sidebarCollapsed ? "" : "mr-3"
                                } ${
                                    item.current
                                        ? "text-blue-700"
                                        : "text-gray-400"
                                }`}
                            />
                            {!sidebarCollapsed && item.name}
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer - Now at bottom */}
                <div className="border-t border-gray-200 p-4 flex-shrink-0">
                    {!sidebarCollapsed ? (
                        <>
                            <Link
                                href={route("settings.index")}
                                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Settings className="w-5 h-5 mr-3 text-gray-400" />
                                Settings
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href={route("settings.index")}
                                className="flex justify-center items-center px-2 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Settings"
                            >
                                <Settings className="w-5 h-5 text-gray-400" />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex justify-center items-center px-2 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Desktop Toggle Button */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="hidden lg:flex absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors"
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    ) : (
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    )}
                </button>
            </div>

            {/* Main Content */}
            <div
                className={`transition-all duration-300 ${
                    sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
                }`}
            >
                {/* Top Navigation Bar */}
                <div className="sticky top-0 z-10 flex h-16 bg-white shadow-sm">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSidebarOpen(true);
                        }}
                        className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-1 items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Sanitary Permit Certification System
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setNotificationDropdownOpen(
                                            !notificationDropdownOpen
                                        );
                                        setProfileDropdownOpen(false);
                                    }}
                                    className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <Bell className="w-6 h-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {unreadCount > 9
                                                ? "9+"
                                                : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {notificationDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                Notifications
                                            </h3>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(
                                                    (notification) => (
                                                        <div
                                                            key={
                                                                notification.id
                                                            }
                                                            className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors"
                                                            onClick={() => {
                                                                // Close dropdown
                                                                setNotificationDropdownOpen(
                                                                    false
                                                                );

                                                                // Mark as read if unread
                                                                if (
                                                                    !notification.read_at
                                                                ) {
                                                                    markAsRead(
                                                                        notification.id
                                                                    );
                                                                }

                                                                // Navigate based on notification type
                                                                if (
                                                                    notification.data
                                                                ) {
                                                                    // Handle lab report submitted - check for inspection_id first
                                                                    if (
                                                                        notification.type ===
                                                                        "lab_report_submitted"
                                                                    ) {
                                                                        if (
                                                                            notification
                                                                                .data
                                                                                .inspection_id
                                                                        ) {
                                                                            // Redirect to inspection page (for inspectors)
                                                                            router.visit(
                                                                                route(
                                                                                    "inspections.show",
                                                                                    notification
                                                                                        .data
                                                                                        .inspection_id
                                                                                )
                                                                            );
                                                                        } else if (
                                                                            notification
                                                                                .data
                                                                                .lab_report_id
                                                                        ) {
                                                                            // Redirect to lab report page (for lab staff)
                                                                            router.visit(
                                                                                route(
                                                                                    "lab-reports.show",
                                                                                    notification
                                                                                        .data
                                                                                        .lab_report_id
                                                                                )
                                                                            );
                                                                        }
                                                                    }
                                                                    // Handle inspection progress saved
                                                                    else if (
                                                                        notification.type ===
                                                                            "inspection_progress_saved" &&
                                                                        notification
                                                                            .data
                                                                            .inspection_id
                                                                    ) {
                                                                        router.visit(
                                                                            route(
                                                                                "inspections.show",
                                                                                notification
                                                                                    .data
                                                                                    .inspection_id
                                                                            )
                                                                        );
                                                                    }
                                                                    // Handle inspection approved
                                                                    else if (
                                                                        notification.type ===
                                                                            "inspection_approved" &&
                                                                        notification
                                                                            .data
                                                                            .inspection_id
                                                                    ) {
                                                                        router.visit(
                                                                            route(
                                                                                "inspections.show",
                                                                                notification
                                                                                    .data
                                                                                    .inspection_id
                                                                            )
                                                                        );
                                                                    }
                                                                    // Handle inspection denied
                                                                    else if (
                                                                        notification.type ===
                                                                            "inspection_denied" &&
                                                                        notification
                                                                            .data
                                                                            .inspection_id
                                                                    ) {
                                                                        router.visit(
                                                                            route(
                                                                                "inspections.show",
                                                                                notification
                                                                                    .data
                                                                                    .inspection_id
                                                                            )
                                                                        );
                                                                    }
                                                                    // Handle lab report reviewed
                                                                    else if (
                                                                        notification.type ===
                                                                            "lab_report_reviewed" &&
                                                                        notification
                                                                            .data
                                                                            .lab_report_id
                                                                    ) {
                                                                        router.visit(
                                                                            route(
                                                                                "lab-reports.show",
                                                                                notification
                                                                                    .data
                                                                                    .lab_report_id
                                                                            )
                                                                        );
                                                                    }
                                                                    // Handle business registered
                                                                    else if (
                                                                        notification
                                                                            .data
                                                                            .business_id &&
                                                                        notification.type ===
                                                                            "business_registered"
                                                                    ) {
                                                                        router.visit(
                                                                            route(
                                                                                "businesses.show",
                                                                                notification
                                                                                    .data
                                                                                    .business_id
                                                                            )
                                                                        );
                                                                    }
                                                                    // Handle inspection due
                                                                    else if (
                                                                        notification
                                                                            .data
                                                                            .inspection_id &&
                                                                        notification.type ===
                                                                            "inspection_due"
                                                                    ) {
                                                                        router.visit(
                                                                            route(
                                                                                "inspections.show",
                                                                                notification
                                                                                    .data
                                                                                    .inspection_id
                                                                            )
                                                                        );
                                                                    }
                                                                    // Handle permit expiring
                                                                    else if (
                                                                        notification
                                                                            .data
                                                                            .permit_id &&
                                                                        notification.type ===
                                                                            "permit_expiring"
                                                                    ) {
                                                                        router.visit(
                                                                            route(
                                                                                "permits.show",
                                                                                notification
                                                                                    .data
                                                                                    .permit_id
                                                                            )
                                                                        );
                                                                    }
                                                                    // Fallback to business page if no specific route
                                                                    else if (
                                                                        notification
                                                                            .data
                                                                            .business_id
                                                                    ) {
                                                                        router.visit(
                                                                            route(
                                                                                "businesses.show",
                                                                                notification
                                                                                    .data
                                                                                    .business_id
                                                                            )
                                                                        );
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex gap-3">
                                                                <div className="flex-shrink-0 mt-1">
                                                                    {getNotificationIcon(
                                                                        notification.type
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {
                                                                            notification.title
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-600 mt-1">
                                                                        {
                                                                            notification.message
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 mt-1">
                                                                        {getNotificationTime(
                                                                            notification.created_at
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                {!notification.read_at && (
                                                                    <div className="flex-shrink-0">
                                                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <div className="px-4 py-8 text-center">
                                                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-600">
                                                        No notifications
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                                            <Link
                                                href={route(
                                                    "notifications.index"
                                                )}
                                                className="text-xs text-blue-600 hover:text-blue-700 font-medium text-center block"
                                                onClick={() =>
                                                    setNotificationDropdownOpen(
                                                        false
                                                    )
                                                }
                                            >
                                                View all notifications
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setProfileDropdownOpen(
                                            !profileDropdownOpen
                                        );
                                        setNotificationDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                                        {user.name}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>

                                {/* Dropdown Menu */}
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link
                                            href={route("profile.edit")}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Profile Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main
                    onClick={() => {
                        setSidebarOpen(false);
                        setNotificationDropdownOpen(false);
                        setProfileDropdownOpen(false);
                    }}
                >
                    {children}
                </main>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <LogOut className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold text-gray-900">
                                Confirm Logout
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to logout? You will need to
                            login again to access your account.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
