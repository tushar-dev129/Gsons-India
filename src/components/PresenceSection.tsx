"use client";

import React from "react";
import SectionHeading from "./SectionHeading";
import { MapPin, Compass, ArrowRight } from "lucide-react";

const cities = [
    { name: "Jalandhar", type: "Region Store", description: "Strategic Lighting Hub" },
    { name: "Gurdaspur", type: "Design Studio", description: "Architectural Showcase" },
    { name: "Amritsar", type: "Flagship", description: "Premium Solutions" },
    { name: "Ludhiana", type: "Luxe Center", description: "Luxury & Innovation" },
    { name: "Pathankot", type: "Satellite", description: "Northern Reach" },
];

export default function PresenceSection() {
    return (
        <section className="py-10 bg-white relative overflow-hidden text-slate-900 leading-tight">
            {/* Minimalist Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.01] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="container-custom relative z-10">
                <SectionHeading title="Spatial Footprint" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                    {/* Headquarters - High Contrast Architectural Card */}
                    <div className="md:col-span-4 flex">
                        <div className="bg-primary rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-between group grow shadow-xl shadow-primary/20">
                            <div className="absolute -bottom-12 -right-12 w-60 h-60 bg-white/20 rounded-full blur-[70px] pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 border border-white/30 mb-4">
                                    <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>
                                    <span className="text-[7px]  text-white">Headquarters</span>
                                </div>
                                <h3 className="text-4xl mb-3  font-display text-white">Batala, Punjab</h3>
                                <p className="text-white/80 text-[13px] leading-relaxed mb-6 font-medium">
                                    Epicenter of Gsons engineering. Tradition meets futuristic architectural design.
                                </p>
                            </div>

                            <div className="relative z-10 space-y-3">
                                <div className="h-px w-full bg-white/30"></div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-xl group-hover:bg-white group-hover:text-primary transition-colors text-white">
                                        <MapPin className="w-4 h-4 stroke-current" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-semibold text-white">Design Studio</span>
                                        <span className="text-[7px]  text-white/70">Innovation Center</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modern City Grid */}
                    <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {cities.map((city, index) => (
                            <div
                                key={index}
                                className="luxe-card p-4 flex flex-col justify-between group bg-[#FAFAFA]"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                                            <Compass className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-[7px]  tracking-[0.15em] text-slate-400  group-hover:text-primary transition-colors">{city.type}</span>
                                    </div>

                                    <div>
                                        <h4 className="text-lg  text-slate-900 font-display ">{city.name}</h4>
                                        <p className="text-[9px] text-slate-400 font-semibold  ">{city.description}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                                </div>
                            </div>
                        ))}

                        {/* Future Expansion Card */}

                    </div>
                </div>
            </div>
        </section>
    );
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
}
