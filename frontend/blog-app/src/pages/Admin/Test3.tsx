import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Box, 
  PieChart, 
  Cpu, 
  HardDrive, 
  Wallet, 
  Settings, 
  Search, 
  Bell, 
  X,
  PanelLeft, 
  PanelLeftClose,
  Sun,
  Moon,
  FileText,
  MessageSquare,
  CornerDownRight,
  MoreHorizontal,
  Trash2,
  CheckCircle,
  Clock,
  Send,
  AlertOctagon
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// --- Mock Data for Comments ---
const initialComments = [
  { 
    id: 1, 
    author: 'Sarah Chen', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    postTitle: 'Optimizing Transformer Models for Edge Devices', 
    content: 'This is exactly what I was looking for! specifically the section on quantization. Do you have any benchmarks for the Snapdragon 8 Gen 2?', 
    date: '2 hours ago', 
    status: 'pending',
    isReplyTo: null 
  },
  { 
    id: 2, 
    author: 'Marcus Johnson', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    postTitle: 'The Future of Generative AI in Healthcare', 
    content: 'Great article, but I think you underestimated the regulatory hurdles in the EU. The AI Act is going to change everything.', 
    date: '5 hours ago', 
    status: 'approved',
    isReplyTo: null 
  },
  { 
    id: 3, 
    author: 'Alex Dev', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    postTitle: 'Optimizing Transformer Models for Edge Devices', 
    content: 'Benchmarks are coming in Part 2 next week!', 
    date: '1 hour ago', 
    status: 'approved',
    isReplyTo: 'Sarah Chen' // Indicates this is a nested comment/reply
  },
  { 
    id: 4, 
    author: 'Spam Bot 3000', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Spam',
    postTitle: 'Migrating from PyTorch to JAX', 
    content: 'Cheap GPU clusters for sale!! Click here: http://fake-link.com', 
    date: '1 day ago', 
    status: 'spam',
    isReplyTo: null 
  },
  { 
    id: 5, 
    author: 'Emily White', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    postTitle: 'Migrating from PyTorch to JAX', 
    content: 'The transition was smoother than I expected, thanks to your guide. One question about the jit compilation though...', 
    date: '2 days ago', 
    status: 'approved',
    isReplyTo: null 
  },
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

const Test3 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'approved', 'spam'
  const [replyingTo, setReplyingTo] = useState(null); // ID of comment being replied to
  const [replyText, setReplyText] = useState('');

  // Filter Logic
  const filteredComments = initialComments.filter(comment => {
    if (activeTab === 'all') return comment.status !== 'spam'; // Usually hide spam from 'all'
    return comment.status === activeTab;
  });

  const handleReplyClick = (id) => {
    if (replyingTo === id) {
      setReplyingTo(null); // Close if already open
    } else {
      setReplyingTo(id);
      setReplyText(''); // Reset text
    }
  };

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
              <h1 className="text-2xl font-primary  text-zinc-900 dark:text-zinc-200">Comments</h1>
              <span className="text-zinc-400 text-sm border-l border-zinc-700 pl-4">{initialComments.length} Total</span>
            </div>
            
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
          </header>

          {/* Controls & Filter Bar */}
          <div className="flex justify-between items-end mb-6">
            <div className="flex gap-1 bg-zinc-200 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
              {['all', 'pending', 'approved', 'spam'].map((tab) => (
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
                  {tab} {tab === 'pending' && <span className="ml-1 text-xs bg-emerald-500 text-white px-1.5 rounded-full">1</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Comments Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <th className="py-4 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 w-1/4">Author</th>
                  <th className="py-4 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 w-1/2">Comment</th>
                  <th className="py-4 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-center">Status</th>
                  <th className="py-4 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredComments.map((comment) => (
                  <React.Fragment key={comment.id}>
                    <tr className={`
                      group transition-colors
                      ${replyingTo === comment.id ? 'bg-zinc-50 dark:bg-zinc-800/60' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}
                    `}>
                      
                      {/* Author */}
                      <td className="py-4 px-6 align-top">
                        <div className="flex items-start gap-3">
                           <img src={comment.avatar} alt="avatar" className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                           <div>
                             <div className="font-medium font-primary text-xl text-zinc-900 dark:text-zinc-200">{comment.author}</div>
                             <div className="text-sm text-zinc-500 mt-0.5">{comment.date}</div>
                           </div>
                        </div>
                      </td>

                      {/* Comment Content */}
                      <td className="py-4 px-6 align-top">
                        <div className="flex flex-col gap-1">
                            {/* Context: Is it a reply? */}
                            {comment.isReplyTo && (
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                                    <CornerDownRight size={12} className="text-zinc-400" />
                                    <span>Replying to <span className="text-emerald-500 font-medium">@{comment.isReplyTo}</span></span>
                                </div>
                            )}
                            
                            {/* The Comment */}
                            <p className="font-primary text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                {comment.content}
                            </p>
                            
                            {/* Context: Which Post? */}
                            <div className="mt-2 text-xs text-zinc-400 flex items-center gap-1">
                                <span>on</span>
                                <span className="text-zinc-500 dark:text-zinc-400 font-medium hover:underline cursor-pointer">{comment.postTitle}</span>
                            </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 align-top text-center">
                        {comment.status === 'approved' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                                <CheckCircle size={12} /> Approved
                            </span>
                        )}
                        {comment.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                                <Clock size={12} /> Pending
                            </span>
                        )}
                        {comment.status === 'spam' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
                                <AlertOctagon size={12} /> Spam
                            </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 align-top text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleReplyClick(comment.id)}
                            className={`p-1.5 rounded transition-colors text-sm font-medium flex items-center gap-1.5 ${replyingTo === comment.id ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                          >
                            <CornerDownRight size={14} /> Reply
                          </button>
                          
                          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

                          <button className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                          {/*<button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                            <MoreHorizontal size={16} />
                          </button>*/}
                        </div>
                      </td>
                    </tr>

                    {/* Inline Reply Box */}
                    {replyingTo === comment.id && (
                        <tr className="bg-zinc-50 dark:bg-zinc-800/30 animate-in fade-in slide-in-from-top-2 duration-200">
                            <td colSpan="4" className="p-4 pl-16 pr-6 border-b border-zinc-200 dark:border-zinc-800">
                                <div className="flex gap-4">
                                    <div className="h-full flex flex-col items-center">
                                         <div className="w-0.5 h-full bg-zinc-200 dark:bg-zinc-700"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Replying to @{comment.author}</span>
                                            <button onClick={() => setReplyingTo(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <textarea 
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write your reply..."
                                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 min-h-[100px] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600"
                                        />
                                        <div className="flex justify-end mt-3 gap-2">
                                            <button 
                                                onClick={() => setReplyingTo(null)}
                                                className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2 transition-colors">
                                                <Send size={14} /> Send Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                  </React.Fragment>
                ))}

                {/* Empty State */}
                {filteredComments.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-zinc-500 dark:text-zinc-400">
                        <MessageSquare size={32} className="mx-auto mb-3 opacity-20" />
                        No comments found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Test3;