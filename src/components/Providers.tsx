"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { SavedProvider } from "@/context/SavedContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                refetchOnWindowFocus: false,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <SavedProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                    <Toaster position="top-right" reverseOrder={false} />
                </SavedProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
