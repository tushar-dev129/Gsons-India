"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export default function NewsletterSection() {
    return (
        <section className="py-24 md:py-32 bg-white relative overflow-hidden">
            {/* Architectural Background Detail */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-px bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>

            <div className="container-custom relative z-10">
                <div className="max-w-5xl mx-auto rounded-4xl p-1 md:p-1 transparent">
                    <div className="bg-slate-900 rounded-4xl p-12 md:p-16 text-center relative overflow-hidden shadow-luxe-lg">
                        {/* Decorative Glow */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                            <div className="space-y-4">
                                <span className="text-[10px]    text-primary">
                                    Strategic Updates
                                </span>
                                <h2 className="text-4xl md:text-5xl  text-white leading-none font-display ">
                                    Illuminating Your <span className="text-gradient">Inbox.</span>
                                </h2>
                                <p className="text-slate-400 text-[13px] font-medium leading-relaxed">
                                    Join our architectural circle for exclusive previews of next-gen lighting systems and curated design insights.
                                </p>
                            </div>

                            <form
                                className="relative flex flex-col sm:flex-row items-center gap-4 mt-12 group"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <div className="relative grow w-full">
                                    <input
                                        type="email"
                                        placeholder="Architectural Registry (Email)"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-500 placeholder:text-slate-500 font-medium"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-white text-slate-900 px-10 py-5 rounded-2xl  text-xs   hover:bg-primary hover:text-white transition-all duration-500 shadow-luxe group/btn active:scale-95 flex items-center justify-center gap-3"
                                >
                                    Subscribe
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </button>
                            </form>

                            <p className="text-slate-500 text-[10px]   ">
                                curated frequency • absolute privacy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
