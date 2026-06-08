"use client";

import React from "react";
import { ShieldCheck, Zap, Globe, Cpu } from "lucide-react";

const features = [
    {
        icon: <Cpu className="w-6 h-6" />,
        title: "Intelligent Core",
        desc: "Integrated thermal-management technology ensures consistent luminosity and architectural longevity.",
        accent: "bg-primary/10 text-primary"
    },
    {
        icon: <ShieldCheck className="w-6 h-6" />,
        title: "Build Integrity",
        desc: "Constructed from aeronautical-grade aluminum and high-purity optical glass for extreme durability.",
        accent: "bg-primary/10 text-primary"
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "High-Efficiency",
        desc: "Class-leading energy conversion ratios that minimize environmental impact without compromising output.",
        accent: "bg-primary/10 text-primary"
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: "Global Standards",
        desc: "Every component is verified against international architectural safety and performance protocols.",
        accent: "bg-primary/10 text-primary"
    }
];

export default function FeaturesSection() {
    return (
        <section className="py-10 bg-white">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {features.map((feature, i) => (
                        <div key={i} className="group space-y-8 p-4 transition-all duration-500 hover:-translate-y-2">
                            <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:shadow-luxe ${feature.accent}`}>
                                {feature.icon}
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-base  text-slate-900 font-display  ">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-400 text-[13px]    leading-loose">
                                    {feature.desc}
                                </p>
                            </div>
                            <div className="h-px w-8 bg-slate-100 group-hover:w-full group-hover:bg-primary transition-all duration-700"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
