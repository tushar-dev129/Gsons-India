"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Calendar, User, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllPosts, deletePost } from "@/services/postApi";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

export default function PostsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const queryClient = useQueryClient();
    const router = useRouter();

    // Fetch Posts
    const { data, isLoading } = useQuery({
        queryKey: ["posts"],
        queryFn: getAllPosts,
    });

    // Delete Post Mutation
    const deleteMutation = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Post deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete post");
        },
    });

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            deleteMutation.mutate(id);
        }
    };

    const posts = data?.posts || [];

    const filteredPosts = posts.filter((post: any) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Posts Management</h1>
                    <p className="text-gray-500 mt-2">Create and manage blog posts and articles.</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => router.push("/admin/posts/new")}
                    leftIcon={<Plus className="w-5 h-5" />}
                >
                    New Post
                </Button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            className="w-full pl-10 pr-4 py-2 text-gray-900 placeholder:text-gray-500 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
                            <Button variant="ghost" isLoading className="scale-150 mb-4" />
                            <p>Loading posts...</p>
                        </div>
                    ) : filteredPosts.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-gray-50/80 backdrop-blur-md text-gray-900 text-xs    border-b border-gray-100">
                                    <th className="px-6 py-5">Post Title</th>
                                    <th className="px-6 py-5">Category</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPosts.map((post: any) => (
                                    <tr key={post._id} className="hover:bg-orange-50/40 transition-all duration-300 group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-start gap-4 max-w-lg">
                                                {/* Post Image Thumbnail */}
                                                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100 group-hover:border-primary/20 transition-colors shadow-sm">
                                                    {post.image?.url ? (
                                                        <img
                                                            src={post.image.url}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <Eye className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1 py-1">
                                                    <div
                                                        onClick={() => router.push(`/admin/posts/edit/${post._id}`)}
                                                        className="font-semibold text-gray-900 group-hover:text-primary transition-colors cursor-pointer line-clamp-1 mb-1"
                                                    >
                                                        {post.title}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[10px] font-semibold   text-gray-400">
                                                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                                            <User className="w-2.5 h-2.5" />
                                                            {post.user?.name || "Admin"}
                                                        </span>
                                                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                                            <Calendar className="w-2.5 h-2.5" />
                                                            {new Date(post.createdAt).toLocaleDateString('en-GB')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[11px]  text-gray-600  ">
                                                {post.category}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={cn(
                                                "inline-flex items-center px-3 py-1 text-[10px]  rounded-full   border shadow-sm",
                                                post.status === 'Published'
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : 'bg-orange-50 text-orange-700 border-orange-100'
                                            )}>
                                                <span className={cn(
                                                    "w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse",
                                                    post.status === 'Published' ? "bg-green-500" : "bg-orange-500"
                                                )} />
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.open(`/posts/${post._id}`, '_blank')}
                                                    className="w-8 h-8 p-0 rounded-lg hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-primary"
                                                    title="Preview Post"
                                                    leftIcon={<Eye className="w-4 h-4" />}
                                                /> */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.push(`/admin/posts/edit/${post._id}`)}
                                                    className="w-8 h-8 p-0 rounded-lg hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-indigo-600"
                                                    title="Edit Post"
                                                    leftIcon={<Edit2 className="w-4 h-4" />}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(post._id)}
                                                    className="w-8 h-8 p-0 rounded-lg hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-red-500"
                                                    title="Delete Post"
                                                    isLoading={deleteMutation.isPending && deleteMutation.variables === post._id}
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
                            No posts found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
