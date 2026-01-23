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

const SidebarItem = ({ icon: Icon, label, active, badge, collapsed }) => (
  <div
    className={`
      flex items-center
      ${collapsed ? "justify-center px-2" : "justify-between px-4"}
      py-3 mb-1 cursor-pointer rounded-lg transition-colors
      ${
        active
          ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
      }
    `}
    title={collapsed ? label : ""}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} />
      {!collapsed && (
        <span className="text-sm font-medium whitespace-nowrap">{label}</span>
      )}
    </div>
    {!collapsed && badge && (
      <span className="bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 text-xs px-2 py-0.5 rounded">
        {badge}
      </span>
    )}
    {collapsed && badge && (
      <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></div>
    )}
  </div>
);


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
        <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">
          {title}
        </h3>
        {loading ? (
            <div className="h-8 w-24 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
        ) : (
            <div className="text-3xl font-bold text-zinc-900 dark:text-white">
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
  const {user} = useAuthStore();

  // ----------------------------------------------------------------------------------------------
  const {data, loading, error, timeRange, setTimeRange} = useDashboard();
  
  if (error) {
    return <div className="p-8 text-red-500">Failed to load dashboard: {error}</div>;
  }
  // ----------------------------------------------------------------------------------------------



  // Helper for Chart Colors based on theme
  const chartGridColor = theme === "dark" ? "#27272a" : "#e4e4e7";
  const chartTextColor = theme === "dark" ? "#71717a" : "#a1a1aa";
  const tooltipBg = theme === "dark" ? "#18181b" : "#ffffff";
  const tooltipBorder = theme === "dark" ? "#27272a" : "#e4e4e7";
  const tooltipText = theme === "dark" ? "#e4e4e7" : "#18181b";

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
              {/* <div className="relative h-18">
                <Search
                  className="absolute left-3 top-7 text-zinc-400 dark:text-zinc-500"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 w-64 text-zinc-900 dark:text-zinc-300 shadow-sm dark:shadow-none"
                />
              </div> */}
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
                Top Performing Content
              </h3>
              <span className="text-xs text-zinc-500">Sorted by Views</span>
            </div>
            {/* <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient
                      id="colorAccuracy"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={chartGridColor}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartTextColor, fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartTextColor, fontSize: 10 }}
                    domain={[90, 110]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: tooltipText }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAccuracy)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div> */}

<div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/30 text-zinc-500 dark:text-zinc-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 font-medium">Rank</th>
                            <th className="px-6 py-4 font-medium">Post Title</th>
                            <th className="px-6 py-4 font-medium text-right">Views</th>
                            <th className="px-6 py-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                        {loading ? (
                            // Skeleton Rows
                            [1,2,3].map(i => (
                                <tr key={i}>
                                    <td className="px-6 py-4"><div className="h-4 w-8 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"/></td>
                                    <td className="px-6 py-4"><div className="h-4 w-48 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"/></td>
                                    <td className="px-6 py-4"><div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse ml-auto"/></td>
                                    <td className="px-6 py-4"><div className="h-4 w-8 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse ml-auto"/></td>
                                </tr>
                            ))
                        ) : (
                            data?.topPosts.map((post, index) => (
                                <tr key={post._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4 text-zinc-500 font-mono">#{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {post.coverImageUrl && (
                                                <img src={post.coverImageUrl} alt="" className="w-10 h-10 rounded-md object-cover" />
                                            )}
                                            <span className="font-medium text-zinc-900 dark:text-zinc-200 line-clamp-1">
                                                {post.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-zinc-900 dark:text-white">
                                        {formatNumber(post.views)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a href={`/post/${post._id}`} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors inline-block">
                                            <ExternalLink size={16} />
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                        {!loading && data?.topPosts.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                    No posts found. Start writing to see analytics!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* System Health */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                  System Health
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-emerald-500">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  OPERATIONAL
                </div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    label: "Api Endpoints",
                    sub: "Response Time: 124ms",
                    status: "99%",
                  },
                  {
                    label: "Model Registry",
                    sub: "24 Models Active",
                    status: "Online",
                  },
                  {
                    label: "GPU Cluster",
                    sub: "4/4 GPUs Available",
                    status: "Healthy",
                  },
                  {
                    label: "Storage",
                    sub: "4.2TB / 10TB Used",
                    status: "Normal",
                  },
                  {
                    label: "Database",
                    sub: "Replication Lag: 2ms",
                    status: "Normal",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500 mt-0.5 shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                          {item.label}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                          {item.status}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GPU Utilization */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none transition-colors">
              <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-6">
                GPU Utilization
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={gpuData}>
                    <defs>
                      <linearGradient
                        id="colorGpu1"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#a855f7"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#a855f7"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorGpu2"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ec4899"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ec4899"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartGridColor}
                      vertical={false}
                    />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                      }}
                      itemStyle={{ color: tooltipText }}
                    />
                    <Area
                      type="monotone"
                      dataKey="gpu1"
                      stackId="1"
                      stroke="#a855f7"
                      fill="url(#colorGpu1)"
                    />
                    <Area
                      type="monotone"
                      dataKey="gpu2"
                      stackId="1"
                      stroke="#ec4899"
                      fill="url(#colorGpu2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div> GPU
                  1
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div> GPU 2
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                  Recent Alerts [3]
                </h3>
              </div>

              <div className="space-y-6">
                <div className="flex gap-3">
                  <AlertTriangle
                    size={18}
                    className="text-rose-500 shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                        High Latency Detected
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        2 Min Ago
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      Fraud-Detection-V4
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Info size={18} className="text-zinc-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                        Training Complete
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        1 Hour Ago
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      Experiment-Nlp-V8
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Info size={18} className="text-zinc-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                        Training Complete
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        1 Hour Ago
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      Experiment-Nlp-V8
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <AlertTriangle
                    size={18}
                    className="text-amber-500 shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                        Drift Alert
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        15 Min Ago
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      Sentiment-Analysis-V3
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 text-left uppercase tracking-wider">
                [ View All Alerts → ]
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
