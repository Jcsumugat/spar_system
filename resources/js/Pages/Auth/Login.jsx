import { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    FileText,
    Mail,
    Lock,
    User,
    Briefcase,
    Eye,
    EyeOff,
} from "lucide-react";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const loginForm = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const registerForm = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "Staff",
        position: "Lab Assistant",
    });

    // Auto-fill position based on role
    useEffect(() => {
        if (registerForm.data.role === "Staff") {
            registerForm.setData("position", "Lab Assistant");
        } else if (registerForm.data.role === "Admin") {
            registerForm.setData("position", "Lab Inspector");
        }
    }, [registerForm.data.role]);

    const handleLogin = (e) => {
        e.preventDefault();
        loginForm.post(route("login"), {
            onFinish: () => loginForm.reset("password"),
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        registerForm.post(route("register"), {
            onFinish: () =>
                registerForm.reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Head title={isLogin ? "Login" : "Register"} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
                <div className="w-full max-w-5xl">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            {/* Left Side - Branding */}
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white flex flex-col justify-center">
                                <div className="mb-8">
                                    <div className="flex items-center space-x-4 mb-6">
                                        <img
                                            src="/images/tibiao_logo.png"
                                            alt="Tibiao Logo"
                                            className="w-16 h-16 object-contain bg-white rounded-full p-2"
                                        />
                                        <div>
                                            <h1 className="text-2xl font-bold">
                                                Municipality of Tibiao
                                            </h1>
                                            <p className="text-blue-200 text-sm">
                                                Antique, Philippines
                                            </p>
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">
                                        Sanitary Permit Certification and
                                        Renewal System
                                    </h2>
                                    <p className="text-blue-100 text-lg">
                                        Streamlined permit management for a
                                        healthier community
                                    </p>
                                </div>

                                <div className="space-y-4 mt-8">
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-blue-500 rounded-full p-2 mt-1">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">
                                                Digital Permit Management
                                            </h3>
                                            <p className="text-blue-100 text-sm">
                                                Efficiently manage sanitary
                                                permits and renewals online
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-blue-500 rounded-full p-2 mt-1">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">
                                                Inspection Tracking
                                            </h3>
                                            <p className="text-blue-100 text-sm">
                                                Monitor inspections and
                                                compliance in real-time
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-blue-500 rounded-full p-2 mt-1">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">
                                                Automated Reporting
                                            </h3>
                                            <p className="text-blue-100 text-sm">
                                                Generate comprehensive reports
                                                with ease
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="p-12">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        {isLogin ? "Sign In" : "Create Account"}
                                    </h2>
                                    <p className="text-gray-600">
                                        {isLogin
                                            ? "Sign in to access your account"
                                            : "Register to get started"}
                                    </p>
                                </div>

                                {/* Tab Switcher */}
                                <div className="flex space-x-2 mb-8 bg-gray-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setIsLogin(true)}
                                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                                            isLogin
                                                ? "bg-white text-blue-600 shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => setIsLogin(false)}
                                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                                            !isLogin
                                                ? "bg-white text-blue-600 shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        Register
                                    </button>
                                </div>

                                {/* Login Form */}
                                {isLogin ? (
                                    <form
                                        onSubmit={handleLogin}
                                        className="space-y-6"
                                    >
                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={loginForm.data.email}
                                                    onChange={(e) =>
                                                        loginForm.setData(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                            </div>
                                            {loginForm.errors.email && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {loginForm.errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        loginForm.data.password
                                                    }
                                                    onChange={(e) =>
                                                        loginForm.setData(
                                                            "password",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter your password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                            {loginForm.errors.password && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {loginForm.errors.password}
                                                </p>
                                            )}
                                        </div>

                                        {/* Remember Me */}
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        loginForm.data.remember
                                                    }
                                                    onChange={(e) =>
                                                        loginForm.setData(
                                                            "remember",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">
                                                    Remember me
                                                </span>
                                            </label>
                                            <Link
                                                href="/forgot-password"
                                                className="text-sm text-blue-600 hover:text-blue-700"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={loginForm.processing}
                                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loginForm.processing
                                                ? "Signing in..."
                                                : "Sign In"}
                                        </button>
                                    </form>
                                ) : (
                                    /* Register Form */
                                    <form
                                        onSubmit={handleRegister}
                                        className="space-y-5"
                                    >
                                        {/* Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={
                                                        registerForm.data.name
                                                    }
                                                    onChange={(e) =>
                                                        registerForm.setData(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter your full name"
                                                    required
                                                />
                                            </div>
                                            {registerForm.errors.name && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {registerForm.errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={
                                                        registerForm.data.email
                                                    }
                                                    onChange={(e) =>
                                                        registerForm.setData(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                            </div>
                                            {registerForm.errors.email && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {registerForm.errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Role */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Role
                                            </label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <select
                                                    value={
                                                        registerForm.data.role
                                                    }
                                                    onChange={(e) =>
                                                        registerForm.setData(
                                                            "role",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                                    required
                                                >
                                                    <option value="Staff">
                                                        Staff
                                                    </option>
                                                    <option value="Admin">
                                                        Admin
                                                    </option>
                                                </select>
                                            </div>
                                            {registerForm.errors.role && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {registerForm.errors.role}
                                                </p>
                                            )}
                                        </div>

                                        {/* Position - Auto-filled, Read-only */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Position
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    registerForm.data.position
                                                }
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                                readOnly
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Position is automatically
                                                assigned based on role
                                            </p>
                                            {registerForm.errors.position && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {
                                                        registerForm.errors
                                                            .position
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        registerForm.data
                                                            .password
                                                    }
                                                    onChange={(e) =>
                                                        registerForm.setData(
                                                            "password",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Create a password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                            {registerForm.errors.password && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {
                                                        registerForm.errors
                                                            .password
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type={
                                                        showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        registerForm.data
                                                            .password_confirmation
                                                    }
                                                    onChange={(e) =>
                                                        registerForm.setData(
                                                            "password_confirmation",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Confirm your password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={registerForm.processing}
                                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {registerForm.processing
                                                ? "Creating Account..."
                                                : "Create Account"}
                                        </button>
                                    </form>
                                )}

                                {/* Footer Text */}
                                <div className="mt-6 text-center text-sm text-gray-600">
                                    {isLogin ? (
                                        <p>
                                            Don't have an account?{" "}
                                            <button
                                                onClick={() =>
                                                    setIsLogin(false)
                                                }
                                                className="text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Register here
                                            </button>
                                        </p>
                                    ) : (
                                        <p>
                                            Already have an account?{" "}
                                            <button
                                                onClick={() => setIsLogin(true)}
                                                className="text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Login here
                                            </button>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8 text-gray-600 text-sm">
                        <p>
                            &copy; 2024 Municipality of Tibiao. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
