"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Upload, Trash2, Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Loader from "@/components/Loader";
import { useRouter, useParams } from "next/navigation";
import { updateVariant, getVariantById } from "@/services/variantApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import GalleryPickerModal from "@/components/GalleryPickerModal";
import { GalleryItem } from "@/services/galleryApi";

export default function EditVariantPage() {
    const router = useRouter();
    const { id: productId, variantId } = useParams();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
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

    // Fetch Variant Data
    const { data: variantData, isLoading: variantLoading } = useQuery({
        queryKey: ["variant", variantId],
        queryFn: () => getVariantById(variantId as string),
        enabled: !!variantId
    });

    useEffect(() => {
        if (variantData) {
            const v = variantData;
            setFormData({
                sku: v.sku || "",
                price: String(v.price || ""),
                stock: String(v.stock || ""),
                isActive: v.isActive,
            });
            setExistingImages(v.images || []);

            if (v.attributes) {
                const attrs = Object.entries(v.attributes).map(([key, value]) => ({
                    key,
                    value: String(value)
                }));
                setAttributes(attrs.length > 0 ? attrs : [{ key: "", value: "" }]);
            }
        }
    }, [variantData]);

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

    const removeNewImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (publicUrl: string) => {
        setExistingImages(prev => prev.filter(img => img.publicUrl !== publicUrl));
        setImagesToDelete(prev => [...prev, publicUrl]);
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

        setLoading(true);

        try {
            const data = new FormData();
            data.append("sku", formData.sku);
            data.append("price", formData.price);
            data.append("stock", formData.stock);
            data.append("isActive", String(formData.isActive));

            const attrObj: Record<string, string> = {};
            attributes.forEach(attr => {
                if (attr.key.trim() && attr.value.trim()) {
                    attrObj[attr.key.trim()] = attr.value.trim();
                }
            });
            data.append("attributes", JSON.stringify(attrObj));

            if (images.length > 0) {
                images.forEach((image) => {
                    data.append("files", image);
                });
            }

            if (imagesToDelete.length > 0) {
                imagesToDelete.forEach(id => data.append("imagesToDelete", id));
            }

            // Append gallery images
            if (galleryImages.length > 0) {
                data.append("galleryImages", JSON.stringify(galleryImages));
            }

            await updateVariant(variantId as string, data);
            queryClient.invalidateQueries({ queryKey: ["variant", variantId] });
            queryClient.invalidateQueries({ queryKey: ["product-variants", productId] });

            toast.success("Variant updated successfully!");
            router.push(`/admin/products/${productId}/variants`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update variant");
        } finally {
            setLoading(false);
        }
    };

    if (variantLoading) return <Loader fullPage text="Fetching variant details..." />;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-500" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">Edit Variant</h1>
                        <p className="text-gray-500 mt-1">Updating SKU: <span className="font-semibold text-primary">{formData.sku}</span></p>
                    </div>
                </div>
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
                                    <span
                                        onClick={() => removeAttribute(index)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <label className="text-sm font-semibold text-gray-900 block mb-2">Variant Images</label>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                            {/* Existing Images */}
                            {existingImages.map((img, i) => {
                                const isVideo = img.url && img.url.match(/\.(mp4|webm|ogg)$/i);
                                return (
                                <div key={`ex-${i}`} className="relative aspect-square group rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                                    {isVideo ? (
                                        <video src={img.url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                                    ) : (
                                        <img src={img.url || '/logo.png'} alt="existing" className="w-full h-full object-cover" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(img.publicUrl)}
                                        className="absolute top-2 right-2 p-1.5 bg-white shadow-lg rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                );
                            })}

                            {/* New Previews */}
                            {images.map((img, i) => {
                                const previewUrl = URL.createObjectURL(img);
                                const isVideo = img.type.startsWith('video/');
                                return (
                                <div key={`new-${i}`} className="relative aspect-square group rounded-2xl overflow-hidden border border-primary/20 bg-orange-50">
                                    {isVideo ? (
                                        <video src={previewUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                                    ) : (
                                        <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-primary text-[10px] text-white font-semibold rounded-md">NEW</div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeNewImage(i); }}
                                        className="absolute top-2 right-2 p-1.5 bg-white shadow-lg rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                );
                            })}

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
                                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-primary text-[10px] text-white font-semibold rounded-md shadow-sm ">Gallery</div>
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

                            {/* Add Buttons */}
                            <div className="flex flex-col gap-2">
                                <label className="flex-1 min-h-[160px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-primary hover:bg-orange-50/30 transition-all group p-4">
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*,video/*"
                                    />
                                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary mb-2" />
                                    <span className="text-[10px] font-semibold text-gray-400 group-hover:text-primary   text-center">Upload Files</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsGalleryModalOpen(true)}
                                    className="flex items-center justify-center gap-2 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-semibold text-gray-500 hover:bg-orange-50 hover:text-primary hover:border-primary/20 transition-all   shadow-sm"
                                >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    Gallery
                                </button>
                            </div>
                        </div>
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
                        leftIcon={<Save className="w-5 h-5" />}
                        className="px-12"
                    >
                        Save Changes
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
