"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Download, Minus, Plus, Send, ShoppingCart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createInquiry } from "@/services/inquiryApi";
import { formatPrice } from "@/utils/formatters";

export default function CartPage() {
    const { items, totalItems, subtotal, updateQuantity, removeItem, clearCart } = useCart();
    const { user, isAuthenticated, loading } = useAuth();
    const [form, setForm] = useState({
        buyerName: "",
        buyerEmail: "",
        buyerPhone: "",
        company: "",
        message: "",
    });

    useEffect(() => {
        if (user) {
            setForm((current) => ({
                ...current,
                buyerName: current.buyerName || user.name || "",
                buyerEmail: current.buyerEmail || user.email || "",
                buyerPhone: current.buyerPhone || user.phone || user.mobile || "",
                company: current.company || user.company || "",
            }));
        }
    }, [user]);

    const inquiryMutation = useMutation({
        mutationFn: createInquiry,
        onSuccess: () => {
            toast.success("Inquiry sent to admin");
            clearCart();
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to send inquiry");
        },
    });

    const handleDownloadInvoice = () => {
        if (!isAuthenticated) {
            toast.error("Please login to download invoice");
            return;
        }
        if (items.length === 0) {
            toast.error("Add items before downloading invoice");
            return;
        }

        const doc = new jsPDF();
        const invoiceNo = `GSONS-${Date.now().toString().slice(-6)}`;
        const date = new Date().toLocaleDateString("en-IN");

        doc.setFontSize(18);
        doc.text("Gsons Order Invoice", 14, 18);
        doc.setFontSize(10);
        doc.text(`Invoice No: ${invoiceNo}`, 14, 26);
        doc.text(`Date: ${date}`, 14, 32);
        doc.text("Buyer Details", 14, 44);
        doc.text(`Name: ${form.buyerName || "N/A"}`, 14, 50);
        doc.text(`Email: ${form.buyerEmail || "N/A"}`, 14, 56);
        doc.text(`Phone: ${form.buyerPhone || "N/A"}`, 14, 62);
        doc.text(`Company: ${form.company || "N/A"}`, 14, 68);

        autoTable(doc, {
            startY: 78,
            head: [["#", "Item", "Code", "Qty", "Price", "Total"]],
            body: items.map((item, index) => [
                String(index + 1),
                item.name,
                item.code || "N/A",
                String(item.quantity),
                `Rs. ${item.price.toLocaleString("en-IN")}`,
                `Rs. ${(item.price * item.quantity).toLocaleString("en-IN")}`,
            ]),
            styles: { fontSize: 9 },
            headStyles: { fillColor: [234, 88, 12] },
        });

        const finalY = (doc as any).lastAutoTable?.finalY || 120;
        doc.setFontSize(11);
        doc.text(`Total Items: ${totalItems}`, 14, finalY + 12);
        doc.text(`Subtotal: Rs. ${subtotal.toLocaleString("en-IN")}`, 14, finalY + 20);
        doc.setFontSize(9);
        doc.text("This document is generated from selected cart items. Final availability and pricing will be confirmed by Gsons.", 14, finalY + 32);
        doc.save(`${invoiceNo}.pdf`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            toast.error("Add items before sending an inquiry");
            return;
        }
        if (!isAuthenticated) {
            toast.error("Please login to send an inquiry");
            return;
        }
        inquiryMutation.mutate({ ...form, items });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] py-24 text-center text-slate-500">
                Loading cart...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6] pb-24">
            <div className="container-custom py-10">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold text-primary">Order Cart</p>
                        <h1 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl">Selected Products</h1>
                        <p className="mt-2 text-sm text-slate-500">Review products, download an invoice, or send the order inquiry to Gsons.</p>
                    </div>
                    <button
                        onClick={handleDownloadInvoice}
                        disabled={items.length === 0}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-primary/80 px-5 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Download className="h-4 w-4" />
                        Download Invoice
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <ShoppingCart className="h-7 w-7" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900">Your cart is empty</h2>
                        <p className="mt-2 text-sm text-slate-500">Add products from the collection to create an inquiry.</p>
                        <Link href="/products" className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="grid gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:grid-cols-[96px_1fr_auto]">
                                    <img src={item.image || "/logo.png"} alt={item.name} className="h-24 w-24 rounded-xl bg-slate-50 object-contain" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-primary">{item.code || "N/A"}</p>
                                        <h2 className="mt-1 text-lg font-semibold text-slate-900">{item.name}</h2>
                                        {item.attributes && Object.values(item.attributes).length > 0 && (
                                            <p className="mt-1 text-xs font-semibold text-slate-400">{Object.values(item.attributes).join(" | ")}</p>
                                        )}
                                        <p className="mt-3 text-sm font-semibold text-slate-900">{formatPrice(item.price)}</p>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                                        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-slate-600 hover:text-primary" title="Decrease quantity">
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-10 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-slate-600 hover:text-primary" title="Increase quantity">
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="p-2 text-slate-400 transition-colors hover:text-red-500" title="Remove item">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-900">Send Enquiry for Order</h2>
                            <div className="mt-5 space-y-4">
                                <input value={form.buyerName} onChange={(e) => setForm({ ...form, buyerName: e.target.value })} required placeholder="Name" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary" />
                                <input value={form.buyerEmail} onChange={(e) => setForm({ ...form, buyerEmail: e.target.value })} required type="email" placeholder="Email" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary" />
                                <input value={form.buyerPhone} onChange={(e) => setForm({ ...form, buyerPhone: e.target.value })} required placeholder="Phone" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary" />
                                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company (optional)" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary" />
                                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message (optional)" rows={4} className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary" />
                            </div>

                            <div className="mt-6 border-t border-slate-100 pt-5">
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Total Items</span>
                                    <span className="font-semibold text-slate-900">{totalItems} items</span>
                                </div>
                                <div className="mt-2 flex justify-between text-base">
                                    <span className="font-semibold text-slate-900">Subtotal</span>
                                    <span className="font-semibold text-primary">{formatPrice(subtotal)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={inquiryMutation.isPending}
                                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Send className="h-4 w-4" />
                                {inquiryMutation.isPending ? "Sending..." : "Send Enquiry"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
