"use client";

import React from "react";
import SectionHeading from "./SectionHeading";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        id: 1,
        name: "Rajesh Kumar",
        role: "Lead Architect",
        content: "The precision engineering of Gsons fixtures reflects an architectural maturity rarely seen. Their lighting doesn't just fill a room; it defines the very geometry of the space.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=rajesh",
    },
    {
        id: 2,
        name: "Sneha Sharma",
        role: "Interior Designer",
        content: "As a designer, I crave the intersection of form and performance. Gsons consistently delivers fixtures that are aesthetic masterpieces while maintaining superior energy metrics.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=sneha",
    },
    {
        id: 3,
        name: "Amit Patel",
        role: "Design Enthusiast",
        content: "The transformation of our estate through Gsons smart lighting has been remarkable. The interplay of light and shadow is now a dynamic part of our home's identity.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=amit",
    },
];

export default function TestimonialsSection() {
    return (
        <section className="relative py-15 md:py-15 overflow-hidden bg-slate-950">
            {/* 1. Blurred Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/testimonials-bg.png"
                    alt="Background"
                    className="w-full h-full object-cover blur-sm opacity-60 scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-950/20 to-slate-950" />
            </div>

            {/* 2. Smoke/Cloud Effects */}
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[120px] animate-smoke" />
                <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-orange-600/10 rounded-full blur-[100px] animate-smoke-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-slate-800/20 rounded-full blur-[150px] animate-smoke" />
            </div>

            <div className="container-custom relative z-20">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-[10px]    text-white/70">Voices of Vision</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl  text-white  mb-6 font-display">
                        Architectural <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-400">Praise.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="group relative p-10 rounded-4xl bg-white/5 border border-white/10 backdrop-blur-2xl transition-all duration-700 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2 overflow-hidden"
                        >
                            {/* Card Glow */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="mb-8 relative flex  items-center justify-between">
                                <Quote className="w-10 h-10 text-primary opacity-40 rotate-180" />
                                <div className="flex gap-1 relative z-10">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 ${i < testimonial.rating ? "fill-primary text-primary" : "text-white/10"}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="text-white/80 font-medium italic mb-10 grow leading-relaxed text-[13px]  relative z-10">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center gap-5 pt-8 border-t border-white/10 relative z-10">
                                <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 group-hover:border-primary transition-colors duration-500 shadow-2xl">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h4 className=" text-white text-sm font-display  ">{testimonial.name}</h4>
                                    <p className="text-[10px]  text-primary   leading-none opacity-80">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
