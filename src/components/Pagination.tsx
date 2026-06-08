"use client";

import React from "react";

interface PaginationProps {
    page: number;
    totalPages: number;
    onChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            <button 
                onClick={() => onChange(page - 1)} 
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-all"
            >
                ← Prev
            </button>
            {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
                    return (
                        <button 
                            key={p} 
                            onClick={() => onChange(p)}
                            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                                page === p 
                                    ? "bg-gray-900 text-white" 
                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {p}
                        </button>
                    );
                }
                if (Math.abs(p - page) === 2) return <span key={p} className="text-gray-400">…</span>;
                return null;
            })}
            <button 
                onClick={() => onChange(page + 1)} 
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-all"
            >
                Next →
            </button>
        </div>
    );
}
