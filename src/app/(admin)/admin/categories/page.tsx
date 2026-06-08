"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCategories, createCategory, deleteCategory, updateCategory } from "@/services/categoryApi";
import { Plus, Trash2, Search, Upload, CheckCircle2, XCircle, Edit2, X, Save } from "lucide-react";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import Button from "@/components/Button";

export default function CategoriesPage() {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [image, setImage] = useState<File | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    // Auto-generate slug from name
    useEffect(() => {
        setSlug(name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
    }, [name]);

    // Fetch Categories
    const { data, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategories,
    });

    // Create Category Mutation
    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            resetForm();
            toast.success("Category added successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add category");
        },
    });

    // Update Category Mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, catData }: { id: string; catData: FormData }) => updateCategory(id, catData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            resetForm();
            toast.success("Category updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update category");
        },
    });

    // Delete Category Mutation
    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete category");
        },
    });

    const resetForm = () => {
        setName("");
        setSlug("");
        setDescription("");
        setIsActive(true);
        setImage(null);
        setEditId(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("slug", slug);
        formData.append("description", description);
        formData.append("isActive", String(isActive));
        if (image) {
            formData.append("file", image);
        } else if (!editId) {
            return toast.error("Category image is required");
        }

        if (editId) {
            updateMutation.mutate({ id: editId, catData: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleEdit = (cat: any) => {
        setEditId(cat._id);
        setName(cat.name);
        setSlug(cat.slug);
        setDescription(cat.description || "");
        setIsActive(cat.isActive);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            deleteMutation.mutate(id);
        }
    };

    const filteredCategories = data?.categories?.filter((cat: any) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900">Category Management</h1>
                <p className="text-gray-700 mt-2">Create and organize product categories.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left: Add Category Form */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            {editId ? <Edit2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                            {editId ? "Edit Category" : "Add New Category"}
                        </h3>
                        {editId && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={resetForm}
                                leftIcon={<X className="w-4 h-4" />}
                            >
                                Cancel Edit
                            </Button>
                        )}
                    </div>
                    <form onSubmit={handleAddCategory} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-900 block mb-2">Category Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-500"
                                placeholder="e.g., Wall Lights"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900 block mb-2">Slug</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-500 font-mono text-sm"
                                placeholder="wall-lights"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900 block mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-500"
                                placeholder="Category details..."
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900 block mb-2">Category Image</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary transition-colors cursor-pointer"
                            >
                                <input
                                    type="file"
                                    hidden
                                    ref={fileInputRef}
                                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                                    accept="image/*"
                                />
                                {image ? (
                                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                        <CheckCircle2 className="w-4 h-4" />
                                        {image.name}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-sm flex flex-col items-center">
                                        <Upload className="w-6 h-6 mb-1" />
                                        Click to upload
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="text-sm font-semibold text-gray-900 cursor-pointer">Active</label>
                        </div>

                        <Button
                            type="submit"
                            isLoading={createMutation.isPending || updateMutation.isPending}
                            fullWidth
                            leftIcon={editId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        >
                            {editId ? "Update Category" : "Add Category"}
                        </Button>
                    </form>
                </div>

                {/* Right: Categories List */}
                <div className="md:col-span-2 space-y-4">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                            <div className="relative max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-gray-900"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="p-12 text-center text-gray-500">
                                <Loader text="Loading categories..." />
                            </div>
                        ) : filteredCategories.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredCategories.map((cat: any) => (
                                    <div key={cat._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                                                {cat.image?.url ? (
                                                    <img src={cat.image.url || '/logo.png'} alt={cat.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-primary font-semibold">
                                                        {cat.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{cat.name}</h4>
                                                    {!cat.isActive && <XCircle className="w-4 h-4 text-red-500" />}
                                                </div>
                                                <p className="text-xs text-gray-500 font-mono">{cat.slug}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(cat)}
                                                className="text-gray-500 hover:text-primary"
                                                title="Edit Category"
                                                leftIcon={<Edit2 className="w-4 h-4" />}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(cat._id)}
                                                className="text-gray-500 hover:text-red-500"
                                                title="Delete Category"
                                                leftIcon={<Trash2 className="w-4 h-4" />}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500 italic">
                                No categories found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
