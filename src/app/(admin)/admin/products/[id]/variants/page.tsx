"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit2, ArrowLeft, Layers, MoreHorizontal } from "lucide-react";
import Loader from "@/components/Loader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { deleteVariant } from "@/services/variantApi";
import { getProductById } from "@/services/productApi";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import { cn } from "@/utils/cn";

export default function ProductVariantsPage() {
    const { id: productId } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Product & its Variants
    const { data: productData, isLoading } = useQuery({
        queryKey: ["product-variants", productId],
        queryFn: () => getProductById(productId as string),
        enabled: !!productId
    });

    // Delete Variant Mutation
    const deleteMutation = useMutation({
        mutationFn: deleteVariant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product-variants"] });
            toast.success("Variant deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete variant");
        },
    });

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this variant?")) {
            deleteMutation.mutate(id);
        }
    };

    const variants = productData?.variants || [];
    const product = productData;

    const filteredVariants = variants.filter((v: any) =>
        v.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <Loader fullPage text="Loading product variants..." />;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex  flex-1 items-center gap-4">
                    
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">Manage Variants</h1>
                        <p className="text-gray-500 mt-1">Product: <span className="text-primary font-semibold">{product?.name}</span></p>
                    </div>
                </div>
                <Button
                        variant="outline"
                        onClick={() => router.push(`/admin/products`)}
                        leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                        Back to Products
                    </Button>
                <Button
                    variant="primary"
                    onClick={() => router.push(`/admin/products/${productId}/variants/new`)}
                    leftIcon={<Plus className="w-5 h-5" />}
                >
                    Add Variant
                </Button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search variants by SKU..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredVariants.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-gray-50/80 backdrop-blur-md text-gray-900 text-xs    border-b border-gray-100">
                                    <th className="px-6 py-5">Image</th>
                                    <th className="px-6 py-5">SKU</th>
                                    <th className="px-6 py-5">Price</th>
                                    <th className="px-6 py-5">Inventory</th>
                                    <th className="px-6 py-5">Attributes</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredVariants.map((variant: any) => (
                                    <tr key={variant._id} className="hover:bg-orange-50/40 transition-all duration-300 group">
                                        <td className="px-6 py-5">
                                            <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 group-hover:border-primary/20 transition-all shadow-sm">
                                                {variant.images?.[0]?.url ? (
                                                    <img
                                                        src={variant.images[0].url}
                                                        alt={variant.sku}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px]   text-gray-400">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <code className="text-[11px] bg-gray-50 text-gray-900 px-2 py-1 rounded-md border border-gray-100 font-mono font-semibold">
                                                {variant.sku}
                                            </code>
                                        </td>
                                        <td className="px-6 py-5  text-gray-900">
                                            ₹{variant.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className={cn(
                                                    "text-xs   ",
                                                    variant.stock < 10 ? 'text-red-600' : 'text-green-600'
                                                )}>
                                                    {variant.stock} units
                                                </span>
                                                {variant.stock < 10 && (
                                                    <span className="text-[9px]   text-red-400 animate-pulse">
                                                        Low Stock
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-wrap gap-1.5">
                                                {variant.attributes && Object.entries(variant.attributes).map(([key, val]: [string, any]) => (
                                                    <div key={key} className="flex items-center bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                                        <span className="text-[9px]  text-gray-400  mr-1">{key}:</span>
                                                        <span className="text-[10px] font-semibold text-gray-700">{val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={cn(
                                                "inline-flex items-center px-3 py-1 text-[10px]  rounded-full   border shadow-sm",
                                                variant.isActive
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : 'bg-red-50 text-red-700 border-red-100'
                                            )}>
                                                <span className={cn(
                                                    "w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse",
                                                    variant.isActive ? "bg-green-500" : "bg-red-500"
                                                )} />
                                                {variant.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.push(`/admin/products/${productId}/variants/${variant._id}/edit`)}
                                                    className="w-8 h-8 p-0 rounded-lg hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-orange-500"
                                                    title="Edit Variant"
                                                    leftIcon={<Edit2 className="w-4 h-4" />}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(variant._id)}
                                                    className="w-8 h-8 p-0 rounded-lg hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-red-500"
                                                    title="Delete Variant"
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
                            No variants found for this product.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
