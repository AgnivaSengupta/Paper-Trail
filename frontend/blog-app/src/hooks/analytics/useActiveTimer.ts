import { useEffect, useRef } from "react";

export const useActiveTimer = (trackEvents: Function, postId: string) => {
    const isActive = useRef(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (!postId) return;

        const handleVisibilityChange = () => {
            isActive.current = document.visibilityState === 'visible';
        };

        intervalRef.current = setInterval(() => {
            if (isActive.current){
                trackEvents('heartbeat', {duration_seconds: 10})
            }
        }, 10000);

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [trackEvents, postId]);
};