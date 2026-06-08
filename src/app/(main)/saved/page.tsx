"use client";

import React from 'react';
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import { useSaved } from "@/context/SavedContext";
import { useAuth } from "@/context/AuthContext";
import Link from 'next/link';
import { Heart, Lock, ArrowRight, Bookmark, Download, ChevronDown, FileText, FileSpreadsheet, Archive } from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';
import { cn } from "@/utils/cn";

export default function SavedPage() {
    const { savedProducts, savedVariants, loading: savedLoading } = useSaved();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const [isExportOpen, setIsExportOpen] = useState(false);

    const allSavedItems = [
        ...savedProducts.map(p => ({ ...p, type: 'product' })),
        ...savedVariants.map(v => ({ 
            ...v, 
            type: 'variant',
            name: v.productId?.name || "Premium Selection",
            productId: v.productId?._id,
            variantId: v._id,
            category: typeof v.productId?.categoryId === 'object' ? v.productId.categoryId.name : "Lighting",
            images: v.images && v.images.length > 0 ? v.images : v.productId?.images
        }))
    ];

    const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
        if (allSavedItems.length === 0) return;

        const data = allSavedItems.map(item => ({
            Name: item.name,
            Code: item.sku || item.code || 'ARCHIVE-REF',
            Configuration: item.type === 'variant' && item.attributes 
                ? Object.values(item.attributes).join(' | ') 
                : 'Standard Specification',
            Price: `₹${item.price}`,
            Source: item.images?.[0]?.url || 'N/A'
        }));

        if (format === 'csv') {
            const headers = Object.keys(data[0]).join(',');
            const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n');
            const blob = new Blob([headers + "\n" + rows], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", `gsons_archive_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (format === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Saved Archive");
            XLSX.writeFile(workbook, `gsons_archive_${new Date().toISOString().split('T')[0]}.xlsx`);
        } else if (format === 'pdf') {
            const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
            doc.setFontSize(22);
            doc.setTextColor(15, 23, 42); 
            doc.text("Gsons Architectural Archive", 14, 20);
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on ${new Date().toLocaleDateString()} | Total Items: ${data.length}`, 14, 28);
            
            autoTable(doc, {
                startY: 35,
                head: [['Name', 'Code/SKU', 'Configuration', 'Valuation', 'Asset Link']],
                body: data.map(row => [
                    row.Name,
                    row.Code,
                    row.Configuration,
                    row.Price,
                    row.Source
                ]),
                theme: 'striped',
                styles: { fontSize: 8, cellPadding: 4, overflow: 'linebreak' },
                headStyles: { 
                    fillColor: [15, 23, 42], 
                    fontSize: 9, 
                    fontStyle: 'bold', 
                    halign: 'center',
                    cellPadding: 5 
                },
                columnStyles: {
                    0: { cellWidth: 60 }, // Name
                    1: { cellWidth: 40 }, // Code
                    2: { cellWidth: 70 }, // Configuration
                    3: { cellWidth: 30, halign: 'right' }, // Valuation
                    4: { cellWidth: 70, fontSize: 7 } // Asset Link
                },
                margin: { top: 35, left: 14, right: 14 },
                alternateRowStyles: { fillColor: [248, 250, 252] }
            });
            doc.save(`gsons_archive_${new Date().toISOString().split('T')[0]}.pdf`);
        }
        setIsExportOpen(false);
    };

    if (authLoading || savedLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6]">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                <p className="text-[10px]  text-slate-400   mt-6">Retrieving Archive</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-48">
                <div className="container-custom">
                    <div className="text-center py-32 flex flex-col items-center max-w-2xl mx-auto space-y-10">
                        <div className="relative group">
                            <div className="w-32 h-32 bg-white rounded-4xl flex items-center justify-center shadow-luxe transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                                <Lock className="w-12 h-12 text-slate-200" />
                            </div>
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-luxe-lg transform -rotate-12 group-hover:rotate-0 transition-transform">
                                <Bookmark className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-4xl  text-slate-900 font-display  ">Access Restricted</h3>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                Curate your personal architectural archive. Authenticate your profile to preserve and manage your favorite selections across devices.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 pt-8">
                            <Link
                                href="/auth/login"
                                className="bg-slate-900 text-white px-12 py-6 rounded-2xl  text-xs   hover:bg-primary transition-all shadow-luxe-lg flex items-center gap-4 group"
                            >
                                Verify Identity
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                            </Link>
                            <Link
                                href="/products"
                                className="bg-white text-slate-900 px-12 py-6 rounded-2xl  text-xs   border border-slate-100 hover:border-primary transition-all shadow-luxe"
                            >
                                Explore Gallery
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FAF9F6] min-h-screen pt-10 pb-15">
            <div className="container-custom">

                {allSavedItems.length === 0 ? (
                    <div className="text-center py-32 flex flex-col items-center max-w-2xl mx-auto space-y-10">
                        <div className="relative group">
                            <div className="w-32 h-32 bg-white rounded-4xl border border-dashed border-slate-200 flex items-center justify-center transition-all duration-1000 group-hover:border-primary group-hover:rotate-12">
                                <Heart className="w-12 h-12 text-slate-100 group-hover:text-primary/20 transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-4xl  text-slate-900 font-display  ">No Products</h3>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                Your personal architectural workspace is currently silent. Explore the main collection to archive pieces for your upcoming projects.
                            </p>
                        </div>

                        <Link
                            href="/products"
                            className="bg-primary text-white px-8 py-4 font-semibold rounded-2xl  text-sm   hover:bg-slate-900 transition-all shadow-luxe-lg flex items-center gap-4 group"
                        >
                            Explore Global Collection
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div>
                                <h1 className="text-3xl font-display text-slate-900  mb-2">Saved Archive</h1>
                                <p className="text-slate-500 text-sm font-medium">Manage and export your curated architectural selections.</p>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setIsExportOpen(!isExportOpen)}
                                    className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-3.5 rounded-2xl shadow-luxe hover:border-primary transition-all group active:scale-95"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Download className="w-4 h-4" />
                                    </div>
                                    <span className="text-[12px] font-semibold  text-slate-700 ">Export Archive</span>
                                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isExportOpen && "rotate-180")} />
                                </button>

                                {isExportOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setIsExportOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                                            <button
                                                onClick={() => handleExport('csv')}
                                                className="w-full flex items-center px-5 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors group"
                                            >
                                                <Archive className="w-4 h-4 mr-4 opacity-50 group-hover:opacity-100 group-hover:text-primary" />
                                                Export CSV
                                            </button>
                                            <button
                                                onClick={() => handleExport('excel')}
                                                className="w-full flex items-center px-5 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors group border-t border-slate-50"
                                            >
                                                <FileSpreadsheet className="w-4 h-4 mr-4 opacity-50 group-hover:opacity-100 group-hover:text-green-600" />
                                                Export Excel
                                            </button>
                                            <button
                                                onClick={() => handleExport('pdf')}
                                                className="w-full flex items-center px-5 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors group border-t border-slate-50"
                                            >
                                                <FileText className="w-4 h-4 mr-4 opacity-50 group-hover:opacity-100 group-hover:text-red-500" />
                                                Export PDF
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {allSavedItems.map((item, idx) => (
                            <ProductCard
                                key={item._id || idx}
                                _id={item.type === 'variant' ? item.productId : item._id}
                                productId={item.type === 'variant' ? item.productId : undefined}
                                variantId={item.type === 'variant' ? item.variantId : undefined}
                                name={item.name}
                                price={Number(item.price)}
                                images={item.images}
                                category={item.category}
                                attributes={item.attributes}
                                isSale={item.isSale}
                                rating={item.rating}
                                reviews={item.reviews}
                            />
                        ))}
                    </div>
                </>
                )}
            </div>
        </div>
    );
}
