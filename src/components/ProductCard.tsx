"use client";

import { Heart, Plus, Star } from "lucide-react";
import { useSaved } from "@/context/SavedContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatters";
import type { Product } from "@/types/product";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductCard({ _id, name, price, images, productId, sku, code, rating, reviews, isNew, isSale, variantId, attributes }: Product & { productId?: string, sku?: string, rating?: number, reviews?: number, isNew?: boolean, isSale?: boolean, variantId?: string, attributes?: Record<string, any> }) {
    const { toggleSave, isSaved } = useSaved();
    const { isAuthenticated } = useAuth();
    const { addItem } = useCart();
    const router = useRouter();
    const targetId = variantId || productId || _id;
    const saved = isSaved(targetId);

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }
        toggleSave(targetId);
    };

    const imageUrl = images?.[0]?.url || "/logo.png";
    const productCode = sku || code || "ARCHIVE";

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }
        addItem({
            id: targetId,
            productId: productId || _id,
            variantId,
            name,
            code: productCode,
            price: Number(price || 0),
            image: imageUrl,
            attributes: attributes ? Object.fromEntries(Object.entries(attributes).map(([key, value]) => [key, String(value)])) : undefined,
        });
    };

    return (
        <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 border border-slate-100 shadow-luxe">
            {/* Top Section: Gradient + Image */}
            <div className="relative aspect-square  bg-white/80 overflow-hidden">
                {/* Heart Button */}
                <button
                    onClick={handleSave}
                    className={cn(
                        "absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                        saved 
                            ? "bg-white text-primary shadow-md scale-110" 
                            : "bg-white/80 backdrop-blur-md text-primary hover:text-primary hover:bg-white shadow-sm hover:scale-110 border border-white"
                    )}
                >
                    <Heart className={cn("w-4 h-4", saved && "fill-primary")} />
                </button>

                {/* Floating Image */}
                <Link href={`/products/${targetId}`} className="block w-full h-full">
                    <div className="w-full h-full relative ">
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-full object-cover drop-shadow-2xl brightness-110"
                        />
                    </div>
                </Link>
            </div>

            {/* Bottom Section: Details */}
            <div className="p-4 md:p-5 flex flex-col bg-white  -mt-6 relative z-10 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)] grow">
                {/* Info Container */}
                <div className="space-y-2 grow">
                    

                    {/* Tags */}
                    <div className="flex flex-col gap-1.5">
                        <span className="px-2 py-0.5 w-fit bg-slate-50 border border-slate-100 rounded-lg text-[8px]    text-slate-500">
                            {productCode}
                        </span>
                       
                            <span className=" py-0.5 w-fit text-[10px]  text-primary flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-current" />
                                ))}
                            </span>
                       
                    </div>
                    <Link href={`/products/${targetId}`} className="block group/title">
                        <h3 className="text-sm  text-slate-900  line-clamp-1 transition-colors group-hover/title:text-primary">
                            {name}
                        </h3>
                    </Link>

                    {/* Attributes */}
                    {attributes && Object.values(attributes).length > 0 && (
                        <p className="text-slate-400 text-[11px] font-semibold   line-clamp-1">
                            {Object.values(attributes).map(val => String(val)).join(" | ")}
                        </p>
                    )}

                    {/* Description */}
                    {/* <p className="text-slate-400 text-[13px] font-medium leading-relaxed line-clamp-2">
                        Architectural precision meets high-performance. Minimalist construction with refined detailing and sleek aesthetics.
                    </p> */}
                </div>

                {/* Footer: Price */}
                <div className="flex items-end justify-between mt-3 border-t border-slate-50 pt-2">
                    <div className="space-y-0.5">
                        <p className="text-base text-slate-900  font-semibold">{formatPrice(price)}</p>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
                        title="Add to cart"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
