"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, MessageSquare, Phone, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMyInquiries } from "@/services/inquiryApi";
import { formatPrice } from "@/utils/formatters";
import Loader from "@/components/Loader";

export default function QueriesPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, loading, router]);

    const { data, isLoading } = useQuery({
        queryKey: ["my-inquiries"],
        queryFn: getMyInquiries,
        enabled: isAuthenticated,
    });

    if (loading) return <Loader fullPage text="Checking access..." />;
    if (!isAuthenticated) return null;

    const inquiries = data?.inquiries || [];

    return (
        <div className="min-h-screen bg-[#FAF9F6] pb-24">
            <div className="container-custom py-10">
                <div className="mb-8">
                    <p className="text-xs font-semibold text-primary">My Queries</p>
                    <h1 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl">Sent Enquiries</h1>
                    <p className="mt-2 text-sm text-slate-500">Track the product enquiries you have sent to the Gsons team.</p>
                </div>

                {isLoading ? (
                    <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">Loading queries...</div>
                ) : inquiries.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <MessageSquare className="h-7 w-7" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900">No queries yet</h2>
                        <p className="mt-2 text-sm text-slate-500">Send an enquiry from your cart and it will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {inquiries.map((inquiry: any) => (
                            <div key={inquiry._id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-xl font-semibold text-slate-900">Query #{String(inquiry._id).slice(-6).toUpperCase()}</h2>
                                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">{inquiry.status}</span>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-500">
                                            Sent on {new Date(inquiry.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                                            <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />{inquiry.buyerEmail}</span>
                                            <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{inquiry.buyerPhone}</span>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 px-5 py-4 text-left md:text-right">
                                        <p className="text-xs font-semibold text-slate-500">Total Items</p>
                                        <p className="text-lg font-semibold text-slate-900">{inquiry.totalItems} Items</p>
                                        <p className="mt-2 text-xs font-semibold text-slate-500">Sub-total</p>
                                        <p className="text-lg font-semibold text-primary">{formatPrice(inquiry.subtotal)}</p>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-3">
                                    {inquiry.items.map((item: any, index: number) => (
                                        <div key={`${inquiry._id}-${index}`} className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 font-semibold text-slate-900">
                                                    <ShoppingBag className="h-4 w-4 text-primary" />
                                                    {item.name}
                                                </div>
                                                <p className="mt-1 text-xs font-semibold text-slate-500">Code: {item.code || "N/A"} | Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-slate-900">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
