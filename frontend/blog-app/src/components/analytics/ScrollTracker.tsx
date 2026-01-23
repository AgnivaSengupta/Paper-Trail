import { useEffect, useRef } from "react"

export const ScrollTracker = ({trackEvents, postId} : {trackEvents: Function, postId: string | undefined}) => {
    const trackDepths = new Set<number>();
    const observer = useRef<IntersectionObserver | null>(null);
    useEffect(() => {
        trackDepths.clear();
    }, [postId]);

    useEffect(() => {
        if (!postId) return;

        observer.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                console.log("Observer check:", entry.target.getAttribute('data-depth'), entry.isIntersecting);
                if (entry.isIntersecting) {
                    const depth = Number(entry.target.getAttribute('data-depth'));

                    if (!trackDepths.has(depth)){
                        trackDepths.add(depth);
                        console.log(`[Analytics] Scroll depth reached: ${depth}%`);
                        trackEvents('scroll_depth', { depth_percentage: depth});
                    }
                }
            });
        }, {
            root: null, // Use viewport
            rootMargin: '0px',
            threshold: 0.1
        });

        document.querySelectorAll('.scroll-marker').forEach((el) => {
            observer.current?.observe(el);
        });

        return () => observer.current?.disconnect();
    }, [trackEvents, postId]);

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none ]">
            <div className="scroll-marker absolute top-[25%] w-full h-10  bg-transparent" data-depth="25" />
            <div className="scroll-marker absolute top-[50%] w-full h-10  bg-transparent" data-depth="50" />
            <div className="scroll-marker absolute top-[75%] w-full h-10  bg-transparent" data-depth="75" />
            <div className="scroll-marker absolute top-[100%] w-full h-10  bg-transparent" data-depth="100" />
        </div>
    );
}