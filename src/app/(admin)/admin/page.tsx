"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/dashboardApi";
import { Package, Users, FileText, AlertTriangle, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: getDashboardStats,
    });

    const stats = [
        {
            name: "Total Products",
            value: data?.stats?.totalProducts || 0,
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            name: "Total Users",
            value: data?.stats?.totalUsers || 0,
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            name: "Recent Posts",
            value: data?.stats?.totalPosts || 0,
            icon: FileText,
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900 ">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2">Real-time performance and inventory insights.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                <p className="text-3xl font-semibold text-gray-900 mt-1">{stat.value.toLocaleString()}</p>
                            </div>
                            <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Latest Products */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="text-blue-500" size={20} />
                            <h2 className="text-xl font-semibold text-gray-900">Latest Products</h2>
                        </div>
                        <Link href="/admin/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                            View All <ArrowUpRight size={14} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500  ">Product</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500  ">Category</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500  ">Added</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data?.latestProducts?.map((product: any) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0].url || '/logo.png'} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package size={20} className="text-gray-400" />
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-900 line-clamp-1">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {product.categoryId?.name || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(product.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {(!data?.latestProducts || data.latestProducts.length === 0) && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500 italic">No products added yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Products */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="text-orange-500" size={20} />
                            <h2 className="text-xl font-semibold text-gray-900">Low Stock Alert</h2>
                        </div>
                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md  ">
                            Top 5 Critical
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500  ">Product Variant</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500  ">Stock</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500  ">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data?.lowStockVariants?.map((variant: any) => (
                                    <tr key={variant._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 line-clamp-1">{variant.productId?.name}</span>
                                                <span className="text-xs text-gray-500">SKU: {variant.sku}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-semibold ${variant.stock <= 5 ? 'text-red-600' : 'text-orange-600'}`}>
                                                {variant.stock} units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variant.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                                                }`}>
                                                {variant.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!data?.lowStockVariants || data.lowStockVariants.length === 0) && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500 italic">Inventory is healthy!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Quick Actions & System */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 font-primary">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/products/new" className="flex flex-col items-center justify-center p-6 rounded-2xl border border-orange-100 bg-orange-50/50 text-primary hover:bg-primary hover:text-white transition-all duration-300 group shadow-sm">
                            <Package className="mb-3 group-hover:scale-110 transition-transform" />
                            <span className="font-semibold">Add Product</span>
                        </Link>
                        <Link href="/admin/posts/new" className="flex flex-col items-center justify-center p-6 rounded-2xl border border-blue-100 bg-blue-50/50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 group shadow-sm">
                            <FileText className="mb-3 group-hover:scale-110 transition-transform" />
                            <span className="font-semibold">New Post</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">System Health</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium text-gray-700">Database Core</span>
                            </div>
                            <span className="text-xs font-semibold text-green-700  ">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium text-gray-700">Digital Assets</span>
                            </div>
                            <span className="text-xs font-semibold text-green-700  ">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
