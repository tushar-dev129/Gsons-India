"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Plus, Trash2, Send, Image as ImageIcon } from "lucide-react";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { createProduct } from "@/services/productApi";
import { getAllCategories } from "@/services/categoryApi";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import GalleryPickerModal from "@/components/GalleryPickerModal";
import { GalleryItem } from "@/services/galleryApi";

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<{url: string, type: string}[]>([]);
    const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        categoryId: "",
        description: "",
        isActive: true,
    });

    // Fetch Categories from API
    const { data: catData, isLoading: catLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategories,
    });

    const categories = catData?.categories || [];

    const [isSlugManual, setIsSlugManual] = useState(false);

    // Auto-generate slug from name
    useEffect(() => {
        if (!isSlugManual) {
            setFormData(prev => ({
                ...prev,
                slug: formData.name.toLowerCase().trim().replace(/ /g, "-").replace(/[^\w-]+/g, "")
            }));
        }
    }, [formData.name, isSlugManual]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        
        if (name === 'slug') {
            setIsSlugManual(true);
        }
        
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    // Handle Image Selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setImages(prev => [...prev, ...files]);

        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('video/') ? 'video' : 'image'
        }));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    // Remove selected image
    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            const newPreviews = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index].url); // Clean up memory
            return newPreviews;
        });
    };

    const removeGalleryImage = (id: string) => {
        setGalleryImages(prev => prev.filter(img => img._id !== id));
    };

    const handleGallerySelect = (selected: GalleryItem[]) => {
        // Prevent duplicates
        setGalleryImages(prev => {
            const existingIds = prev.map(img => img._id);
            const newImages = selected.filter(img => !existingIds.includes(img._id));
            return [...prev, ...newImages];
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.categoryId) {
            return toast.error("Please select a category");
        }

        if (formData.name.trim().length < 3) {
            return toast.error("Name must be at least 3 characters long");
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("slug", formData.slug);
            data.append("categoryId", formData.categoryId);
            data.append("description", formData.description);
            data.append("isActive", String(formData.isActive));

            // Append images
            images.forEach((image) => {
                data.append("images", image);
            });

            // Append gallery images
            if (galleryImages.length > 0) {
                data.append("galleryImages", JSON.stringify(galleryImages));
            }

            const res = await createProduct(data);
            toast.success("Product created successfully!");
            router.push(`/admin/products/${res.product._id}/variants/new`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Add New Product</h1>
                    <p className="text-gray-500 mt-2">Create a new base product entry with images and details.</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-gray-500" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                    {/* Images Section */}
                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-gray-900 ml-1">Product Images</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative aspect-square group rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                                    {preview.type === 'video' ? (
                                        <video src={preview.url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                                    ) : (
                                        <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 p-1.5 bg-white shadow-lg rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {/* Gallery Images */}
                            {galleryImages.map((img) => {
                                const isVideo = img.url.match(/\.(mp4|webm|ogg)$/i);
                                return (
                                <div key={img._id} className="relative aspect-square group rounded-2xl overflow-hidden border border-primary/20 bg-orange-50">
                                    {isVideo ? (
                                        <video src={img.url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                                    ) : (
                                        <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-primary text-[10px] text-white font-semibold rounded-md shadow-sm">GALLERY</div>
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(img._id)}
                                        className="absolute top-2 right-2 p-1.5 bg-white shadow-xl rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                );
                            })}

                            <div className="flex flex-col gap-2">
                                <label className="flex-1 min-h-[160px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-primary hover:bg-orange-50/30 transition-all group p-4">
                                    <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*,video/*" />
                                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary mb-2" />
                                    <span className="text-[10px] font-semibold text-gray-400 group-hover:text-primary  ">Upload</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsGalleryModalOpen(true)}
                                    className="flex items-center justify-center gap-2 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-semibold text-gray-500 hover:bg-orange-50 hover:text-primary hover:border-primary/20 transition-all  "
                                >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    Gallery
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-500"
                                placeholder="Golden Wall Sconce"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">Product Slug</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-500 font-mono text-sm"
                                placeholder="golden-wall-sconce"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">Category</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-gray-900 disabled:opacity-50"
                                required
                                disabled={catLoading}
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat: any) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                            {catLoading && <div className="text-xs text-gray-400 flex items-center gap-1"><Loader size="sm" text="" /> Loading categories...</div>}
                        </div>
                        <div className="flex items-end pb-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="isActive" className="text-sm font-semibold text-gray-900 cursor-pointer">Active</label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-gray-900 placeholder:text-gray-500"
                            placeholder="Detailed product information..."
                        />
                    </div>


                </div>

                <div className="flex justify-end gap-4 pb-12">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={loading}
                        // leftIcon={<Plus className="w-5 h-5" />}
                        className="px-12"
                    >
                        Next
                    </Button>
                </div>
            </form>

            <GalleryPickerModal
                isOpen={isGalleryModalOpen}
                onClose={() => setIsGalleryModalOpen(false)}
                onSelect={handleGallerySelect}
            />
        </div>
    );
}
