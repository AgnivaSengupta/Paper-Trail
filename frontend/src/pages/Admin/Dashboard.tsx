import React, { useState } from "react";
import {
  Search,
  RefreshCcw,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  Sun,
  Moon,
  Rocket,
  Clock,
  FileText,
  Users,
  Eye,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "@/components/dashboard/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboard } from "@/hooks/useDashBoard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";

// --- Mock Data ---
const performanceData = [
  { day: "Dec 1", accuracy: 93 },
  { day: "Dec 3", accuracy: 94 },
  { day: "Dec 6", accuracy: 96 },
  { day: "Dec 9", accuracy: 98 },
  { day: "Dec 11", accuracy: 96 },
  { day: "Dec 14", accuracy: 99 },
  { day: "Dec 18", accuracy: 102 },
  { day: "Dec 20", accuracy: 104 },
  { day: "Dec 22", accuracy: 105 },
];

const gpuData = [
  { time: "1", gpu1: 40, gpu2: 24 },
  { time: "2", gpu1: 30, gpu2: 13 },
  { time: "3", gpu1: 20, gpu2: 38 },
  { time: "4", gpu1: 27, gpu2: 39 },
  { time: "5", gpu1: 18, gpu2: 48 },
  { time: "6", gpu1: 23, gpu2: 38 },
  { time: "7", gpu1: 34, gpu2: 43 },
];

// Helper to format seconds into "2m 30s"
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
};

// Helper to format large numbers (1500 -> 1.5k)
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(num);
};

