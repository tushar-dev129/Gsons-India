"use client";

import React, { useEffect, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import { getAllVariants } from "@/services/variantApi";
import type { Product, Variant } from "@/types/product";
import * as productsData from "../data/products";
import { ArrowRight } from "lucide-react";

export default function PopularProductsSection() {
    const [popularVariants, setPopularVariants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const data = await getAllVariants("limit=8");
                const variants = Array.isArray(data.data) ? data.data : [];
                setPopularVariants(variants);
            } catch (error) {
                console.error("Failed to fetch popular variants:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPopular();
    }, []);

    const popularItems = popularVariants.slice(0, 4);
    const bestDeals = popularVariants.slice(4, 8);

    return (
        <section className="py-24 bg-white">
            <div className="container-custom">
                <SectionHeading title="Curated Excellence" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-32">
                    {loading ? (
                        [...Array(4)].map((_, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-3xl h-[400px] animate-pulse"></div>
                        ))
                    ) : (
                        popularItems.map((variant, idx) => {
                            const product = variant.productId;
                            return (
                                <ProductCard
                                    key={variant._id || idx}
                                    {...product}
                                    attributes={variant.attributes}
                                    _id={product?._id}
                                    name={product?.name || "Premium Lighting"}
                                    price={variant.price}
                                    images={variant.images?.length > 0 ? variant.images : product?.images}
                                    sku={variant.sku}
                                    variantId={variant._id}
                                />
                            );
                        })
                    )}
                </div>

                {/* Architectural Promo Segment */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-32">
                    {/* Visionary Banner */}
                    <div className="lg:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-slate-900 min-h-[450px] flex flex-col justify-end p-12 shadow-luxe-lg">
                        <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover:scale-105">
                            <img src={productsData.gate[5]} className="w-full h-full object-cover" alt="Architectural Vision" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                        </div>

                        <div className="relative z-10 max-w-md space-y-6">
                            <span className="text-[10px]    text-primary">Partner Program</span>
                            <h3 className="text-4xl md:text-5xl  text-white leading-tight font-display ">
                                Engineered For <br /> The Visionary.
                            </h3>
                            <button className="flex items-center gap-3 text-xs    text-white group/btn transition-colors hover:text-primary">
                                Join Architect Network <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                            </button>
                        </div>
                    </div>

                    {/* Minimalist Spotlight */}
                    <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#F8F7F4] p-12 border border-slate-100 flex flex-col items-center text-center shadow-luxe">
                        <div className="absolute top-0 right-0 p-8">
                            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-primary group-hover:text-primary transition-colors">
                                <ArrowRight className="w-4 h-4 -rotate-45" />
                            </div>
                        </div>

                        <div className="space-y-2 mb-10">
                            <h4 className="text-xl  text-slate-900 font-display  ">The 2024 <br /> Masterpiece</h4>
                            <p className="text-[10px]  text-primary  ">Handmade Precision</p>
                        </div>

                        <div className="relative w-full aspect-square max-w-[200px] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
                            <div className="absolute inset-0 bg-white rounded-full shadow-luxe scale-110"></div>
                            <img src={productsData.hanging[4]} className="relative z-10 w-full h-full object-contain p-4" alt="Featured" />
                        </div>
                    </div>
                </div>

                <SectionHeading title="Dynamic Selection" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {loading ? (
                        [...Array(4)].map((_, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-3xl h-[400px] animate-pulse"></div>
                        ))
                    ) : (
                        bestDeals.map((variant, idx) => {
                            const product = variant.productId;
                            return (
                                <ProductCard
                                    key={`deal-${idx}`}
                                    {...product}
                                    attributes={variant.attributes}
                                    _id={product?._id}
                                    name={product?.name || "Best Selection"}
                                    price={variant.price}
                                    images={variant.images?.length > 0 ? variant.images : product?.images}
                                    sku={variant.sku}
                                    variantId={variant._id}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}
