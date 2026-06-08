"use client";

import { useState, useRef } from "react";
import { Plus, X, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import Loader from "@/components/Loader";
import { useRouter, useParams } from "next/navigation";
import { addVariant } from "@/services/variantApi";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import GalleryPickerModal from "@/components/GalleryPickerModal";
import { GalleryItem } from "@/services/galleryApi";

export default function NewVariantPage() {
    const router = useRouter();
    const { id: productId } = useParams();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<File[]>([]);
    const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        sku: "",
        price: "",
        stock: "",
        isActive: true,
    });

    const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([
        { key: "", value: "" }
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleAttributeChange = (index: number, field: 'key' | 'value', value: string) => {
        const newAttributes = [...attributes];
        newAttributes[index][field] = value;
        setAttributes(newAttributes);
    };

    const addAttribute = () => setAttributes([...attributes, { key: "", value: "" }]);
    const removeAttribute = (index: number) => setAttributes(attributes.filter((_, i) => i !== index));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...selectedFiles]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeGalleryImage = (id: string) => {
        setGalleryImages(prev => prev.filter(img => img._id !== id));
    };

    const handleGallerySelect = (selected: GalleryItem[]) => {
        setGalleryImages(prev => {
            const existingIds = prev.map(img => img._id);
            const newImages = selected.filter(img => !existingIds.includes(img._id));
            return [...prev, ...newImages];
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productId) return toast.error("Product ID is missing");
        if (images.length === 0 && galleryImages.length === 0) return toast.error("Please provide at least one image");

        setLoading(true);

        try {
            const data = new FormData();
            data.append("productId", productId as string);
            data.append("sku", formData.sku);
            data.append("price", formData.price);
            data.append("stock", formData.stock);
            data.append("isActive", String(formData.isActive));

            // Convert attributes array to object for the backend
            const attrObj: Record<string, string> = {};
            attributes.forEach(attr => {
                if (attr.key.trim() && attr.value.trim()) {
                    attrObj[attr.key.trim()] = attr.value.trim();
                }
            });
            data.append("attributes", JSON.stringify(attrObj));

            images.forEach((image) => {
                data.append("files", image);
            });

            // Append gallery images
            if (galleryImages.length > 0) {
                data.append("galleryImages", JSON.stringify(galleryImages));
            }

            await addVariant(data);
            toast.success("Variant added successfully!");
            router.push(`/admin/products/${productId}/variants`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add variant");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Add New Variant</h1>
                    <p className="text-gray-500 mt-2">Add a specific version (size, color, etc.) of your product.</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-gray-500" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">SKU (Unique Code)</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-500 font-mono"
                                placeholder="GS-WAL-101-GOLD"
                                required
                            />
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

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-gray-900 placeholder:text-gray-500"
                                placeholder="2999"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">Stock Status</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-gray-900 placeholder:text-gray-500"
                                placeholder="100"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-900">Attributes (Color, Material, etc.)</label>
                            <Button
                                variant="ghost"
                                type="button"
                                size="sm"
                                onClick={addAttribute}
                                className="text-primary"
                                leftIcon={<Plus className="w-4 h-4" />}
                            >
                                Add Attribute
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {attributes.map((attr, index) => (
                                <div key={index} className="flex gap-3 items-center">
                                    <input
                                        type="text"
                                        placeholder="Key (e.g. Color)"
                                        value={attr.key}
                                        onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm text-gray-900"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value (e.g. Gold)"
                                        value={attr.value}
                                        onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm text-gray-900"
                                    />
                                    <Button
                                        variant="outline"
                                        type="button"
                                        size="sm"
                                        onClick={() => removeAttribute(index)}
                                        className="text-gray-400 hover:text-red-500"
                                        leftIcon={<Trash2 className="w-4 h-4" />}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <label className="text-sm font-semibold text-gray-900 block mb-2">Variant Images</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 min-h-[160px] border-dashed border-gray-200 rounded-3xl p-8 text-center hover:border-primary transition-colors cursor-pointer group"
                        >
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                multiple
                                accept="image/*,video/*"
                            />
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-orange-100 text-primary rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <p className="font-semibold text-gray-900 text-sm">Click to upload variant images</p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP up to 5MB</p>
                            </div>
                        </div>

                        {/* Image Previews */}
                        {(images.length > 0 || galleryImages.length > 0) && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {images.map((img, i) => {
                                    const previewUrl = URL.createObjectURL(img);
                                    const isVideo = img.type.startsWith('video/');
                                    return (
                                    <div key={`file-${i}`} className="relative aspect-square border-2 border-primary/10 rounded-2xl overflow-hidden group bg-orange-50/10">
                                        {isVideo ? (
                                            <video src={previewUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                                        ) : (
                                            <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-gray-500 text-[10px] text-white font-semibold rounded-md shadow-sm ">File</div>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                                            className="absolute top-2 right-2 p-1.5 bg-white shadow-xl rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    );
                                })}

                                {galleryImages.map((img) => {
                                    const isVideo = img.url.match(/\.(mp4|webm|ogg)$/i);
                                    return (
                                    <div key={img._id} className="relative aspect-square border-2 border-primary/20 rounded-2xl overflow-hidden group bg-orange-50">
                                        {isVideo ? (
                                            <video src={img.url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                                        ) : (
                                            <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-primary text-[10px] text-white font-semibold rounded-md shadow-sm ">Gallery</div>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeGalleryImage(img._id); }}
                                            className="absolute top-2 right-2 p-1.5 bg-white shadow-xl rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    );
                                })}

                                <button
                                    type="button"
                                    onClick={() => setIsGalleryModalOpen(true)}
                                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-primary/20 rounded-2xl hover:bg-orange-50 transition-all p-4 text-primary group"
                                >
                                    <ImageIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-semibold  ">Gallery</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4 pb-12">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        isLoading={loading}
                        leftIcon={<Plus className="w-5 h-5" />}
                        className="px-12"
                    >
                        Create Variant
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
