"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Send, Eye, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getPostById, updatePost } from "@/services/postApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "@/components/Button";

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Lighting Design",
        status: "Draft",
    });

    // Fetch existing post data
    const { data, isLoading } = useQuery({
        queryKey: ["post", id],
        queryFn: () => getPostById(id),
    });

    useEffect(() => {
        if (data) {
            const p = data;
            setFormData({
                title: p.title || "",
                excerpt: p.excerpt || "",
                content: p.content || "",
                category: p.category || "Lighting Design",
                status: p.status || "Draft",
            });
            if (p.image?.url) {
                setPreview(p.image.url);
            }
        }
    }, [data]);

    const categories = ["Lighting Design", "Home Decor", "Technical Guides", "Company News"];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Update Post Mutation
    const updateMutation = useMutation({
        mutationFn: (data: FormData) => updatePost(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", id] });
            toast.success("Post updated successfully!");
            router.push("/admin/posts");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update post");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append("title", formData.title);
        data.append("excerpt", formData.excerpt);
        data.append("content", formData.content);
        data.append("category", formData.category);
        data.append("status", formData.status);

        if (image) {
            data.append("file", image);
        }

        updateMutation.mutate(data);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Edit Post</h1>
                    <p className="text-gray-500 mt-2">Update your article content and settings.</p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    leftIcon={<X className="w-6 h-6" />}
                />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900  ">Post Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-lg font-semibold transition-all text-gray-900 placeholder:text-gray-500"
                                    placeholder="Enter a catchy title..."
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900  ">Excerpt</label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    rows={2}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-500"
                                    placeholder="A short summary of the post..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900  ">Content</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={12}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-serif text-gray-900 placeholder:text-gray-500"
                                    placeholder="Start writing your masterpiece here..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <h3 className="font-semibold text-gray-900 border-b border-gray-50 pb-4">Publish Settings</h3>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-700 ">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-gray-900"
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                    <option value="Scheduled">Scheduled</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-700 ">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-gray-900"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-2 flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    isLoading={updateMutation.isPending}
                                    fullWidth
                                    leftIcon={<Send className="w-4 h-4" />}
                                >
                                    Update Post
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    fullWidth
                                    leftIcon={<Eye className="w-4 h-4" />}
                                >
                                    Preview
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-semibold text-gray-900">Featured Image</h3>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer group overflow-hidden relative min-h-[160px] flex flex-col items-center justify-center"
                            >
                                <input
                                    type="file"
                                    hidden
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                {preview ? (
                                    <div className="absolute inset-0 w-full h-full">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Upload className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2 group-hover:text-primary transition-colors" />
                                        <span className="text-xs font-semibold text-gray-500 group-hover:text-primary">Click to upload</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
