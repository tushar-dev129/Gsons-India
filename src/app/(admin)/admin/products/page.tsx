"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, Edit2, Layers, UploadCloud } from "lucide-react";
import Loader from "@/components/Loader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, deleteProduct } from "@/services/productApi";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sort, setSort] = useState("-createdAt");
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();
    const router = useRouter();

    // Fetch Products
    const { data: productData, isLoading } = useQuery({
        queryKey: ["products", searchTerm, sort, page],
        queryFn: () => getAllProducts(`keyword=${searchTerm}&sort=${sort}&page=${page}`),
    });

    // Delete Product Mutation
    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete product");
        },
    });

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this product? All variants must be deleted first.")) {
            deleteMutation.mutate(id);
        }
    };

    const products = productData?.data || [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Products</h1>
                    <p className="text-gray-500 mt-2">Manage your base lighting collection.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/admin/products/bulk")}
                        leftIcon={<UploadCloud className="w-5 h-5" />}
                        className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                        Bulk Import
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => router.push("/admin/products/new")}
                        leftIcon={<Plus className="w-5 h-5" />}
                    >
                        Add Product
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search products by name..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-500"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-semibold text-gray-400   ">Sort:</span>
                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                                setPage(1);
                            }}
                            className="bg-gray-50 border border-gray-100 text-gray-700 text-xs font-semibold rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block px-4 py-2 transition-all outline-none cursor-pointer hover:bg-white hover:shadow-sm"
                        >
                            <option value="-createdAt">Newest First</option>
                            <option value="createdAt">Oldest First</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="-name">Name (Z-A)</option>
                            <option value="-updatedAt">Recently Updated</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500">
                            <Loader text="Loading products..." />
                        </div>
                    ) : products.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-gray-50/80 backdrop-blur-md text-gray-900 text-xs    border-b border-gray-100">
                                    <th className="px-6 py-5">Product</th>
                                    <th className="px-6 py-5">Category</th>
                                    <th className="px-6 py-5">Slug</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product: any) => (
                                    <tr key={product._id} className="hover:bg-orange-50/40 transition-all duration-300 group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 group-hover:border-primary/20 transition-all shadow-sm">
                                                    {product.images?.[0]?.url ? (
                                                        <img
                                                            src={product.images[0].url}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-orange-50 text-primary  text-xl">
                                                            {product.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 mb-0.5">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-[10px]    text-gray-400">
                                                        ID: {product._id.slice(-8)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-100 text-[11px]  text-gray-600   rounded-lg">
                                                {product.categoryId?.name || 'Uncategorized'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <code className="text-[11px] bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100 font-mono">
                                                {product.slug}
                                            </code>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={cn(
                                                "inline-flex items-center px-3 py-1 text-[10px]  rounded-full   border shadow-sm",
                                                product.isActive
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : 'bg-red-50 text-red-700 border-red-100'
                                            )}>
                                                <span className={cn(
                                                    "w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse",
                                                    product.isActive ? "bg-green-500" : "bg-red-500"
                                                )} />
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.push(`/admin/products/${product._id}/variants`)}
                                                    className="w-8 h-8 p-0 rounded-lg hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-blue-600"
                                                    title="Manage Variants"
                                                    leftIcon={<Layers className="w-4 h-4" />}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.push(`/admin/products/${product._id}/edit`)}
                                                    className="w-8 h-8 p-0 rounded-lg hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-orange-500"
                                                    title="Edit Product"
                                                    leftIcon={<Edit2 className="w-4 h-4" />}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(product._id)}
                                                    className="w-8 h-8 p-0 rounded-lg hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-red-500"
                                                    title="Delete Product"
                                                    leftIcon={<Trash2 className="w-4 h-4" />}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-gray-500 italic">
                            No products found.
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <span>Showing</span>
                        <span className="font-semibold text-gray-900">{products.length}</span>
                        <span>of</span>
                        <span className="font-semibold text-gray-900">{productData?.filteredCount || 0}</span>
                        <span>products</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="bg-white"
                        >
                            Previous
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: productData?.totalPages || 0 }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                        p === page
                                            ? "bg-primary text-white font-semibold shadow-md shadow-primary/20"
                                            : "hover:bg-white hover:shadow-sm text-gray-500 border border-transparent hover:border-gray-200"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === productData?.totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="bg-white"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
