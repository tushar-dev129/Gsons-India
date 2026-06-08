"use client";

import { useState } from "react";
import { UploadCloud, FileJson, Archive, CheckCircle2, AlertCircle, X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import API from "@/services/api";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import Button from "@/components/Button";

export default function BulkImportPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const [files, setFiles] = useState({
        images_zip: null as File | null,
        products_data: null as File | null,
        variants_data: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
        if (e.target.files) {
            setFiles(prev => ({ ...prev, [field]: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files.products_data) {
            return toast.error("Please upload products data file.");
        }

        setLoading(true);
        setResult(null);

        try {
            const formData = new FormData();
            if (files.images_zip) {
                formData.append("images_zip", files.images_zip);
            }
            formData.append("products_data", files.products_data);
            if (files.variants_data) {
                formData.append("variants_data", files.variants_data);
            }

            const { data } = await API.post("/admin/bulk-import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (data.success) {
                setResult(data.summary);
                toast.success("Bulk import completed!");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Bulk import failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900">Bulk Product Import</h1>
                <p className="text-gray-500 mt-2">Upload product/variant data (and optional ZIP images) to import in bulk.</p>
            </div>

            {!result ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        {/* Images ZIP */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Archive className="w-4 h-4 text-primary" />
                                Images ZIP File (Optional)
                            </label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept=".zip"
                                    onChange={(e) => handleFileChange(e, "images_zip")}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="border-2 border-dashed border-gray-200 group-hover:border-primary rounded-2xl p-6 text-center transition-all bg-gray-50/50">
                                    {files.images_zip ? (
                                        <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                                            <CheckCircle2 className="w-5 h-5" />
                                            {files.images_zip.name}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">
                                            <UploadCloud className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Click or drag to upload <span className="font-semibold text-gray-900">images.zip</span> (optional)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Products Data */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <FileJson className="w-4 h-4 text-primary" />
                                Products Data (JSON or CSV)
                            </label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept=".json,.csv"
                                    onChange={(e) => handleFileChange(e, "products_data")}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    required
                                />
                                <div className="border-2 border-dashed border-gray-200 group-hover:border-primary rounded-2xl p-6 text-center transition-all bg-gray-50/50">
                                    {files.products_data ? (
                                        <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                                            <CheckCircle2 className="w-5 h-5" />
                                            {files.products_data.name}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">
                                            <Archive className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Upload <span className="font-semibold text-gray-900">products.json</span> or <span className="font-semibold text-gray-900">products.csv</span></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Variants Data */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Archive className="w-4 h-4 text-primary" />
                                Variants Data (Optional JSON/CSV)
                            </label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept=".json,.csv"
                                    onChange={(e) => handleFileChange(e, "variants_data")}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="border-2 border-dashed border-gray-200 group-hover:border-primary rounded-2xl p-6 text-center transition-all bg-gray-50/50">
                                    {files.variants_data ? (
                                        <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                                            <CheckCircle2 className="w-5 h-5" />
                                            {files.variants_data.name}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">
                                            <Archive className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Upload <span className="font-semibold text-gray-900">variants.json</span> or <span className="font-semibold text-gray-900">variants.csv</span> (optional)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={loading}
                            className="px-12"
                        >
                            Start Import
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Import Summary</h3>
                            <Button variant="ghost" size="sm" onClick={() => setResult(null)} className="text-primary">Upload More</Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                                <p className="text-sm text-green-600 font-semibold  ">Products Created</p>
                                <p className="text-4xl  text-green-700">{result.productsCreated}</p>
                            </div>
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-sm text-blue-600 font-semibold  ">Variants Created</p>
                                <p className="text-4xl  text-blue-700">{result.variantsCreated}</p>
                            </div>
                        </div>

                        {result.errors.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-sm font-semibold text-red-600 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Errors Encountered ({result.errors.length})
                                </p>
                                <div className="max-h-60 overflow-y-auto space-y-2 border border-red-50 rounded-xl p-4 bg-red-50/30">
                                    {result.errors.map((err: string, i: number) => (
                                        <p key={i} className="text-xs text-red-700 font-medium flex gap-2">
                                            <span className="shrink-0 text-red-400">•</span>
                                            {err}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button
                            variant="secondary"
                            onClick={() => router.push("/admin/products")}
                            rightIcon={<ChevronRight className="w-4 h-4" />}
                            className="px-10"
                        >
                            Go to Products
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
