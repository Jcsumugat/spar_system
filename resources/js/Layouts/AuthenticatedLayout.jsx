import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
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
} from "lucide-react";

export default function AuthenticatedLayout({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const { url } = usePage();

    const navigation = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            icon: LayoutDashboard,
            current: url === "/dashboard",
        },
        {
            name: "Businesses",
            href: route("businesses.index"),
            icon: Building2,
            current: url.startsWith("/businesses"),
        },
        {
            name: "Lab Report",
            href: route("lab-reports.index"),
            icon: FlaskConical,
            current: url.startsWith("/lab-reports"),
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
            name: "Reports",
            href: route("reports.index"),
            icon: BarChart3,
            current: url.startsWith("/reports"),
        },
    ];

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
                className={`fixed inset-y-0 left-0 z-30 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
                    sidebarCollapsed ? "w-20" : "w-64"
                } ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-700 to-blue-900">
                    {!sidebarCollapsed ? (
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <img
                                    src="/images/tibiao-logo.png"
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
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
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
                                    {user.role}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Collapsed User Avatar */}
                {sidebarCollapsed && (
                    <div className="px-4 py-4 border-b border-gray-200 bg-gray-50 flex justify-center">
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
                                    ? "bg-blue-100 text-blue-700 border-l-4 border-gray-500"
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

                {/* Sidebar Footer */}
                <div className="border-t border-gray-200 p-4">
                    {!sidebarCollapsed ? (
                        <>
                            <Link
                                href={route("profile.edit")}
                                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Settings className="w-5 h-5 mr-3 text-gray-400" />
                                Settings
                            </Link>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                Logout
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href={route("profile.edit")}
                                className="flex justify-center items-center px-2 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Settings"
                            >
                                <Settings className="w-5 h-5 text-gray-400" />
                            </Link>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="w-full flex justify-center items-center px-2 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </Link>
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
                                Sanitary Permit Certification and Renewal System
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setProfileDropdownOpen(
                                            !profileDropdownOpen
                                        )
                                    }
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
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Logout
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main onClick={() => setSidebarOpen(false)}>{children}</main>
            </div>
        </div>
    );
}
