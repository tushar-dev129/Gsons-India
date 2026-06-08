"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Users,
    FileText,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Grid,
    User as UserIcon,
    Settings,
    ChevronUp,
    Images,
    UploadCloud,
    Inbox
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Grid },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Inquiries", href: "/admin/inquiries", icon: Inbox },
    { name: "Posts", href: "/admin/posts", icon: FileText },
    { name: "Gallery", href: "/admin/gallery", icon: Images },
    { name: "Bulk Import", href: "/admin/products/bulk", icon: UploadCloud },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Persist sidebar state
    useEffect(() => {
        const saved = localStorage.getItem("admin-sidebar-collapsed");
        if (saved !== null) setIsCollapsed(JSON.parse(saved));
    }, []);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem("admin-sidebar-collapsed", JSON.stringify(newState));
    };

    // Close user menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/auth/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <aside 
            className={cn(
                "bg-white w-[100px] md:w-[25%] border-r border-gray-200 flex flex-col h-[133.33dvh] sticky top-0 transition-all duration-300 ease-in-out z-40",
                isCollapsed ? "w-fit max-w-[100px]" : "max-w-[270px] w-[25%]"
            )}
        >
            {/* Collapse Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-10 bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50 text-gray-500 hover:text-primary transition-colors shadow-sm z-50"
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Logo Section */}
            <div className={cn(" flex items-center transition-all duration-300 pt-6 ", isCollapsed ? "justify-center px-4" : "justify-start px-6  ")}>
                <Link href="/admin" className="flex items-center gap-3 group relative overflow-hidden">
                    <div className={cn("flex h-fit w-fit justify-center transition-all duration-300")}>
                        <Image
                            src="/logo.png"
                            alt="Gsons"
                            width={150}
                            height={150}
                            className={cn(" object-contain transition-all  duration-500", isCollapsed ? " w-75 h-fit rotate-0" : "h-fit w-27 ")}
                            priority
                        />
                    </div>
                    {/* {!isCollapsed && (
                        <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
                             <span className="text-[10px] font-semibold text-primary   mt-1">LUMINARIES</span>
                        </div>
                    )} */}
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-3 space-y-1 mt-4">
                {menuItems.map((item) => {
                    const activeItem = [...menuItems]
                        .sort((a, b) => b.href.length - a.href.length)
                        .find(m =>
                            m.href === "/admin"
                                ? pathname === "/admin"
                                : pathname === m.href || pathname.startsWith(m.href + "/")
                        );

                    const isActive = item.href === activeItem?.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.name : ""}
                            className={cn(
                                "flex items-center rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-3",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-orange-500/20"
                                    : "text-gray-600 hover:bg-orange-50 hover:text-primary"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-gray-500 group-hover:text-primary")} />
                            {!isCollapsed && (
                                <span className="font-semibold whitespace-nowrap transition-opacity duration-300">
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User Profile Section */}
            <div className="p-4 border-t border-gray-100 relative" ref={userMenuRef}>
                {/* User Menu Popover */}
                {isUserMenuOpen && (
                    <div className={cn(
                        "absolute left-4 right-4 bottom-full mb-2 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50",
                        isCollapsed && "w-[200px] left-0"
                    )}>
                     
                        
                        <Link 
                            href="/admin/profile" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary rounded-xl transition-colors group"
                        >
                            <UserIcon className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                            <span>Edit Profile</span>
                        </Link>
                        
                        <Link 
                            href="/" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-primary rounded-xl transition-colors group"
                        >
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                            <span>Exit Admin</span>
                        </Link>
                        
                        <button
                            onClick={() => {
                                setIsUserMenuOpen(false);
                                handleLogout();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
                        >
                            <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                            <span>Logout</span>
                        </button>
                    </div>
                )}

                {/* User Trigger Button */}
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={cn(
                        "w-full flex items-center transition-all duration-200 rounded-xl hover:bg-gray-50 group",
                        isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-3",
                        isUserMenuOpen ? "bg-gray-50 ring-1 ring-orange-100" : ""
                    )}
                >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                        {user?.name?.[0]?.toUpperCase() || "A"}
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "Admin"}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email || "gsons@admin.com"}</p>
                        </div>
                    )}
                    {!isCollapsed && (
                        <ChevronUp className={cn(
                            "w-4 h-4 text-gray-400 transition-transform duration-200",
                            isUserMenuOpen ? "rotate-0" : "rotate-180"
                        )} />
                    )}
                </button>
            </div>
        </aside>
    );
}
