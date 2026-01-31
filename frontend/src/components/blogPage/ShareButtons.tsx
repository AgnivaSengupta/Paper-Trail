import { Check, Download, Facebook, ImageIcon, Link2, Linkedin, Loader2, Mail, Share2, Twitter } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { toPng } from "html-to-image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import ShareCard from "../ShareCard";

interface ShareButtonsProps {
    title: string;
    description?: string;
    url?: string;
    author?: string;
    authorImage?: string;
    publishDate?: string;
    readTime?: string;
    category?: string;
}

const ShareButtons = ({
    title,
    description = "",
    url,
    author,
    authorImage = "",
    publishDate = "2025",
    readTime = "5 min read",
    category = "development",
}: ShareButtonsProps) => {
    const [copied, setCopied] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [cardVariant, setCardVariant] = useState<"landscape" | "square">("landscape");
    const cardRef = useRef<HTMLDivElement>(null)

    const shareUrl = url || window.location.href;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    const socialPlatforms = [
        {
            name: "Twitter",
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: "hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30",
            bgGradient: "from-[#1DA1F2]/5 to-[#1DA1F2]/10",
        },
        {
            name: "Facebook",
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: "hover:bg-[#4267B2]/10 hover:text-[#4267B2] hover:border-[#4267B2]/30",
            bgGradient: "from-[#4267B2]/5 to-[#4267B2]/10",
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30",
            bgGradient: "from-[#0A66C2]/5 to-[#0A66C2]/10",
        },
        {
            name: "Email",
            icon: Mail,
            url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
            color: "hover:bg-accent hover:text-accent-foreground hover:border-accent",
            bgGradient: "from-muted/50 to-muted",
        },
    ]

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);

            toast.success("Link copied successfully");
        } catch (error) {
            toast.error("Failed to copy link");
        }
    };

    const handleShare = (platform: typeof socialPlatforms[0]) => {
        if (platform.name == 'Email') {
            window.location.href = platform.url;
        } else {
            window.open(platform.url, "_blank", "width=600,height=400,noopener,noreferrer")
        }
    }

    const handleDownloadCard = async () => {
        if (!cardRef.current) return;

        setIsGenerating(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                quality: 1,
                pixelRatio: 2,
                cacheBust: true,
            })

            const link = document.createElement('a');
            link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-share-card.png`;
            link.href = dataUrl;
            link.click()

            toast.success("Share card downloaded!");
        } catch (error) {
            console.error("Failed to generate image:", error);
            toast.error("Failed to generate share card");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleNativeShare = async () => {
        if (!cardRef.current) return;

        if (!navigator.share) {
            toast.error("Native sharing not supported on this device");
            return;
        }

        setIsGenerating(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                quality: 1,
                pixelRatio: 2,
                cacheBust: true,
            });

            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], `${title.toLowerCase().replace(/\s+/g, "-")}.png`, {
                type: "image/png",
            });

            await navigator.share({
                title,
                text: description,
                files: [file],
            });
        } catch (err) {
            if ((err as Error).name !== "AbortError") {
                console.error("Failed to share:", err);
                toast.error("Failed to share");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="py-8 border-t border-b border-border my-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="text-lg font-medium font-primary text-red-700">
                    Share this article
                </span>

                <div className="flex flex-wrap gap-2">
                    <TooltipProvider>
                        {socialPlatforms.map((platform) => (
                            <Tooltip key={platform.name}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleShare(platform)}
                                        className={`
                                            relative overflow-hidden transition-all duration-300
                                            border-border/50 bg-background cursor-pointer
                                            ${platform.color}
                                            group
                                            `}  
                                        >
                                        <div className={`
                                            absolute inset-0 bg-gradient-to-br ${platform.bgGradient} 
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                        `}/>
                                            
                                        <platform.icon className="h-4 w-4 relative z-10 transition-transform duration-200 group-hover:scale-110" />
                                        
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side='bottom' className="bg-popover text-popover-foreground">
                                    <p>Share on {platform.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopyLink}
                                className={`
                                    relative overflow-hidden transition-all duration-300
                                    border-border/50 bg-background cursor-pointer
                                    hover:bg-primary/10 hover:text-primary hover:border-primary/30
                                    group
                                    ${copied ? "bg-green-500/10 text-green-600 border-green-500/30" : ""}
                                `}
                                >
                                    <div 
                                        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                                    />
                                    {copied ? (
                                        <Check className="h-4 w-4 relative z-10" />
                                    ) : (
                                        <Link2 className="h-4 w-4 relative z-10 transition-transform duration-200 group-hover:scale-110" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
                                <p>{copied ? "Copied!" : "Copy link"}</p>
                            </TooltipContent>
                        </Tooltip>

                        {/* Divider */}
                        <div className="w-px h-10 bg-border mx-1" />

                        {/* Generate Card Button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setShowCard(!showCard)}
                                    className={`
                                        relative overflow-hidden transition-all duration-300
                                        border-border/50 bg-background cursor-pointer
                                        hover:bg-violet-500/10 hover:text-violet-600 hover:border-violet-500/30
                                        group
                                        ${showCard ? "bg-violet-500/10 text-violet-600 border-violet-500/30" : ""}
                                    `}
                                >
                                    <div 
                                        className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-violet-500/10 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                                    />
                                    <ImageIcon className="h-4 w-4 relative z-10 transition-transform duration-200 group-hover:scale-110" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
                                <p>{showCard ? "Hide share card" : "Create share card"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {showCard && (
                <div className="mt-6 space-y-4 animate-fade-in">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex rounded-sm border-border overflow-hidden ">
                            <button
                                onClick={() => setCardVariant("landscape")}
                                className={`px-4 py-2 text-sm font-medium font-content  transition-colors cursor-pointer ${
                                    cardVariant === "landscape"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-background text-muted-foreground hover:bg-muted"
                                }`}
                            >
                                Landscape (1200x630)
                            </button>

                            <button
                                onClick={() => setCardVariant("square")}
                                className={`px-4 py-2 text-sm font-medium font-content transition-colors cursor-pointer ${
                                cardVariant === "square"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background text-muted-foreground hover:bg-muted"
                                }`}
                            >
                                Square (1080×1080)
                            </button>
                        </div>

                        <div className="flex gap-2 ml-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownloadCard}
                                disabled={isGenerating}
                                className="gap-2 cursor-pointer"
                            >
                                {isGenerating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                <Download className="h-4 w-4" />
                                )}
                                Download PNG
                            </Button>

                            {typeof navigator !== "undefined" && navigator.share && (
                                <Button
                                variant="default"
                                size="sm"
                                onClick={handleNativeShare}
                                disabled={isGenerating}
                                className="gap-2 cursor-pointer"
                                >
                                {isGenerating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Share2 className="h-4 w-4" />
                                )}
                                Share
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="relative rounded-md border border-border overflow-hidden bg-muted/30 p-4">
                        <p className="text-xs text-muted-foreground mb-3">Preview (scaled down)</p>
                        <div 
                        className="overflow-auto"
                        style={{ 
                            maxWidth: "100%",
                        }}
                        >
                        <div 
                            style={{ 
                            transform: cardVariant === "landscape" ? "scale(0.5)" : "scale(0.35)",
                            transformOrigin: "top left",
                            height: cardVariant === "landscape" ? "315px" : "378px", 
                            width: cardVariant === "landscape" ? "600px" : "378px"
                            }}
                        >
                            <ShareCard
                                ref={cardRef}
                                title={title}
                                description={description || "A comprehensive guide to modern web development."}
                                author={author}
                                authorImage={authorImage}
                                publishDate={publishDate}
                                readTime={readTime}
                                // category={category}
                                variant={cardVariant}
                            />
                        </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShareButtons;