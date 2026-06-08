"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronRight, ChevronDown, X, ArrowUp, ArrowDown, Filter } from "lucide-react";
import { cn } from "@/utils/cn";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import type { ProductFilters } from "@/types/product";

const LIMIT = 15;

const SORT_CATEGORIES = [
    { id: "createdAt", label: "Date Added" },
    { id: "price", label: "Price" },
    { id: "name", label: "Name" },
];

const getSortLabel = (val: string) => {
    switch (val) {
        case "-createdAt": return "Newest First";
        case "createdAt": return "Oldest First";
        case "price": return "Price: Low to High";
        case "-price": return "Price: High to Low";
        case "name": return "Name: A–Z";
        case "-name": return "Name: Z–A";
        default: return "Sort";
    }
};

// ─── Skeleton Grid ────────────────────────────────────────
function SkeletonGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(LIMIT)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 h-80 animate-pulse border border-gray-100">
                    <div className="bg-gray-100 h-48 rounded-xl mb-4" />
                    <div className="bg-gray-100 h-4 w-3/4 rounded mb-2" />
                    <div className="bg-gray-100 h-4 w-1/3 rounded" />
                </div>
            ))}
        </div>
    );
}


// ─── Main Page Content ────────────────────────────────────
function ProductsContent() {
    const searchParams = useSearchParams();

    // Filter state
    const [search, setSearch] = useState(searchParams.get("keyword") || "");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [activeCategoryId, setActiveCategoryId] = useState(searchParams.get("category") || "");
    const [sort, setSort] = useState("-createdAt");
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Custom sort toggle handler
    const handleSortChange = (categoryId: string) => {
        const activeBase = sort.replace("-", "");
        if (activeBase === categoryId) {
            setSort(sort.startsWith("-") ? categoryId : `-${categoryId}`);
        } else {
            if (categoryId === "createdAt") setSort("-createdAt");
            else if (categoryId === "price") setSort("price");
            else setSort("name");
        }
        setPage(1);
        setIsSortOpen(false);
    };
    const [maxPrice, setMaxPrice] = useState(50000);
    const [page, setPage] = useState(1);

    // Category data for the header label
    const { categories } = useCategories();
    const activeCategoryName = categories.find((c) => c._id === activeCategoryId)?.name;

    // Sync category from URL (e.g. clicking landing page category circle)
    useEffect(() => {
        const cat = searchParams.get("category");
        setActiveCategoryId(cat || "");

        const key = searchParams.get("keyword");
        setSearch(key || "");
    }, [searchParams]);

    // Debounce search — reset to page 1 when keyword changes
    useEffect(() => {
        const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const filters: ProductFilters = {
        keyword: debouncedSearch || undefined,
        category: activeCategoryId || undefined,
        maxPrice,
        sort,
        page,
        limit: LIMIT,
    };

    const { data, isLoading } = useProducts(filters);
    const products = data?.data ?? [];
    const totalProducts = data?.total ?? 0;
    const totalPages = data?.totalPages || Math.ceil(totalProducts / LIMIT);

    const handleClear = () => { setSearch(""); setActiveCategoryId(""); setSort("-createdAt"); setMaxPrice(50000); setPage(1); };

    return (
        <div className="bg-[#FAF9F6] min-h-screen pt-7 pb-24">
            <div className="container-custom">
                {/* Page Navigation & Context */}
                <div className="mb-8 md:mb-12 font-display">
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-400  mb-4 md:mb-6">
                        <span>Collection</span>
                        <ChevronRight className="w-3 h-3 " />
                        <span className="text-primary">{activeCategoryName || "All Archives"}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-sm text-slate-500 font-medium">
                            {isLoading ? "Curating..." : `${totalProducts} Products Available`}
                        </h2>

                        {/* Sort - Custom Dropdown */}
                        <div className="relative group z-30 flex items-center justify-end">
                            {isSortOpen && (
                                <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setIsSortOpen(false)} 
                                />
                            )}
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="relative z-20 flex items-center justify-center md:justify-between w-fit p-3 md:p-0 md:min-w-[180px] md:pl-[68px] md:pr-4 md:py-3.5 bg-white border border-slate-100 rounded-2xl shadow-luxe transition-all hover:border-primary/20 md:border-l-4 md:border-l-primary"
                            >
                                <div className="hidden md:flex absolute left-0 top-0 bottom-0 flex-col justify-center px-4 pointer-events-none border-r border-slate-50">
                                    <span className="text-[9px]   text-slate-400 font-semibold">Sort By</span>
                                </div>
                                
                                <span className="hidden md:inline-block text-[11px] font-semibold  text-slate-900 truncate ml-2">
                                    {getSortLabel(sort)}
                                </span>
                                <Filter className="w-5 h-5 text-slate-600 md:hidden" />
                                <ChevronDown className={cn("hidden md:block w-4 h-4 text-slate-400 transition-transform ml-2 shrink-0", isSortOpen && "rotate-180")} />
                            </button>

                            {isSortOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 md:w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 z-30">
                                    {SORT_CATEGORIES.map((cat) => {
                                        const activeBase = sort.replace("-", "");
                                        const isActive = activeBase === cat.id;
                                        const isDesc = sort.startsWith("-");

                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleSortChange(cat.id)}
                                                className={cn(
                                                    "w-full text-left px-5 py-3 flex items-center justify-between text-[11px] font-semibold  transition-colors",
                                                    isActive ? "text-primary bg-primary/5" : "text-slate-600 hover:bg-slate-50"
                                                )}
                                            >
                                                <span>{cat.label}</span>
                                                {isActive && (
                                                    <span className="flex items-center text-primary">
                                                        {isDesc ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 items-start">
                    <main className="space-y-12">
                        {isLoading ? (
                            <SkeletonGrid />
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                                    {products.map((product: any) => {
                                        const firstVariant = product.variants?.[0] || {};
                                        
                                        const displayItem = {
                                            ...product,
                                            price: product.price || firstVariant.price,
                                            images: product.images && product.images.length > 0 ? product.images : (firstVariant.images || []),
                                            sku: product.sku || product.code || firstVariant.sku
                                        };

                                        return <ProductCard key={product._id} {...displayItem} />;
                                    })}
                                </div>
                                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                            </>
                        ) : (
                            <div className="py-40 text-center bg-white rounded-4xl border border-dashed border-slate-200 shadow-luxe">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-3xl text-slate-900 mb-4 font-display tracking-tight">Visions Not Found</h3>
                                <p className="text-slate-500 mb-10 max-w-xs mx-auto font-medium">We couldn't find any pieces matching your current filters. Try adjusting your parameters.</p>
                                <button onClick={handleClear}
                                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-xs  hover:bg-primary transition-all shadow-luxe-lg active:scale-95">
                                    Reset Discovery
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

// Suspense wrapper required for useSearchParams
export default function ProductsPage() {
    return (
        <Suspense>
            <ProductsContent />
        </Suspense>
    );
}
