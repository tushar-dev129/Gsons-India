"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Lightbulb, Eye, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

export default function AboutPage() {
    const milestones = [
        {
            icon: <Lightbulb className="w-6 h-6" />,
            title: "Established 2021",
            desc: "Founded with a singular vision to elevate architectural lighting standards in the heart of Punjab."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "The Vision",
            desc: "Treating light not as a utility, but as a transformative architectural medium."
        },
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            title: "Luxe Integrity",
            desc: "Every piece undergoes rigorous architectural vetting for material purity and performance."
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Concierge Care",
            desc: "Providing a bespoke consultation experience for discerning homeowners and designers."
        },
    ];

    return (
        <div className="bg-[#FAF9F6] min-h-screen">
            {/* Immersive Vision Header */}
            {/* <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-slate-900">
                    <img
                        src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop"
                        alt="Architectural Studio"
                        className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-slate-950/20 via-slate-950/60 to-slate-950/90"></div>
                </div>

                <div className="container-custom relative z-10 text-center space-y-8">
                    <span className="inline-block px-6 py-2 bg-primary/20 backdrop-blur-md text-primary border border-primary/30 rounded-full text-[10px]    shadow-luxe">
                        Our Architectural Narrative
                    </span>
                    <h1 className="text-6xl md:text-8xl  text-white leading-tight font-display ">
                        Illuminating <br />
                        <span className="text-primary italic">Atmospheres</span>
                    </h1>
                    <div className="flex items-center justify-center gap-6 pt-8">
                        <div className="h-px w-16 bg-white/20"></div>
                        <p className="text-white/60  text-[10px]  ">Curating Excellence Since 2021</p>
                        <div className="h-px w-16 bg-white/20"></div>
                    </div>
                </div>
            </section> */}

            {/* The Philosophy Section - Editorial Layout */}
            <section className="py-32 overflow-hidden">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="relative group">
                            <div className="relative rounded-4xl overflow-hidden shadow-luxe-lg aspect-4/5">
                                <img
                                    src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2070&auto=format&fit=crop"
                                    alt="Gsons Philosophy"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent"></div>
                                <div className="absolute bottom-12 left-12 right-12">
                                    <p className="text-white text-xl font-medium leading-relaxed italic">
                                        "Light is the first of architectural materials; it defines the space we inhabit."
                                    </p>
                                </div>
                            </div>
                            <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary rounded-4xl -z-10 opacity-10 animate-pulse"></div>
                        </div>

                        <div className="space-y-12">
                            <div className="space-y-6">
                                <span className="text-primary  text-[10px]  ">The Gsons Studio</span>
                                <h2 className="text-5xl  text-slate-900 font-display  leading-none">
                                    Crafting Light with <br />Architectural Precision.
                                </h2>
                            </div>

                            <div className="space-y-8 text-slate-500 text-lg leading-relaxed font-medium">
                                <p>
                                    Founded in 2021 by visionaries Rakesh and Sumit Goel, Gsons emerged from a desire to bridge the gap between functional lighting and architectural art.
                                </p>
                                <p>
                                    Based in Batala, we have spent the last three years curating a collection that doesn't just illuminate rooms—it elevates lives. Every piece in our dossier is selected for its material integrity, technical precision, and aesthetic purity.
                                </p>
                                <div className="pt-8 grid grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-3xl  text-slate-900 font-display">3+</h4>
                                        <p className="text-[10px]    text-slate-400">Years of Mastery</p>
                                    </div>
                                    <div>
                                        <h4 className="text-3xl  text-slate-900 font-display">500+</h4>
                                        <p className="text-[10px]    text-slate-400">Projects Illuminated</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Dossier */}
            <section className="py-32 bg-white">
                <div className="container-custom">
                    <div className="flex flex-col items-center text-center mb-24 space-y-6">
                        <SectionHeading title="Leadership Dossier" />
                        <p className="text-slate-500 max-w-xl font-medium">
                            The visionaries behind the Gsons architectural lighting movement.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
                        {[
                            { name: "Sumit Goel", role: "Chief Executive Officer", image: "/images/sumit-goel.jpg", bio: "Leading with a commitment to innovation and architectural purity in every design." },
                            { name: "Rakesh Goel", role: "Founding Principal", image: "/images/rakesh-goel.jpg", bio: "The strategic force behind the Gsons legacy, ensuring excellence across every project." }
                        ].map((leader, i) => (
                            <div key={i} className="group space-y-8">
                                <div className="relative aspect-square rounded-4xl overflow-hidden shadow-luxe transition-all duration-700 group-hover:shadow-luxe-lg group-hover:-translate-y-2 bg-[#FAF9F6] p-4 border border-slate-50">
                                    <div className="w-full h-full rounded-[2.5rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                                        <img
                                            src={leader.image}
                                            alt={leader.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-12">
                                        <p className="text-white/80 text-sm font-medium italic">"Excellence is not an act, but a habit of architectural precision."</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl  text-slate-900 font-display  ">{leader.name}</h3>
                                    <span className="text-[10px]  text-primary   block">{leader.role}</span>
                                    <p className="text-slate-500 font-medium leading-relaxed max-w-md pt-4">{leader.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values Matrix */}
            <section className="py-32 bg-[#FAF9F6]">
                <div className="container-custom">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {milestones.map((m, i) => (
                            <div key={i} className="bg-white p-10 rounded-4xl border border-slate-50 shadow-luxe hover:shadow-luxe-lg hover:-translate-y-2 transition-all group">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                                    {m.icon}
                                </div>
                                <h3 className="text-xl  mb-4 text-slate-900 font-display  ">{m.title}</h3>
                                <p className="text-slate-400 text-xs leading-relaxed font-semibold  ">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Bridge */}
            <section className="py-40 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                        alt=""
                        className="w-full h-full object-cover grayscale"
                    />
                </div>
                <div className="container-custom relative z-10">
                    <div className="max-w-3xl space-y-12">
                        <h2 className="text-5xl md:text-7xl  text-white font-display  leading-none">
                            The Journey to <br />
                            <span className="text-primary italic">Light Continues.</span>
                        </h2>
                        <p className="text-white/40 text-xl font-medium leading-relaxed">
                            Whether you are reimagining a private residence or curating a commercial environment, our architectural advisors are ready to assist.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 pt-8">
                            <Link href="/products" className="group bg-primary text-white px-12 py-6 rounded-2xl  text-xs   hover:bg-white hover:text-slate-900 transition-all shadow-luxe flex items-center justify-center gap-4">
                                Explore Collection
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                            </Link>
                            <Link href="/contact" className="bg-white/10 text-white px-12 py-6 rounded-2xl  text-xs   border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center">
                                Initialize Inquiry
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
