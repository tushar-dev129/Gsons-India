"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/utils/cn";

export default function CategoryList() {
    const { categories, isLoading } = useCategories();

    if (isLoading) {
        return (
            <section className="py-16 bg-white overflow-hidden">
                <div className="container-custom">
                    <div className="flex items-center justify-between gap-8 overflow-x-auto pb-8 scrollbar-hide">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center shrink-0 animate-pulse">
                                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-slate-50 border border-slate-100 mb-4" />
                                <div className="h-3 bg-slate-50 rounded w-12" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!categories.length) return null;

    // Duplicate categories for infinite scroll
    const duplicatedCategories = [...categories, ...categories, ...categories, ...categories];

    return (
        <section className="py-24 bg-white">
            <div className="container-custom">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl  text-slate-900  font-display">
                        Choose Your Category
                    </h2>
                    <p className="text-slate-400 text-[13px] font-medium italic">Explore our curated collection of professional lighting solutions</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat._id}
                            href={`/products?category=${cat._id}`}
                            className="group relative gap-3  flex flex-col items-center overflow-hidden  p-2 rounded-[2rem] border border-black/20 transition-all duration-500 hover:bg-black/5 hover:border-black/30 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-2"
                        >
                            {/* Icon / Mini-image */}
                            <div className="flex  items-center justify-center transition-all duration-500 scale-110">
                                {cat.image?.url ? (
                                    <img
                                        src={cat.image.url}
                                        alt={cat.name}
                                        className="w-full h-full aspect-square object-cover"
                                    />
                                ) : (
                                    <div className=" rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300  group-hover:border-white/40 group-hover:text-white">
                                        {cat.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="text-center space-y-3">
                                <h3 className="text-sm py-2  text-black/60 transition-colors">
                                    {cat.name}
                                </h3>
                             
                            </div>

                            {/* Decorative element seen in some Grostore categories */}
                            <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-slate-100 group-hover:bg-white/40" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
