"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            router.push("/admin");
        } catch (error: any) {
            console.error("Login error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Left Side: Illustration/Text */}
                <div className="md:w-1/2 bg-primary p-12 flex flex-col justify-center text-white relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <circle cx="10" cy="10" r="20" fill="white" />
                            <circle cx="90" cy="90" r="30" fill="white" />
                            <circle cx="50" cy="50" r="10" fill="white" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-semibold mb-6 relative z-10">Welcome Back!</h2>
                    <p className="text-orange-100 mb-8 relative z-10">
                        Illuminate your space with our premium lighting solutions. Login to manage your orders and preferences.
                    </p>
                    <div className="relative z-10">
                        <Link
                            href="/"
                            className="inline-block py-2 px-6 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-primary transition-all"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-1/2 p-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-semibold text-gray-900">Sign In</h1>
                        <p className="text-gray-500 mt-2">Access your GSONS account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link href="/auth/forgot-password" className="text-sm font-semibold text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-white font-semibold rounded-xl shadow-lg hover:bg-orange-600 hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/auth/register" className="font-semibold text-primary hover:underline">
                            Register Now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
