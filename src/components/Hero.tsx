import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative bg-[#FAFAFA] min-h-[70vh] flex items-center overflow-hidden py-16 lg:py-0">
            {/* Soft decorative shapes */}
            <div className="absolute top-0 right-0 w-[40%] h-full bg-[#FEF4EB] rounded-l-[10rem] hidden lg:block" />

            <div className="container-custom relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text Content */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
                        <div className="space-y-4">
                            <p className="text-primary font-semibold   text-[11px]">Professional Series 2024</p>
                            <h1 className="text-4xl md:text-5xl  text-slate-800 leading-[1.1] ">
                                Unique & <br />
                                <span className="text-slate-900">Stylish Lighting</span>
                            </h1>
                            <p className="text-slate-500 max-w-lg text-[13px] leading-relaxed font-medium">
                                Assertively elevate your architectural spaces with our mastercrafted lighting solutions.
                                Designed for those who demand both performance and aesthetic excellence.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold   text-white bg-primary rounded-xl shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-1 active:scale-95"
                            >
                                Shop Now
                                <ArrowRight className="w-3.5 h-3.5 ml-3" />
                            </Link>
                        </div>
                    </div>

                    {/* Right: Focused Visual Content */}
                    <div className="relative animate-in fade-in slide-in-from-right duration-700">
                        <div className="relative group">
                            {/* Main Product Image - High End Furniture/Light look */}
                            <div className="relative aspect-4/5 md:aspect-4/3 rounded-4xl overflow-hidden shadow-2xl group w-full max-w-sm md:max-w-none mx-auto">
                                <img
                                    src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2574&auto=format&fit=crop"
                                    alt="Premium Lighting Fixture"
                                    className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-1000 group-hover:scale-105"
                                />
                            </div>

                            {/* Decorative elements to match reference image */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 hidden md:block">
                                <img
                                    src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2667&auto=format&fit=crop"
                                    className="w-full h-full object-cover rounded-3xl shadow-lg border-4 border-white"
                                    alt="Detail view"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

