"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export interface CartItem {
    id: string;
    productId: string;
    variantId?: string;
    name: string;
    code?: string;
    price: number;
    image?: string;
    quantity: number;
    attributes?: Record<string, string>;
}

interface CartContextType {
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    updateQuantity: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
}

const CART_STORAGE_PREFIX = "gsons-cart";
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [activeStorageKey, setActiveStorageKey] = useState("");
    const storageKey = user?._id ? `${CART_STORAGE_PREFIX}:${user._id}` : `${CART_STORAGE_PREFIX}:guest`;

    useEffect(() => {
        setLoaded(false);
        try {
            const stored = localStorage.getItem(storageKey);
            setItems(stored ? JSON.parse(stored) : []);
        } catch {
            setItems([]);
        } finally {
            setActiveStorageKey(storageKey);
            setLoaded(true);
        }
    }, [storageKey]);

    useEffect(() => {
        if (loaded && activeStorageKey === storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(items));
        }
    }, [items, loaded, storageKey, activeStorageKey]);

    const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
        setItems((current) => {
            const existing = current.find((cartItem) => cartItem.id === item.id);
            if (existing) {
                return current.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + quantity }
                        : cartItem
                );
            }
            return [...current, { ...item, quantity }];
        });
        toast.success("Added to cart");
    };

    const updateQuantity = (id: string, quantity: number) => {
        const nextQuantity = Math.max(1, quantity);
        setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: nextQuantity } : item));
    };

    const removeItem = (id: string) => {
        setItems((current) => current.filter((item) => item.id !== id));
        toast.success("Removed from cart");
    };

    const clearCart = () => setItems([]);

    const totals = useMemo(() => {
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return { totalItems, subtotal };
    }, [items]);

    return (
        <CartContext.Provider value={{ items, ...totals, addItem, updateQuantity, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
