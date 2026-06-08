"use client";

import React from 'react';
import Link from 'next/link';
import { useCategories } from "@/hooks/useCategories";
import { 
    Flower2, 
    Plug, 
    Route, 
    Fence, 
    Sparkles, 
    Layout, 
    LampCeiling, 
    CircleDot, 
    Cpu, 
    Sun, 
    Spline, 
    Lightbulb, 
    Gem,
    Zap
} from "lucide-react";

const categoryIconMap: Record<string, any> = {
    "Garden Lights": Flower2,
    "Accessories": Plug,
    "Street Lights": Route,
    "Gate Lights": Fence,
    "Fancy Lights": Sparkles,
    "LED Panels": Layout,
    "Hanging Lights": LampCeiling,
    "Downlights": CircleDot,
    "COB Lights": Cpu,
    "Flood Lights": Sun,
    "LED Strips": Spline,
    "Bulbs": Lightbulb,
    "Jhumar / Chandeliers": Gem,
};

const Header = () => {
    const { categories, isLoading } = useCategories();

    if (isLoading) {
        return (
            <div className='bg-white border-b border-slate-100 h-20 w-full flex items-center justify-center'>
                <div className="flex gap-10">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className="h-8 w-8 bg-slate-50 animate-pulse rounded-full" />
                            <div className="h-2 w-16 bg-slate-50 animate-pulse rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className='bg-white border-b border-slate-100 w-full overflow-hidden shadow-sm'>
            <div className="container-custom">
                <nav className="flex overflow-x-auto items-center justify-start gap-4 md:gap-12 py-3 scrollbar-hide">
                    {categories.map((category) => {
                        const Icon = categoryIconMap[category.name] || Zap;
                        return (
                            <Link
                                key={category._id}
                                href={`/products?category=${category._id}`}
                                className="group flex flex-col items-center gap-2 min-w-[70px] shrink-0 transition-all duration-300"
                            >
                                <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-primary/10 transition-colors duration-300">
                                    <Icon 
                                        className="w-5 h-5 text-slate-600 group-hover:text-primary group-hover:scale-110 transition-all duration-300" 
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-700 group-hover:text-primary transition-colors whitespace-nowrap  ">
                                    {category.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default Header;
