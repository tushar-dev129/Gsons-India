"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { resetPassword, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await resetPassword(token, { password, confirmPassword });
            router.push("/auth/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold text-gray-900">Reset Password</h1>
                    <p className="text-gray-700 mt-2">Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            New Password
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

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white font-semibold rounded-xl shadow-lg hover:bg-orange-600 hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>

                    <div className="text-center mt-6">
                        <Link href="/auth/login" className="text-sm font-semibold text-primary hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
