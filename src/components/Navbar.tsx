"use client"

import { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, User, Menu, LogOut, X, Phone, Mail, MapPin, Heart, ShoppingBag, Info, BookOpen, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSaved } from "../context/SavedContext";
import { useCart } from "@/context/CartContext";
import { cn } from "@/utils/cn";

function NavbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("keyword") || "");
  const { user, isAuthenticated, logout } = useAuth();
  const { savedProducts, savedVariants } = useSaved();
  const { totalItems } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Sync with URL changes
  useEffect(() => {
    const keyword = searchParams.get("keyword");
    setSearchQuery(keyword || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/products?keyword=${encodeURIComponent(searchQuery)}`);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    // { name: "Home", href: "/", icon: Home },
    { name: "Our Story", href: "/about", icon: Info },
    // { name: "Collection", href: "/products", icon: ShoppingBag },
    { name: "Catalogues", href: "/catalogues", icon: BookOpen },
    { name: "Cart", href: "/cart", icon: ShoppingBag },
  ];

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300",
        isScrolled ? "shadow-md" : ""
      )}>
        {/* Tier 1: Top Bar */}
        <div className="bg-[#f8fafc]  py-2.5 hidden lg:block">
          <div className="container-custom flex justify-between items-center text-[11px] font-medium text-slate-500  ">
            <div className="flex items-center gap-6">
              <a href="mailto:info@gsons.in" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-3 h-3" />
                Indiagsons@gmail.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                Punjab, India
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                +91 98779-17738
              </div>
              <div className="h-3 w-px bg-slate-200" />
              <span>Free Delivery on Orders Over ₹5000</span>
            </div>
          </div>
        </div>

        {/* Tier 2: Main Bar */}
        <div className="py-3">
          <div className="container-custom flex flex-wrap sm:flex-nowrap items-center justify-between gap-y-3 gap-x-2 sm:gap-x-8">
            {/* Logo */}
            <Link href="/" className="shrink-0 transition-transform active:scale-95">
              <Image
                src="/logo.png"
                alt="Gsons Logo"
                width={130}
                height={40}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>

            {/* Large Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex w-full sm:w-auto sm:flex-1 relative order-last sm:order-0"
            >
              <input
                name="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full text-slate-900 bg-slate-50 border-none rounded-xl py-2.5 pl-5 pr-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl text-slate-500 hover:text-primary hover:bg-slate-50 transition-all group relative"
                >
                  <div className="relative">
                    <link.icon className="w-5 h-5 transition-transform text-primary/80 group-hover:scale-110" />
                    {link.name === "Saved" && (savedProducts.length + savedVariants.length) > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] text-white ring-1 ring-white">
                        { savedVariants.length}
                      </span>
                    )}
                    {link.name === "Cart" && totalItems > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] text-white ring-1 ring-white">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  {/* <span className="text-[10px]   ">{link.name}</span> */}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-1  lg:gap-6">
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 p-1 rounded-full pr-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <User className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-[10px]   text-slate-400 leading-none mb-1">Welcome</p>
                      <p className="text-sm font-semibold text-slate-900 leading-none group-hover:text-primary transition-colors">{user?.name?.split(' ')[0]}</p>
                    </div>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-5 py-3 border-b border-slate-50">
                        <p className="text-[10px]   text-slate-400 mb-0.5">Account</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.email}</p>
                      </div>
                      <Link href="/cart" onClick={() => setIsDropdownOpen(false)} className="flex items-center justify-between px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">
                        <span className="flex items-center">
                          <ShoppingBag className="w-4 h-4 mr-3 opacity-60" />
                          Cart
                        </span>
                        {totalItems > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] text-white">
                            {totalItems}
                          </span>
                        )}
                      </Link>
                      <Link href="/saved" onClick={() => setIsDropdownOpen(false)} className="flex items-center justify-between px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-3 opacity-60" />
                          Saved
                        </span>
                        {(savedProducts.length + savedVariants.length) > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] text-white">
                            {savedProducts.length + savedVariants.length}
                          </span>
                        )}
                      </Link>
                      <Link href="/queries" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">
                        <MessageSquare className="w-4 h-4 mr-3 opacity-60" />
                        Queries
                      </Link>
                      <Link href="/contact" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">
                        <Phone className="w-4 h-4 mr-3 opacity-60" />
                        Contact
                      </Link>
                      {user?.role === "admin" && (
                        <Link href="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">
                          <User className="w-4 h-4 mr-3 opacity-60" />
                          Admin Panel
                        </Link>
                      )}
                      <button onClick={logout} className="flex items-center w-full px-5 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4 mr-3 opacity-60" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-colors group">
                  <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-[10px]   text-slate-400 leading-none mb-1">Join Gsons</p>
                    <p className="text-sm font-semibold text-slate-900 leading-none group-hover:text-primary transition-colors">Sign In</p>
                  </div>
                </Link>
              )}


              <button className="relative p-2 text-slate-600 hover:text-primary transition-colors hover:bg-slate-50 rounded-full lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* Spacer to push content below fixed header */}
      <div className="h-[120px] sm:h-[74px] lg:h-[115px] bg-white" />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-100 bg-white p-8 animate-in slide-in-from-right duration-500 overflow-y-auto">
          <div className="flex justify-between items-center mb-12">
            <Image src="/logo.png" alt="Logo" width={100} height={30} className="h-12 w-auto object-contain" />
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <X className="w-5 h-5 text-slate-900" />
            </button>
          </div>

          <div className="flex flex-col gap-8 mb-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-3xl  text-slate-900  flex items-center gap-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
                {link.name === "Saved" && (savedProducts.length + savedVariants.length) > 0 && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {savedVariants.length}
                  </span>
                )}
                {link.name === "Cart" && totalItems > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col gap-6">
            <div className="flex items-center gap-4 text-slate-500">
              <Phone className="w-5 h-5" />
              <span className="font-semibold">+91 98779-17738</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <Mail className="w-5 h-5" />
              <span className="font-semibold  text-xs">Indiagsons@gmail.com</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-[120px] sm:h-[74px] lg:h-[115px] bg-white" />}>
      <NavbarContent />
    </Suspense>
  );
}
