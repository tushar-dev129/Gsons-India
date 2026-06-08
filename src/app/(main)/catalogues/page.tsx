"use client";

import React, { useEffect } from 'react';
import SectionHeading from "@/components/SectionHeading";
import { FileText, Download, ExternalLink, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

export default function CataloguesPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const light = 'https://res.cloudinary.com/djnjmmgu8/image/upload/v1712740209/pdfs/RATAIL_ALL_ITEMS_LIST_yvtrtg.pdf';
    const switches = 'https://res.cloudinary.com/djnjmmgu8/image/upload/v1712739498/pdfs/GSONS_SWITCHES_ogrms7.pdf';
    const wire = 'https://res.cloudinary.com/djnjmmgu8/image/upload/v1713946774/pdfs/NO_PRICE_WIRE_ljn4se.pdf';
    const concield = 'https://res.cloudinary.com/djnjmmgu8/image/upload/v1714043155/pdfs/GSONS_CONCIELD_LIGHTS_compressed_1_tymgbi.pdf';
    const gate = 'https://res.cloudinary.com/djnjmmgu8/image/upload/v1714043426/pdfs/GATE_NO_PRICE_yfl0z7.pdf';

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, loading, router]);

    const openPdf = (pdf: string) => {
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }
        window.open(pdf, '_blank');
    };

    const catalogs = [
        { title: 'Wires & Conductors', pdf: wire, img: 'https://images.unsplash.com/photo-1558002038-103792e17701?q=80&w=2070&auto=format&fit=crop', category: 'Infrastructure' },
        { title: 'Architectural Switches', pdf: switches, img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop', category: 'Control Systems' },
        { title: 'Illumination Collection', pdf: light, img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2070&auto=format&fit=crop', category: 'Main Gallery' },
        { title: 'Concealed Systems', pdf: concield, img: 'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?q=80&w=2071&auto=format&fit=crop', category: 'Integration' },
        { title: 'Gate & Exterior', pdf: gate, img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop', category: 'Outdoor' },
    ];

    if (loading) {
        return <Loader fullPage text="Checking access..." />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-48">
            <div className="container-custom">
                <div className="mb-24">
                    <SectionHeading title="Digital Dossiers" />
                    <p className="text-slate-500 max-w-xl font-medium mt-8">
                        Technical specifications and architectural collections available for professional download.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {catalogs.map((cat, index) => (
                        <div
                            key={index}
                            onClick={() => openPdf(cat.pdf)}
                            className="group relative h-[450px] rounded-4xl overflow-hidden cursor-pointer shadow-luxe transition-all duration-700 hover:shadow-luxe-lg hover:-translate-y-2 border border-slate-50"
                        >
                            {/* Background Visual */}
                            <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-1000">
                                <img
                                    src={cat.img}
                                    alt={cat.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                            </div>

                            {/* Floating Metadata */}
                            <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[9px]    text-white border border-white/20">
                                    {cat.category}
                                </span>
                                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-luxe transition-transform group-hover:rotate-12">
                                    <FileText className="w-5 h-5" />
                                </div>
                            </div>

                            {/* Narrative content */}
                            <div className="absolute bottom-0 left-0 right-0 p-12 space-y-4">
                                <h3 className="text-3xl  text-white font-display   leading-none">
                                    {cat.title}
                                </h3>
                                <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                                    <span className="flex items-center gap-3 text-[10px]    text-primary group-hover:text-white transition-colors">
                                        Access <Download className="w-4 h-4" />
                                    </span>
                                    <span className="w-2 h-2 rounded-full bg-white/20"></span>
                                    <span className="text-[10px]    text-white/40 group-hover:text-white/60 transition-all">
                                        PDF format
                                    </span>
                                </div>
                            </div>

                            {/* Hover Overlay Bridge */}
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-luxe-lg transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                                    <ExternalLink className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Technical Assistance Bridge */}
                <div className="mt-32 p-16 bg-slate-900 rounded-4xl border border-slate-800 shadow-luxe overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
                        <FileText className="w-96 h-96 -translate-y-12 translate-x-12" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-6">
                            <h2 className="text-4xl  text-white font-display  ">Custom Specifications?</h2>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                Our engineering team can provide bespoke technical dossiers for unique architectural requirements and large-scale integrations.
                            </p>
                        </div>
                        <div className="flex justify-start lg:justify-end">
                            <button className="bg-primary text-white px-12 py-6 rounded-2xl  text-xs   hover:bg-white hover:text-slate-900 transition-all flex items-center gap-4 group/btn">
                                Initialize Request
                                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
