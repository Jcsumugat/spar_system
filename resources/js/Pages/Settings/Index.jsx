import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Settings as SettingsIcon,
    Building2,
    Bell,
    Shield,
    Database,
    Save,
    AlertCircle,
    Lock,
} from "lucide-react";

export default function Index({ auth, settings }) {
    const [activeTab, setActiveTab] = useState("general");

    const { data, setData, put, processing, errors } = useForm({
        app_name: settings?.app_name || "",
        timezone: settings?.timezone || "Asia/Manila",
        locale: settings?.locale || "en",
        notifications_enabled: settings?.notifications_enabled ?? true,
        email_notifications: settings?.email_notifications ?? true,
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("settings.update"), {
            preserveScroll: true,
            onSuccess: () => {
                // Reset password fields after success
                setData({
                    ...data,
                    current_password: "",
                    new_password: "",
                    new_password_confirmation: "",
                });
            },
        });
    };

    const tabs = [
        { id: "general", label: "General", icon: Building2 },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
        { id: "system", label: "System Info", icon: Database },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Settings" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <SettingsIcon className="w-8 h-8 text-blue-600" />
                            <h1 className="text-3xl font-bold text-gray-900">
                                Settings
                            </h1>
                        </div>
                        <p className="text-gray-600">
                            Manage your application settings and preferences
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <nav className="space-y-1">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() =>
                                                    setActiveTab(tab.id)
                                                }
                                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                    activeTab === tab.id
                                                        ? "text-blue-600 bg-blue-50"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* General Settings */}
                                {activeTab === "general" && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Building2 className="w-5 h-5 text-gray-600" />
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                General Settings
                                            </h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Application Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.app_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "app_name",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Sanitary Permit System"
                                                />
                                                {errors.app_name && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.app_name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Timezone
                                                </label>
                                                <select
                                                    value={data.timezone}
                                                    onChange={(e) =>
                                                        setData(
                                                            "timezone",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="Asia/Manila">
                                                        Asia/Manila (PHT)
                                                    </option>
                                                    <option value="UTC">
                                                        UTC
                                                    </option>
                                                    <option value="America/New_York">
                                                        America/New York (EST)
                                                    </option>
                                                    <option value="Europe/London">
                                                        Europe/London (GMT)
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Language
                                                </label>
                                                <select
                                                    value={data.locale}
                                                    onChange={(e) =>
                                                        setData(
                                                            "locale",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="en">
                                                        English
                                                    </option>
                                                    <option value="fil">
                                                        Filipino
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Notification Settings */}
                                {activeTab === "notifications" && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Bell className="w-5 h-5 text-gray-600" />
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                Notification Preferences
                                            </h2>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        Push Notifications
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Receive notifications
                                                        about important updates
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            data.notifications_enabled
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "notifications_enabled",
                                                                e.target.checked
                                                            )
                                                        }
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        Email Notifications
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Get notified via email
                                                        for permit expirations
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            data.email_notifications
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "email_notifications",
                                                                e.target.checked
                                                            )
                                                        }
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>

                                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <div className="flex gap-3">
                                                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                    <div className="text-sm text-blue-800">
                                                        <p className="font-medium mb-1">
                                                            Notification Types
                                                        </p>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            <li>
                                                                Permit
                                                                expiration
                                                                alerts
                                                            </li>
                                                            <li>
                                                                Inspection
                                                                schedule
                                                                reminders
                                                            </li>
                                                            <li>
                                                                Lab report
                                                                submissions
                                                            </li>
                                                            <li>
                                                                Renewal pending
                                                                notices
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Security Settings */}
                                {activeTab === "security" && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Shield className="w-5 h-5 text-gray-600" />
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                Security Settings
                                            </h2>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Account Information */}
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">
                                                    Current User
                                                </p>
                                                <p className="font-semibold text-gray-900">
                                                    {auth.user.name}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {auth.user.email}
                                                </p>
                                            </div>

                                            {/* Change Password Section */}
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900 mb-4">
                                                    Change Password
                                                </h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Current Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            value={
                                                                data.current_password
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "current_password",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Enter current password"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            New Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            value={
                                                                data.new_password
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "new_password",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Enter new password"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Confirm New Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            value={
                                                                data.new_password_confirmation
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "new_password_confirmation",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Confirm new password"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Security Tips */}
                                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                                <div className="flex gap-3">
                                                    <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                    <div className="text-sm text-amber-800">
                                                        <p className="font-medium mb-1">
                                                            Password
                                                            Requirements
                                                        </p>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            <li>
                                                                At least 8
                                                                characters long
                                                            </li>
                                                            <li>
                                                                Include
                                                                uppercase and
                                                                lowercase
                                                                letters
                                                            </li>
                                                            <li>
                                                                Include at least
                                                                one number
                                                            </li>
                                                            <li>
                                                                Use a unique
                                                                password
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* System Information */}
                                {activeTab === "system" && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Database className="w-5 h-5 text-gray-600" />
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                System Information
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="text-sm text-gray-600">
                                                    Version
                                                </p>
                                                <p className="font-semibold text-gray-900 mt-1">
                                                    1.0.0
                                                </p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="text-sm text-gray-600">
                                                    Last Updated
                                                </p>
                                                <p className="font-semibold text-gray-900 mt-1">
                                                    {new Date().toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="text-sm text-gray-600">
                                                    Database Status
                                                </p>
                                                <p className="font-semibold text-green-600 mt-1 flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                                    Connected
                                                </p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="text-sm text-gray-600">
                                                    Server Status
                                                </p>
                                                <p className="font-semibold text-green-600 mt-1 flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                                    Online
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <h3 className="text-sm font-medium text-blue-900 mb-2">
                                                Application Details
                                            </h3>
                                            <dl className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <dt className="text-blue-700">
                                                        Framework:
                                                    </dt>
                                                    <dd className="text-blue-900 font-medium">
                                                        Laravel 12 + React
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-blue-700">
                                                        Environment:
                                                    </dt>
                                                    <dd className="text-blue-900 font-medium">
                                                        Production
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-blue-700">
                                                        Timezone:
                                                    </dt>
                                                    <dd className="text-blue-900 font-medium">
                                                        {data.timezone}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                )}

                                {/* Save Button - Only show for editable sections */}
                                {activeTab !== "system" && (
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                window.location.reload()
                                            }
                                            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4" />
                                            {processing
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
