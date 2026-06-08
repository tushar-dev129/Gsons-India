"use client";

import { useState } from "react";
import { getAllUsers, deleteUser } from "@/services/userApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserMinus, Search, Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/utils/cn";

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: getAllUsers,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    const users = data?.users || [];

    const filteredUsers = users.filter((user: any) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const removeUser = async (id: string) => {
        if (confirm("Are you sure you want to remove this user?")) {
            try {
                await deleteMutation.mutateAsync(id);
                toast.success("User deleted successfully");
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to delete user");
            }
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900">User Management</h1>
                <p className="text-gray-500 mt-2">Manage registered customers and users.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search users by name or phone..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">Loading users...</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No users found.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm font-semibold  ">
                                    <th className="px-6 py-4">User Details</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user: any) => (
                                    <tr key={user._id} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-lg overflow-hidden">
                                                    {user.avatar?.url ? (
                                                        <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.name.charAt(0)
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{user.name}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{user._id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-orange-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 capitalize font-medium text-gray-600">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-semibold",
                                                user.role === "admin" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                                            )}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role !== "admin" && (
                                                <button
                                                    onClick={() => removeUser(user._id)}
                                                    disabled={deleteMutation.isPending}
                                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors group/btn disabled:opacity-50"
                                                    title="Remove User"
                                                >
                                                    <UserMinus className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
