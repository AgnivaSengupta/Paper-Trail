import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { useEffect, useState } from "react";
import type { DashboardData } from "@/types/domain";

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
        const response = await axiosInstance.get(
          `${API_PATHS.DASHBOARD_SUMMARY.GET_DASHBOARD_SUMMARY}?range=${timeRange}`,
          {
            withCredentials: true,
          },
        );
        setData(response.data as DashboardData);
      } catch (error) {
        console.error("Failed to fetch dashboard: ", error);
        if (axios.isAxiosError(error)) {
          setError(
            (error.response?.data as { message?: string } | undefined)?.message ||
              "Failed to fetch dashboard data",
          );
        } else {
          setError("Failed to fetch dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  return { data, loading, error, timeRange, setTimeRange };
};
