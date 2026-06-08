"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, Search, ShoppingBag } from "lucide-react";
import { getAllInquiries } from "@/services/inquiryApi";
import { formatPrice } from "@/utils/formatters";

export default function AdminInquiriesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isLoading } = useQuery({
        queryKey: ["admin-inquiries"],
        queryFn: getAllInquiries,
    });

    const inquiries = data?.inquiries || [];
    const filteredInquiries = inquiries.filter((inquiry: any) => {
        const haystack = [
            inquiry.buyerName,
            inquiry.buyerEmail,
            inquiry.buyerPhone,
            inquiry.company,
            inquiry.items?.map((item: any) => `${item.name} ${item.code}`).join(" "),
        ].join(" ").toLowerCase();
        return haystack.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900">Order Inquiries</h1>
                <p className="mt-2 text-gray-500">See buyers and the products they are interested in.</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search inquiries..."
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-gray-900 placeholder:text-gray-500 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading inquiries...</div>
                ) : filteredInquiries.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No inquiries found.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredInquiries.map((inquiry: any) => (
                            <div key={inquiry._id} className="p-6">
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-xl font-semibold text-gray-900">{inquiry.buyerName}</h2>
                                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold capitalize text-orange-600">
                                                {inquiry.status}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                                            <a href={`mailto:${inquiry.buyerEmail}`} className="flex items-center gap-2 hover:text-primary">
                                                <Mail className="h-4 w-4 text-orange-400" />
                                                {inquiry.buyerEmail}
                                            </a>
                                            <a href={`tel:${inquiry.buyerPhone}`} className="flex items-center gap-2 hover:text-primary">
                                                <Phone className="h-4 w-4 text-orange-400" />
                                                {inquiry.buyerPhone}
                                            </a>
                                        </div>
                                        {inquiry.company && <p className="mt-2 text-sm font-medium text-gray-500">{inquiry.company}</p>}
                                        {inquiry.message && <p className="mt-3 max-w-2xl text-sm text-gray-600">{inquiry.message}</p>}
                                    </div>
                                    <div className="rounded-xl bg-gray-50 px-5 py-4 text-right w-[250px]">
                                        <span className="flex items-center justify-between gap-2">
                                        <p className="text-md font-semibold text-gray-500">Total Items</p>
                                        <p className="text-lg font-semibold text-gray-900">{inquiry.totalItems}</p>
                                        </span>
                                        <span className="flex items-center justify-between gap-2">

                                        <p className="mt-2 text-md font-semibold text-gray-500">Subtotal</p>
                                        <p className="text-lg font-semibold text-primary">{formatPrice(inquiry.subtotal)}</p>
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 overflow-x-auto rounded-xl border border-gray-100">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
                                            <tr>
                                                <th className="px-4 py-3">Product</th>
                                                <th className="px-4 py-3">Code</th>
                                                <th className="px-4 py-3">Qty</th>
                                                <th className="px-4 py-3">Price</th>
                                                <th className="px-4 py-3">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {inquiry.items.map((item: any, index: number) => (
                                                <tr key={`${inquiry._id}-${index}`}>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center whitespace-nowrap gap-2 font-semibold text-gray-900">
                                                            <ShoppingBag className="h-4 w-4 text-orange-400" />
                                                            {item.name}
                                                        </div>
                                                        {item.attributes && Object.values(item.attributes).length > 0 && (
                                                            <p className="mt-1 text-xs text-gray-500">{Object.values(item.attributes).join(" | ")}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{item.code || "N/A"}</td>
                                                    <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-gray-700">{formatPrice(item.price)}</td>
                                                    <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
