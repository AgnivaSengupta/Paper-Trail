import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Box, 
  Activity, 
  PieChart, 
  Cpu, 
  HardDrive, 
  Wallet, 
  Settings, 
  HelpCircle, 
  Search, 
  Bell, 
  RefreshCcw, 
  ChevronDown,
  X,
  PanelLeft, 
  PanelLeftClose,
  Sun,
  Moon,
  FileText,
  Edit3,
  Trash2,
  MoreHorizontal,
  ThumbsUp,
  Eye,
  Calendar,
  Filter,
  Plus
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// --- Mock Data for Blog Posts ---
const allPosts = [
  { id: 1, title: 'Optimizing Transformer Models for Edge Devices', category: 'Machine Learning', status: 'published', likes: 1240, views: '45.2K', date: 'Dec 22, 2024', author: 'Felix' },
  { id: 2, title: 'The Future of Generative AI in Healthcare', category: 'Industry Analysis', status: 'published', likes: 856, views: '12.1K', date: 'Dec 20, 2024', author: 'Felix' },
  { id: 3, title: 'Understanding Quantization vs Pruning', category: 'Tutorial', status: 'draft', likes: 0, views: '-', date: 'Dec 19, 2024', author: 'Felix' },
  { id: 4, title: 'Migrating from PyTorch to JAX: A Guide', category: 'Engineering', status: 'published', likes: 2103, views: '89.5K', date: 'Dec 15, 2024', author: 'Felix' },
  { id: 5, title: 'Q4 Product Roadmap Update', category: 'Company', status: 'draft', likes: 0, views: '-', date: 'Dec 12, 2024', author: 'Felix' },
  { id: 6, title: 'Best Practices for GPU Cluster Management', category: 'DevOps', status: 'published', likes: 543, views: '8.4K', date: 'Dec 10, 2024', author: 'Felix' },
  { id: 7, title: 'Fine-tuning LLMs on Custom Datasets', category: 'Tutorial', status: 'draft', likes: 0, views: '-', date: 'Dec 08, 2024', author: 'Felix' },
  { id: 8, title: 'Weekly AI News Roundup #42', category: 'News', status: 'published', likes: 120, views: '3.2K', date: 'Dec 05, 2024', author: 'Felix' },
];

const SidebarItem = ({ icon: Icon, label, active, badge, collapsed }) => (
  <div 
    className={`
      flex items-center 
      ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} 
      py-3 mb-1 cursor-pointer rounded-lg transition-colors 
      ${active 
        ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white' 
        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200'}
    `}
    title={collapsed ? label : ''}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} />
      {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
    </div>
    {!collapsed && badge && (
      <span className="bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 text-xs px-2 py-0.5 rounded">{badge}</span>
    )}
    {collapsed && badge && (
      <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></div>
    )}
  </div>
);

const Test4 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'published', 'draft'

  // Filter Logic
  const filteredPosts = allPosts.filter(post => {
    if (activeTab === 'all') return true;
    return post.status === activeTab;
  });

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-[#0f1014] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
        
        
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>

        {/* --- Main Content --- */}
        <main 
          className={`
            flex-1 p-8 
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'ml-64' : 'ml-20'}
          `}
        >
          
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-primary text-zinc-900 dark:text-zinc-200">Posts</h1>
              <span className="text-zinc-400 text-sm border-l border-zinc-700 pl-4">{allPosts.length} Total Posts</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="relative h-18">
                   <Search className="absolute left-3 top-7 text-zinc-400 dark:text-zinc-500" size={16} />
                   <input type="text" placeholder="Search..." className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 w-64 text-zinc-900 dark:text-zinc-300 shadow-sm dark:shadow-none" />
                </div>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 cursor-pointer bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors shadow-sm dark:shadow-none"
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Controls & Filter Bar */}
          <div className="flex justify-between items-end mb-6">
            <div className="flex gap-1 bg-zinc-200 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
              {['all', 'published', 'draft'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all cursor-pointer
                    ${activeTab === tab 
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300'}
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/*<button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 px-3 py-2 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors">
              <Filter size={14} /> Filter View
            </button>*/}
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <th className="py-4 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 w-[40%]">Post Details</th>
                    <th className="py-4 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Status</th>
                    <th className="py-4 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Engagement</th>
                    <th className="py-4 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Date</th>
                    <th className="py-4 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                      
                      {/* Title & Category */}
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-3">
                           <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-400">
                             <FileText size={20} />
                           </div>
                           <div>
                             <div className="font-primary text-xl text-zinc-900 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer">
                               {post.title}
                             </div>
                             <div className="text-sm text-zinc-500 mt-1 flex items-center gap-2">
                               <span>{post.author}</span>
                               <span className="w-1 h-1 bg-zinc-400 rounded-full"></span>
                               <span>{post.category}</span>
                             </div>
                           </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`
                          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                          ${post.status === 'published' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                            : 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'}
                        `}>
                          <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'published' ? 'bg-emerald-500' : 'bg-zinc-400'}`}></span>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </td>

                      {/* Engagement (Likes/Views) */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4 text-base text-zinc-600 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5 min-w-[60px]" title="Likes">
                            <ThumbsUp size={14} className={post.status === 'draft' ? 'text-zinc-300 dark:text-zinc-700' : ''} />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1.5" title="Views">
                            <Eye size={14} className={post.status === 'draft' ? 'text-zinc-300 dark:text-zinc-700' : ''} />
                            <span>{post.views}</span>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-base text-zinc-500 dark:text-zinc-400">
                          <Calendar size={14} />
                          <span>{post.date}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 cursor-pointer text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                            <Edit3 size={16} />
                          </button>
                          <button className="p-1.5 cursor-pointer text-zinc-400 hover:text-rose-600 dark:hover:text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors">
                            <Trash2 size={16} />
                          </button>
                          {/*<button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                            <MoreHorizontal size={16} />
                          </button>*/}
                        </div>
                      </td>

                    </tr>
                  ))}

                  {/* Empty State if no results */}
                  {filteredPosts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-zinc-500 dark:text-zinc-400">
                        No posts found for this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Footer */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 flex items-center justify-between">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Showing <span className="font-medium text-zinc-900 dark:text-zinc-200">1</span> to <span className="font-medium text-zinc-900 dark:text-zinc-200">{filteredPosts.length}</span> of <span className="font-medium text-zinc-900 dark:text-zinc-200">{allPosts.length}</span> results
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 opacity-50 cursor-not-allowed">Previous</button>
                <button className="px-3 py-1 text-xs border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700">Next</button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Test4;