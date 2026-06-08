"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

export default function Footer() {
    const { categories } = useCategories();
    
    // Use the first 5 dynamic categories, fallback to static defaults if loading
    const displayCategories = categories && categories.length > 0 
        ? categories.slice(0, 5) 
        : [
            { _id: "1", name: "Spotlights" },
            { _id: "2", name: "Pendant Lights" },
            { _id: "3", name: "Wall Fixtures" },
            { _id: "4", name: "Outdoor Series" },
            { _id: "5", name: "New Arrivals" }
          ];
    return (
        <footer className="bg-[#f8fafc] pt-24 pb-12 border-t border-slate-100">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-2">
                        <Link href="/" className="inline-block transition-transform active:scale-95">
                            <Image
                                src="/logo.png"
                                alt="Gsons Logo"
                                width={120}
                                height={40}
                                className="h-17 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                            Premium architectural lighting solutions engineered for excellence.
                            Defining spaces with light and innovation since 1995.
                        </p>
                        <div className="flex pt-2 gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                                <Link key={idx} href="#" className="w-9 h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all duration-300 shadow-sm">
                                    <Icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-8">
                        <h4 className="text-xs    text-slate-900 border-l-2 border-primary pl-4">Collection</h4>
                        <ul className="space-y-4">
                            {displayCategories.map((cat) => (
                                <li key={cat._id}>
                                    <Link href={cat._id.length > 5 ? `/products?category=${cat._id}` : "/products"} className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-8">
                        <h4 className="text-xs    text-slate-900 border-l-2 border-primary pl-4">Enterprise</h4>
                        <ul className="space-y-4">
                            {["Our Story", "Catalogues", "Project Gallery", "Sustainability", "Contact"].map((item) => (
                                <li key={item}>
                                    <Link href={item === "Our Story" ? "/about" : "/contact"} className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter & Contact */}
                    <div className="space-y-8">
                        <h4 className="text-xs    text-slate-900 border-l-2 border-primary pl-4">Newsletter</h4>
                        <div className="space-y-6">
                            <p className="text-sm font-medium text-slate-400 leading-relaxed">
                                Subscribe to receive professional updates and exclusive exhibition invites.
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="bg-white border-slate-100 border rounded-xl py-3 px-4 text-xs w-full text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                                <button className="bg-primary text-white p-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95">
                                    <Mail className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-[11px] font-semibold text-slate-400  ">
                        &copy; {new Date().getFullYear()} Gsons India. Mastercrafted in Delhi.
                    </div>
                    <div className="flex gap-8 text-[11px]  text-slate-400  ">
                        <Link href="#" className="hover:text-slate-900 transition-colors">Privacy Privacy</Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