const StatCard = ({
  title,
  value,
  subtext,
  trend,
  icon: Icon,
  loading,
  // trendValue,
  // trendPositive,
}) => (
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-zinc-500 dark:text-zinc-300 text-sm font-bold font-mono uppercase tracking-normal mb-1">
          {title}
        </h3>
        {loading ? (
          <div className="h-8 w-24 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
        ) : (
          <div className="text-3xl font-primary font-bold text-zinc-900 dark:text-white mt-4 ml-2">
            {value}
          </div>
        )}
      </div>
      <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400">
        <Icon size={20} />
      </div>
    </div>

    <div className="flex items-center gap-2 text-xs">
      {/* Placeholder for trend - typically calculated vs previous period */}
      <span className="text-emerald-500 flex items-center gap-0.5 font-medium">
        {trend}
      </span>
      <span className="text-zinc-500 dark:text-zinc-500">{subtext}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { user } = useAuthStore();
  
  const navigate = useNavigate();

  // ----------------------------------------------------------------------------------------------
  const { data, loading, error, timeRange, setTimeRange } = useDashboard();

  if (error) {
    return <div className="p-8 text-red-500">Failed to load dashboard: {error}</div>;
  }
  // ----------------------------------------------------------------------------------------------


  return (
    // The "dark" class wrapper allows Tailwind's dark mode to work within this component
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-[#0f1014] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* --- Main Content --- */}
        <main
          className={`
            relative flex-1 p-8
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "ml-64" : "ml-20"}
          `}
        >
          {/* ================================================================= */}
          {/* COMING SOON OVERLAY                         */}
          {/* ================================================================= */}
          {/* <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-xl">
            <div className="text-center p-8 bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-md mx-4">
              <div className="mx-auto w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <Rocket className="text-emerald-500" size={32} />
              </div>
              <h2 className="text-2xl font-primary font-bold text-zinc-900 dark:text-white mb-2">
                User Blog Analytics
              </h2>
              <p className="text-base text-zinc-500 dark:text-zinc-400 mb-6">
                We are currently processing the final datasets and setting up
                real-time GPU monitoring. Check back in a few days!
              </p>
              <button className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-lg font-medium font-primary hover:opacity-90 transition-opacity">
                Notify Me
              </button>
            </div>
          </div> */}
          {/* ================================================================= */}
          {/* END OVERLAY                                 */}
          {/* ================================================================= */}


          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-primary text-zinc-900 dark:text-zinc-200">
              Home
            </h1>

            <div className="flex items-center gap-3">

              <button
                onClick={() => toggleTheme()}
                className="p-2 cursor-pointer bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors shadow-sm dark:shadow-none"
              >
                {theme ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* <button className="flex items-center gap-2 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 px-3 py-2 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 transition-colors shadow-sm dark:shadow-none text-zinc-700 dark:text-zinc-200">
                Last 7 days <ChevronDown size={14} />
              </button> */}

              <div className="flex bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 p-1">
                {['24h', '7d', '30d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`
                      px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer
                      ${timeRange === range
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"}
                  `}
                  >
                    {range.toUpperCase()}
                  </button>
                ))}

              </div>
              <button className="p-2 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors shadow-sm dark:shadow-none">
                <RefreshCcw size={18} />
              </button>

              <Avatar>
                <AvatarImage
                  src={user?.profilePic || "https://github.com/shadcn.png"}
                  alt="user"
                  className="object-cover"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Total Views"
              value={data ? formatNumber(data.stats.totalViews) : 0}
              loading={loading}
              icon={Eye}
              subtext="Unique page views"
              trend={null}
            />
            <StatCard
              title="Avg Read Time"
              value={data ? formatTime(data.stats.avgReadTime) : "0s"}
              loading={loading}
              icon={Clock}
              subtext="Engagement score"
              trend={null}
            />
            <StatCard
              title="Total Visitors"
              value={data ? formatNumber(data.stats.totalVisitors) : "0"}
              loading={loading}
              icon={Users}
              subtext="Unique devices"
              trend={null}
            />
            <StatCard
              title="Content Library"
              value={data ? data.stats.totalPosts : "0"}
              loading={loading}
              icon={FileText}
              subtext={`${data?.stats?.published || 0} Pub · ${data?.stats?.drafts || 0} Draft`}
              trend={null}
            />
          </div>

          {/* Main Chart Section */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800/50 mb-6 shadow-sm dark:shadow-none transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-content font-semibold uppercase tracking-wider">
                Recent Activity
              </h3>
              <span className="text-xs text-zinc-500">Sorted by Views</span>
            </div>

            <table className="w-full text-left border-collapse -translate-y-2">
              <thead>
                <tr className="py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <th className="py-6 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Rank
                  </th>
                  <th className="py-6 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 w-[40%]">
                    Post Details
                  </th>
                  <th className="py-6 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Views
                  </th>
                  <th className="py-6 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12">
                      <div className="flex flex-col items-center justify-center w-full">
                        <Spinner />
                        <span className="mt-2 text-sm text-zinc-500">
                          Loading your posts...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data?.topPosts.map((post, index) => (
                    <tr
                      key={post._id}
                      className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      
                    <td className="py-6 px-6">
                      <div className="pl-5 pb-2 text-base text-zinc-500 dark:text-zinc-400">
                        <span>{index+1}</span>
                      </div>
                    </td>
                      
                      {/* Title & Category */}
                      <td className="py-6 px-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-400">
                            <FileText size={20} />
                          </div>   
                            <div
                              // onClick={() => navigate(`/${post.slug}`)}
                              className="font-primary text-xl text-zinc-900 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer">
                              {post.title}
                            </div>
                        </div>
                      </td>

                      {/* Engagement (Likes/Views) */}
                      <td className="py-6 px-6">
                        <div className="pl-3 text-lg text-zinc-600 dark:text-zinc-400">

                          <div
                            className="flex items-center gap-4"
                            title="Views"
                          >
                            <Eye
                              size={16}
                              className={
                                   "text-zinc-300 dark:text-zinc-700"
                              }
                            />
                            <span>{post.views}</span>
                          </div>
                        </div>
                      </td>


                      {/* Actions */}
                      <td className="py-6 px-6 text-center">
                        <div className="flex items-center justify-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity pl-4">
                          <button
                            onClick={() => navigate(`/${post.slug}`)}
                            className="p-1.5 cursor-pointer text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                            <ExternalLink size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
            
          </div>

          {/* Bottom Grid */}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
