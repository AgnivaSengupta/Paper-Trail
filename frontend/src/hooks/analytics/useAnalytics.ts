// import { timeStamp } from 'console';
import {useEffect, useRef, useCallback } from 'react';

const FLUSH_INTERVAL = 5000;
const HEARTBEAT_INTERVEL = 5000;
// const endpoint = "http://localhost:8080/api/ingest"
const endpoint = 'http://127.0.0.1:8080/api/ingest'

export const useAnalytics = (postId: string | undefined, userId: string | undefined, authorId: string | undefined) => {
    const eventQueue = useRef<any[]>([]);
    const timeRef = useRef<NodeJS.Timeout | null>(null);
    const heartbeatTimeRef = useRef<NodeJS.Timeout | null>(null);

    const trackEvents = useCallback((eventType: string, data: any = {}) => {
        if (!postId) return;

        const payload = {
            post_id: postId,
            user_id: userId,
            author_id: authorId,
            eventType,
            timestamp: Date.now(),
            referrer: document.referrer,
            ...data,
        };

        eventQueue.current.push(payload);
    }, [postId]);

    const flushQueue = useCallback(() => {
        if (eventQueue.current.length === 0) return;

        const dataToSend = [...eventQueue.current];
        eventQueue.current = []
        const body = JSON.stringify({events: dataToSend});

        if (document.visibilityState === 'hidden'){
            const blob = new Blob([body], {type: "application/json"});
            navigator.sendBeacon(endpoint, blob);
        } else {
            fetch(endpoint, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: body,
                keepalive: true,
            }).catch(err => console.log('Analytics Flush error', err));
        }
    }, []);

    // lifecycle management
    useEffect(() => {
        if (!postId) return;

        timeRef.current = setInterval(flushQueue, FLUSH_INTERVAL);

        const startHeartBeat = () => {
            if (heartbeatTimeRef.current) return;
            heartbeatTimeRef.current = setInterval(() => {
                if (document.visibilityState === 'visible'){
                    trackEvents('heartbeat', { duration_seconds: 5});
                }
            }, HEARTBEAT_INTERVEL);
        }

        const stopHeartBeat = () => {
            if (heartbeatTimeRef.current){
                clearInterval(heartbeatTimeRef.current);
                heartbeatTimeRef.current = null;
            }
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                flushQueue();
                stopHeartBeat();
            } else {
                startHeartBeat();
            }
        }

        if (document.visibilityState === 'visible') {
            startHeartBeat();
        }
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', flushQueue);

        return () => {
            if (timeRef.current) clearInterval(timeRef.current);
            stopHeartBeat();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', flushQueue);
            flushQueue();
        }
    }, [flushQueue, postId, trackEvents]);

    return {trackEvents};
}