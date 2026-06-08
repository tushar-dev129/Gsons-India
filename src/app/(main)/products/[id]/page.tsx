"use client";

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/services/productApi';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Heart, ShoppingCart, Check, Info, Play, Pause } from "lucide-react";
import { formatPrice } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import type { Product, Variant } from '@/types/product';
import { useSaved } from '@/context/SavedContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params?.id as string;

    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [mainImage, setMainImage] = useState<string>('');
    const { toggleSave, isSaved } = useSaved();
    const { isAuthenticated } = useAuth();
    const { addItem } = useCart();
    const videoRef = useRef<HTMLVideoElement>(null);

    const isVideo = (url: string) => {
        if (!url) return false;
        return /\.(mp4|webm|ogg)$/i.test(url);
    };

    const { data: product, isLoading, error } = useQuery<Product>({
        queryKey: ['product', productId],
        queryFn: () => getProductById(productId),
        enabled: !!productId
    });

    useEffect(() => {
        if (product) {
            setMainImage(product.images?.[0]?.url || '/logo.png');
            const matchedVariant = product.variants?.find(v => v._id === productId);
            if (matchedVariant) {
                setSelectedVariant(matchedVariant);
                if (matchedVariant.images?.[0]) setMainImage(matchedVariant.images[0].url || '/logo.png');
            } else if (product.variants?.length) {
                const firstVariant = product.variants[0];
                setSelectedVariant(firstVariant);
            }
        }
    }, [product, productId]);

    const targetId = selectedVariant?._id || productId;
    const saved = isSaved(targetId);

    const handleSave = () => {
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }
        toggleSave(targetId);
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                <p className="text-[10px]  text-slate-400  ">Establishing Connection</p>
            </div>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] text-center p-8">
            <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center shadow-xl border border-slate-50 mb-10 text-5xl">
                <Info className="w-12 h-12 text-slate-200" />
            </div>
            <div className="space-y-4 mb-12">
                <h1 className="text-4xl md:text-5xl  text-slate-900 ">Technical Disconnect</h1>
                <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">The requested specification has been moved or is currently unavailable in our archives.</p>
            </div>
            <button
                onClick={() => router.push('/products')}
                className="bg-primary text-white px-12 py-5 rounded-2xl font-semibold text-xs   hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95"
            >
                Return to Gallery
            </button>
        </div>
    );

    const currentPrice = selectedVariant?.price ?? product.price;
    const currentSKU = selectedVariant?.sku ?? product.code;
    const currentImages = (selectedVariant?.images?.length ? selectedVariant.images : product.images) || [];
    const productVideo = currentImages.find(img => isVideo(img.url))?.url;
    const currentImage = currentImages?.[0]?.url || mainImage || "/logo.png";
    const handleAddToCart = () => {
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }
        addItem({
            id: selectedVariant?._id || product._id,
            productId: product._id,
            variantId: selectedVariant?._id,
            name: product.name,
            code: currentSKU || product.slug || product._id,
            price: Number(currentPrice || 0),
            image: currentImage,
            attributes: selectedVariant?.attributes
                ? Object.fromEntries(Object.entries(selectedVariant.attributes).map(([key, value]) => [key, String(value)]))
                : undefined,
        });
    };

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-32">
            <div className="sticky top-0 z-40 bg-white border-b border-slate-100 py-3">
                <div className="container-custom flex items-center justify-between gap-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-[10px]    text-slate-400 hover:text-primary transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" />
                        Back to Selection
                    </button>

                    <div className="flex items-center gap-6 lg:gap-10">
                        <span className="text-xl font-semibold text-slate-900 font-display ">
                            {formatPrice(currentPrice)}
                        </span>
                        <button
                            onClick={handleAddToCart}
                            className="hidden sm:flex bg-primary text-white px-8 py-3 rounded-xl text-[12px]    hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-custom mt-12 lg:mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Visual Section */}
                    <div className="space-y-10 lg:sticky lg:top-30">
                        <div className="group relative aspect-square bg-white rounded-[3rem] overflow-hidden border border-slate-50 flex items-center justify-center  transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5 cursor-zoom-in">
                            {isVideo(mainImage) ? (
                                <video
                                    src={mainImage}
                                    className="max-w-full max-h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={mainImage || '/logo.png'}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                                />
                            )}
                            {product.isSale && (
                                <div className="absolute top-12 left-12 bg-primary text-white  px-8 py-2.5 rounded-2xl shadow-xl shadow-primary/20 text-[10px]  -rotate-2 ">
                                    Special Offer
                                </div>
                            )}
                        </div>

                        {currentImages.length > 1 && (
                            <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
                                {currentImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setMainImage(img.url)}
                                        className={cn(
                                            "w-24 h-24  rounded-3xl overflow-hidden bg-white border transition-all duration-500 transform active:scale-90 relative",
                                            mainImage === img.url
                                                ? "border-primary ring-4 ring-primary/5 scale-110"
                                                : "border-slate-50 opacity-50 hover:opacity-100"
                                        )}
                                    >
                                        {isVideo(img.url) ? (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                                <Play className="w-8 h-8 text-primary fill-primary/10" />
                                                <div className="absolute bottom-1 right-1 bg-primary/10 p-1 rounded-lg">
                                                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                                </div>
                                            </div>
                                        ) : (
                                            <img src={img.url || '/logo.png'} alt="" className="w-full h-full object-contain" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="space-y-16">
                        <div className="space-y-4">
                            <div className="flex items-center gap-6">
                                <span className="px-5 py-2 bg-slate-100 text-slate-500 text-[10px]  font-semibold  tracking-[0.25em] rounded-full border border-slate-200">
                                    {typeof product.categoryId === 'object'
                                        ? product.categoryId.name
                                        : (typeof product.category === 'object' ? product.category.name : (product.category || 'Uncategorized'))}
                                </span>
                                {currentSKU && (
                                    <span className="text-[14px]  text-slate-500 font-semibold   border-l border-slate-200 pl-6">
                                        ID: {currentSKU}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl  text-slate-800 leading-[1.1]  text-balance">
                                {product.name}
                            </h1>
                            <div className="flex items-baseline gap-5">
                                <span className="text-3xl font-semibold text-primary ">{formatPrice(currentPrice)}</span>
                                {currentPrice > 0 && (
                                    <span className="text-md text-red-400 line-through italic">
                                        {formatPrice(currentPrice * 1.15)}
                                    </span>
                                )}
                            </div>

                        </div>

                        {product.variants && product.variants.length > 0 && (
                            <div className=" space-y-4">
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-[10px] font-semibold   text-slate-400">Select Configuration</h3>
                                    {selectedVariant && (
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 flex items-center px-4 bg-white border border-primary/20 rounded-xl shadow-sm">
                                                <span className="text-[11px] font-semibold text-primary  ">
                                                    {Object.values(selectedVariant.attributes || {}).join(' | ')}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-semibold  ">
                                                SKU: {selectedVariant.sku}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {product.variants.map((variant) => {
                                        const isSelected = selectedVariant?._id === variant._id;
                                        const variantImg = variant.images?.[0]?.url || product.images?.[0]?.url || '/logo.png';
                                        return (
                                            <button
                                                key={variant._id}
                                                onClick={() => {
                                                    setSelectedVariant(variant);
                                                    const newImg = variant.images?.[0]?.url || product.images?.[0]?.url || '/logo.png';
                                                    setMainImage(newImg);
                                                }}
                                                className={cn(
                                                    "w-20 h-20 rounded-2xl border-2 transition-all duration-300 overflow-hidden relative group bg-white",
                                                    isSelected
                                                        ? "border-primary shadow-lg shadow-primary/20 scale-110 z-10"
                                                        : "border-slate-100 hover:border-primary/40 opacity-60 hover:opacity-100"
                                                )}
                                                title={Object.values(variant.attributes || {}).join(' | ')}
                                            >
                                                <img
                                                    src={variantImg}
                                                    alt={variant.sku}
                                                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                                                />
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <p className="text-slate-500 text-[13px] leading-relaxed font-medium max-w-lg">
                            {product.description || "A masterclass in professional illumination. Engineered for the discerning architect and designer who demands precision, sustainability, and aesthetic purity."}
                        </p>

                        <div className="space-y-10 pt-16 border-t border-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 space-y-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                        <Info className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-[17px]    text-slate-900">Technical Brief</h4>
                                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                            Designed for seamless spatial integration and architectural longevity. Optimized for high-end residential and gallery environments.
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/10 space-y-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-[17px]    text-white">Build Standards</h4>
                                        <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
                                            Engineered with aeronautical grade components and advanced thermal-protected core technology.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                    <h3 className="text-[17px]    text-slate-900 font-display">Product Data</h3>
                                    <span className="text-[8px]    text-primary px-3 py-1 bg-primary/5 rounded-full">Verified Specification</span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3">
                                    {[
                                        { label: "Material", value: "Premium Anodized Al." },
                                        { label: "IP Rating", value: "IP20 / Pro Grade" },
                                        { label: "Lifespan", value: "50,000+ Cycles" },
                                        { label: "Voltage", value: "220-240V / 50Hz" },
                                        { label: "Auth.", value: "GS / CE Certified" },
                                        { label: "Rendering", value: "CRI >90 (True)" }
                                    ].map((spec, i) => (
                                        <div key={i} className="p-6 border-r border-b border-slate-50 last:border-r-0 group hover:bg-slate-50 transition-colors">
                                            <span className="block text-[12px] font-semibold  text-slate-700  tracking-[0.15em]  group-hover:text-primary transition-colors">
                                                {spec.label}
                                            </span>
                                            <span className="text-xs font-normal text-slate-400">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t border-slate-100">
                            <button
                                onClick={handleAddToCart}
                                className="flex-2 bg-primary text-white py-4 rounded-3xl    text-lg font-semibold shadow-2xl shadow-primary/30 transition-all duration-500 hover:bg-primary/90 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 group"
                            >
                                <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
                                Add to Cart
                            </button>
                            <button 
                                onClick={handleSave}
                                className={cn(
                                    "flex-1 py-4 rounded-3xl  text-lg transition-all duration-500 font-semibold flex items-center justify-center gap-4 group shadow-xl",
                                    saved 
                                        ? "bg-primary/10 text-primary border border-primary/20 shadow-primary/5" 
                                        : "bg-white border border-slate-100 text-slate-900 hover:border-primary hover:text-primary active:scale-95 shadow-slate-200/20"
                                )}
                            >
                                <Heart className={cn("w-5 h-5 transition-transform group-hover:scale-110", saved && "fill-current")} />
                                {saved ? "Saved" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Infinite Video Section */}
            {productVideo && (
                <div className="w-full flex flex-col items-center py-24 lg:py-32 bg-white/40 border-y border-slate-100 mt-20">
                    <div className="container-custom mb-12 text-center">
                        <span className="text-[10px] font-semibold text-primary   mb-4 block">Product Showcase</span>
                        <h2 className="text-3xl lg:text-4xl font-display text-slate-900 ">Experience in Motion</h2>
                    </div>
                    
                    <div 
                        className={cn(
                            "w-[95%] lg:w-[85%] h-[60vh] lg:h-[75vh] rounded-[3.5rem] overflow-hidden shadow-2xl shadow-primary/5 border border-white/50 relative group transition-all duration-700",
                            "hover:shadow-3xl hover:shadow-primary/10"
                        )}
                        onMouseEnter={() => videoRef.current?.pause()}
                        onMouseLeave={() => videoRef.current?.play()}
                    >
                        <video
                            ref={videoRef}
                            src={productVideo}
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                            loop
                            muted
                            playsInline
                            autoPlay
                        />
                        
                        {/* Interactive Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-700 pointer-events-none flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white/20 backdrop-blur-xl p-8 rounded-full border border-white/30 shadow-2xl">
                                <Pause className="w-12 h-12 text-white fill-white/20" />
                            </div>
                        </div>

                        {/* Video Info Badge */}
                        <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                             <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-semibold text-white  ">Live Dynamic View</span>
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ShieldCheck({ className }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
    );
}
