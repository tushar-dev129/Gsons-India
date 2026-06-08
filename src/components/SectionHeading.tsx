
interface SectionHeadingProps {
    title: string;
}

export default function SectionHeading({ title }: SectionHeadingProps) {
    return (
        <div className="flex items-center gap-4 mb-16 group">
            <div className="flex flex-col gap-1.5">
                <div className="w-12 h-px bg-slate-200 group-hover:w-20 group-hover:bg-primary transition-all duration-700"></div>
                <div className="w-8 h-px bg-slate-200 group-hover:w-12 group-hover:bg-primary/50 transition-all duration-700 delay-75"></div>
            </div>

            <div className="flex items-center gap-3">
                <h2 className="text-4xl md:text-5xl  text-slate-900  font-display ">
                    {title}
                </h2>
                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-luxe shadow-orange-500/20"></div>
            </div>
        </div>
    );
}
