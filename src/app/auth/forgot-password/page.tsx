"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const { forgotPassword, loading } = useAuth();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            setIsSubmitted(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold text-gray-900">Forgot Password?</h1>
                    <p className="text-gray-700 mt-2">
                        {isSubmitted
                            ? "Check your email for the reset link."
                            : "Enter your email to receive a password reset link."}
                    </p>
                </div>

                {!isSubmitted ? (
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-white font-semibold rounded-xl shadow-lg hover:bg-orange-600 hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-gray-600 mb-8">
                            We've sent a password reset link to <span className="font-semibold">{email}</span>. Please check your inbox and follow the instructions.
                        </p>
                        <Link
                            href="/auth/login"
                            className="text-primary font-semibold hover:underline"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                )}

                {!isSubmitted && (
                    <p className="text-center mt-8 text-gray-600">
                        Remember your password?{" "}
                        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                            Sign In
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}
