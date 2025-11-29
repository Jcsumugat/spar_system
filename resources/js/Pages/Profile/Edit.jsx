import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    User,
    Mail,
    Lock,
    Save,
    AlertCircle,
    CheckCircle,
    Briefcase,
    Shield,
    Eye,
    EyeOff,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Edit({ auth, mustVerifyEmail, status }) {
    const [showVerificationModal, setShowVerificationModal] = useState(true);
    const [verificationPassword, setVerificationPassword] = useState("");
    const [verificationError, setVerificationError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [showVerificationPassword, setShowVerificationPassword] =
        useState(false);

    // Session Management
    const [sessions] = useState([
        {
            device: "Current Session",
            location: "Cebu City, Central Visayas, PH",
            ip: "Your IP",
            last_active: new Date().toISOString(),
            is_current: true,
        },
    ]);

    // Check if user is already verified
    useEffect(() => {
        checkVerification();
    }, []);

    const checkVerification = async () => {
        try {
            const response = await axios.get(
                route("profile.check-verification")
            );
            console.log("Verification check:", response.data);
            if (response.data.verified) {
                setShowVerificationModal(false);
            } else {
                setShowVerificationModal(true);
            }
        } catch (error) {
            console.error("Error checking verification:", error);
            setShowVerificationModal(true);
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault();
        setIsVerifying(true);
        setVerificationError("");

        try {
            await axios.post(route("profile.verify"), {
                password: verificationPassword,
            });

            setShowVerificationModal(false);
            setVerificationPassword("");
        } catch (error) {
            if (error.response?.data?.errors?.password) {
                setVerificationError(error.response.data.errors.password[0]);
            } else {
                setVerificationError("An error occurred. Please try again.");
            }
        } finally {
            setIsVerifying(false);
        }
    };

    const handleCancelVerification = () => {
        router.visit(route("dashboard"));
    };

    // Profile Information Form
    const profileForm = useForm({
        name: auth.user.name,
        email: auth.user.email,
        position: auth.user.position || "",
    });

    // Password Update Form
    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.patch(route("profile.update"), {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.patch(route("profile.update"), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Profile Settings" />

            {/* Password Verification Modal */}
            {showVerificationModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <Lock className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Verify Your Identity
                                </h3>
                                <p className="text-sm text-gray-600">
                                    For security, please confirm your password
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleVerification}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showVerificationPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={verificationPassword}
                                        onChange={(e) => {
                                            setVerificationPassword(
                                                e.target.value
                                            );
                                            setVerificationError("");
                                        }}
                                        className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            verificationError
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Enter your password"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowVerificationPassword(
                                                !showVerificationPassword
                                            )
                                        }
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showVerificationPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {verificationError && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {verificationError}
                                    </p>
                                )}
                                <p className="mt-2 text-xs text-gray-500">
                                    Access will expire after 15 minutes of
                                    inactivity
                                </p>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={handleCancelVerification}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        isVerifying ||
                                        !verificationPassword.trim()
                                    }
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isVerifying ? "Verifying..." : "Verify"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Main Content - Only show when verified */}
            {!showVerificationModal && (
                <div className="py-6">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Profile Settings
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Manage your account information and
                                        security
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Verified Session</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Profile Information */}
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <User className="w-5 h-5 mr-2" />
                                        Profile Information
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Update your account's profile
                                        information and email address.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleProfileSubmit}
                                    className="p-6"
                                >
                                    <div className="space-y-4">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={
                                                        profileForm.data.name
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        profileForm.errors.name
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                    placeholder="Enter your full name"
                                                />
                                                <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                            </div>
                                            {profileForm.errors.name && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {profileForm.errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    value={
                                                        profileForm.data.email
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        profileForm.errors.email
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                    placeholder="Enter your email"
                                                />
                                                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                            </div>
                                            {profileForm.errors.email && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {profileForm.errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Position */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Position
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={
                                                        profileForm.data
                                                            .position
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "position",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        profileForm.errors
                                                            .position
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                    placeholder="Enter your position"
                                                />
                                                <Briefcase className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                            </div>
                                            {profileForm.errors.position && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {
                                                        profileForm.errors
                                                            .position
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Role (Read-only) */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Role
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={auth.user.role}
                                                    disabled
                                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                                />
                                                <Shield className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Your role is managed by
                                                administrators
                                            </p>
                                        </div>
                                    </div>

                                    {/* Success Message */}
                                    {profileForm.recentlySuccessful && (
                                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-800">
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            <span className="text-sm font-medium">
                                                Profile updated successfully!
                                            </span>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="mt-6 flex items-center justify-end gap-3">
                                        <button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {profileForm.processing
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Update Password */}
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <Lock className="w-5 h-5 mr-2" />
                                        Update Password
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Ensure your account is using a strong
                                        password.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handlePasswordSubmit}
                                    className="p-6"
                                >
                                    <div className="space-y-4">
                                        {/* Current Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                value={
                                                    passwordForm.data
                                                        .current_password
                                                }
                                                onChange={(e) =>
                                                    passwordForm.setData(
                                                        "current_password",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    passwordForm.errors
                                                        .current_password
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="Enter current password"
                                            />
                                            {passwordForm.errors
                                                .current_password && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {
                                                        passwordForm.errors
                                                            .current_password
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* New Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={
                                                    passwordForm.data.password
                                                }
                                                onChange={(e) =>
                                                    passwordForm.setData(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    passwordForm.errors.password
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="Enter new password (min. 8 characters)"
                                            />
                                            {passwordForm.errors.password && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {
                                                        passwordForm.errors
                                                            .password
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                value={
                                                    passwordForm.data
                                                        .password_confirmation
                                                }
                                                onChange={(e) =>
                                                    passwordForm.setData(
                                                        "password_confirmation",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>

                                    {/* Success Message */}
                                    {passwordForm.recentlySuccessful && (
                                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-800">
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            <span className="text-sm font-medium">
                                                Password updated successfully!
                                            </span>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="mt-6 flex items-center justify-end gap-3">
                                        <button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {passwordForm.processing
                                                ? "Updating..."
                                                : "Update Password"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Security & Activity */}
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <Shield className="w-5 h-5 mr-2" />
                                        Security & Activity
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Monitor your account activity and
                                        security settings.
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Account Status */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                                            Account Status
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-green-900">
                                                        Account Active
                                                    </p>
                                                    <p className="text-xs text-green-700 mt-1">
                                                        Your account is in good
                                                        standing
                                                    </p>
                                                </div>
                                                <CheckCircle className="w-8 h-8 text-green-600" />
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-blue-900">
                                                        Role: {auth.user.role}
                                                    </p>
                                                    <p className="text-xs text-blue-700 mt-1">
                                                        {auth.user.position ||
                                                            "Staff Member"}
                                                    </p>
                                                </div>
                                                <Shield className="w-8 h-8 text-blue-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                                            Recent Activity
                                        </h3>
                                        <div className="space-y-3">
                                            {sessions.map((session, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {session.device}
                                                            </p>
                                                            {session.is_current && (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    Active Now
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {session.location} •{" "}
                                                            {session.ip}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Last active:{" "}
                                                            {new Date(
                                                                session.last_active
                                                            ).toLocaleString(
                                                                "en-US",
                                                                {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Security Tips */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className="text-sm font-medium text-blue-900 mb-2">
                                                    Security Tips
                                                </h3>
                                                <ul className="space-y-1 text-xs text-blue-800">
                                                    <li>
                                                        • Use a strong, unique
                                                        password for your
                                                        account
                                                    </li>
                                                    <li>
                                                        • Change your password
                                                        regularly (every 90
                                                        days)
                                                    </li>
                                                    <li>
                                                        • Never share your login
                                                        credentials with anyone
                                                    </li>
                                                    <li>
                                                        • Log out when using
                                                        shared computers
                                                    </li>
                                                    <li>
                                                        • Report any suspicious
                                                        activity to
                                                        administrators
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Administrator */}
                                    <div className="border-t pt-4">
                                        <p className="text-sm text-gray-600 mb-3">
                                            Need help with your account or have
                                            security concerns?
                                        </p>
                                        <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Contact Administrator
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
