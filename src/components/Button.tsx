"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
    size?: "sm" | "md" | "lg" | "xl";
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    className,
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed rounded-xl";

    const variants = {
        primary: "bg-primary text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-500/30",
        secondary: "bg-gray-900 text-white shadow-lg shadow-gray-900/20 hover:bg-black hover:shadow-black/30",
        outline: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm",
        danger: "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 hover:shadow-red-500/30",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
        xl: "px-10 py-5 text-lg",
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && "w-full",
                className
            )}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <>
                    {leftIcon && <span className="mr-2">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="ml-2">{rightIcon}</span>}
                </>
            )}
        </button>
    );
};

export default Button;
