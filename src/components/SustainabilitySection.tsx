
import Link from "next/link";
import * as productsData from "../data/products";
import { Leaf, ShieldCheck, Zap } from "lucide-react";

export default function SustainabilitySection() {
    return (
        <section className="py-24 md:py-32 bg-[#FAF9F6]">
            <div className="container-custom">
                <div className="grid md:grid-cols-2 gap-20 items-center">
                    {/* Visual Composition */}
                    <div className="relative aspect-4/5 group">
                        <div className="absolute inset-0 bg-slate-200 rounded-4xl translate-x-3 translate-y-3 transition-transform group-hover:translate-x-0 group-hover:translate-y-0 duration-700"></div>
                        <div className="relative h-full w-full rounded-4xl overflow-hidden shadow-luxe-lg">
                            <img
                                src={productsData.wall[0]}
                                alt="Sustainable Architectural Lighting"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent"></div>

                            {/* Impact Badge */}
                            <div className="absolute bottom-10 left-10 right-10 p-8 glass-effect rounded-3xl border-white/30">
                                <p className="text-black/90  text-xl font-semibold mb-1  ">Carbon Conscious</p>
                                <p className="text-black/70 text-[10px]   ">100% Recyclable Frameworks</p>
                            </div>
                        </div>
                    </div>

                    {/* Narrative Content */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <span className="text-[10px]    text-primary">
                                Our Architectural Ethos
                            </span>
                            <h2 className="text-4xl md:text-5xl  text-slate-900 leading-none font-display ">
                                Harmony In <br />
                                <span className="text-gradient">Luminescence.</span>
                            </h2>
                            <p className="text-[13px] text-slate-500 leading-relaxed font-medium max-w-lg">
                                We engineer light with a responsibility to the environment. Our commitment extends beyond design—into the very soul of the materials we use.
                            </p>
                        </div>

                        <div className="grid gap-8">
                            {[
                                { icon: Leaf, title: "Pure Origin", desc: "Ethically extracted premium metals" },
                                { icon: ShieldCheck, title: "Zero Waste", desc: "Minimized architectural packaging" },
                                { icon: Zap, title: "Luxe Efficiency", desc: "Next-gen low energy components" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-luxe transition-colors group-hover:border-primary/30">
                                        <item.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm  text-slate-900  ">{item.title}</h4>
                                        <p className="text-xs text-slate-400 font-semibold">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center px-12 py-5 bg-slate-900 text-white text-xs    rounded-2xl hover:bg-primary transition-all shadow-luxe-lg hover:-translate-y-1 active:scale-95"
                        >
                            Explore Our Story
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
