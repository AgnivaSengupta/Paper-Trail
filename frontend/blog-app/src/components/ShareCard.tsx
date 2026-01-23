import { forwardRef } from "react";
import { Pencil, ArrowRight } from "lucide-react";

interface ShareCardProps {
    title: string;
    description?: string;
    author?: string;
    authorImage?: string;
    publishDate?: string;
    readTime?: string;
    // category?: string;
    variant?: "landscape" | "square";
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
    (
        {
            title,
            description = "A comprehensive guide to modern web development.",
            author = "PaperTrails",
            authorImage,
            publishDate = "Jan 16, 2026",
            readTime = "5 min",
            // category = "Technical Guide",
            variant = "landscape",
        },
        ref
    ) => {
        const isLandscape = variant === "landscape";
        const width = isLandscape ? 1200 : 1080;
        const height = isLandscape ? 630 : 1080;

        return (
            <div
                ref={ref}
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                }}
                className="relative overflow-hidden rounded-lg"
            >
                {/* Warm gradient background */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            repeating-linear-gradient(to right, rgba(0, 0, 0, 0.06) 0px, rgba(0, 0, 0, 0.06) 1px, transparent 1px, transparent 30px),
                            repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.06) 0px, rgba(0, 0, 0, 0.06) 1px, transparent 1px, transparent 30px),
                            linear-gradient(to bottom right, #FDFBF7 0%, #F3E7D3 100%)
                            `
                    }}
                />

                {/* Grid Pattern */}
                {/* <div className="absolute inset-0">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern
                                id="sharecard-grid"
                                width="50"
                                height="50"
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d="M 50 0 L 0 0 0 50"
                                    fill="none"
                                    stroke="#c9b8a8"
                                    strokeWidth="0.5"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#sharecard-grid)" />
                    </svg>
                </div> */}

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col p-12">
                    {/* Header - PaperTrails Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <Pencil className="w-6 h-6 text-stone-700" strokeWidth={1.5} />
                        <span
                            className="text-stone-700 text-3xl tracking-tight font-primary"
                            // style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            PaperTrails
                        </span>
                    </div>

                    {/* Main Content */}
                    <div className={`flex-1 flex flex-col justify-center ${isLandscape ? 'max-w-4xl' : 'max-w-full'} -mt-8`}>
                        <h1
                            className={`font-primary font-semibold text-stone-900 leading-tight mb-6 ${isLandscape ? "text-7xl" : "text-5xl"
                                }`}
                            // style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
                        >
                            {title}
                        </h1>
                        <p
                            className={`font-content text-stone-600 leading-relaxed ${isLandscape ? "text-2xl" : "text-xl"
                                }`}
                            // style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            {description}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-8">
                        {/* Author Section */}
                        <div className="flex items-center gap-4">
                            <div
                                className="w-14 h-14 rounded-full bg-stone-400 flex items-center justify-center overflow-hidden"
                                style={{
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                                }}
                            >
                                {authorImage ? (
                                    <img src={authorImage} alt={author} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white font-primary font-bold text-xl">
                                        {author.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p
                                    className="text-stone-800 font-primary text-2xl"
                                    // style={{ fontFamily: "'Inter', sans-serif" }}
                                >
                                    {author}
                                </p>
                                <p
                                    className="text-stone-500 text-sm"
                                    style={{ fontFamily: "'Inter', sans-serif" }}
                                >
                                    {publishDate}
                                </p>
                            </div>
                        </div>

                        {/* Right Section - Read Time & Category */}
                        <div className="flex items-center gap-4">
                            {/* Read Time Badge */}
                            <div
                                className="px-4 py-2 rounded-md flex items-center bg-white/60 backdrop-blur-sm border border-stone-300/50"
                                // style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                <span className="text-stone-600 text-base font-medium">
                                    {readTime}
                                </span>
                                <span className="text-stone-400 text-sm ml-1">read</span>
                            </div>

                            {/* Category Badge */}
                            {/* <div
                                className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-stone-300/50"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                <span className="text-stone-700 text-sm font-medium">
                                    {category}
                                </span>
                                <ArrowRight className="w-4 h-4 text-stone-500" />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

ShareCard.displayName = "ShareCard";

export default ShareCard;
