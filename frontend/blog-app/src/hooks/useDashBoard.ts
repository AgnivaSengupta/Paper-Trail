import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";

export interface DashboardData {
    stats: {
        totalPosts: number;
        drafts: number;
        published: number;
        totalViews: number;
        totalVisitors: number;
        avgReadTime: number;
    },
    topPosts: {
        _id: string;
        title: string;
        coverImageUrl: string;
        views: number;
    }[];
}

export const useDashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<string>("30d");

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get(`${API_PATHS.DASHBOARD_SUMMARY.GET_DASHBOARD_SUMMARY}?range=${timeRange}`);
                setData(response.data);
            } catch (error) {
                console.log("Failed to fetch dashboard: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [timeRange]);

    return {data, loading, error, timeRange, setTimeRange}
}

