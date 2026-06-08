"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const { register, loading } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const registerData = new FormData();
            registerData.append("name", formData.name);
            registerData.append("email", formData.email);
            registerData.append("password", formData.password);

            await register(registerData);
            router.push("/admin");
        } catch (error: any) {
            console.error("Registration error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4 py-12">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Left Side: Illustration/Text */}
                <div className="md:w-1/3 bg-primary p-12 flex flex-col justify-center text-white relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <rect x="20" y="20" width="30" height="30" fill="white" />
                            <rect x="60" y="50" width="20" height="20" fill="white" />
                            <circle cx="10" cy="80" r="15" fill="white" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-semibold mb-6 relative z-10">Join GSONS</h2>
                    <p className="text-orange-100 mb-8 relative z-10">
                        Create an account to explore our premium collection and enjoy exclusive benefits.
                    </p>
                    <div className="relative z-10">
                        <Link
                            href="/auth/login"
                            className="inline-block py-2 px-6 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-primary transition-all"
                        >
                            Sign In Instead
                        </Link>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-2/3 p-12">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl font-semibold text-gray-900">Create Account</h1>
                        <p className="text-gray-500 mt-2">Please fill in the details to register</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-white font-semibold rounded-xl shadow-lg hover:bg-orange-600 hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                        >
                            {loading ? "Registering..." : "Register Now"}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-gray-600">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
