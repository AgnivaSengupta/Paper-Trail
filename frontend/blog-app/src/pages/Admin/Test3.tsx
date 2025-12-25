import React, { useEffect, useState } from 'react';
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
  AlertOctagon,
  LucideHeading2
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useThemeStore } from '@/store/themeStore';
import axiosInstance from '@/utils/axiosInstance';
import { API_PATHS } from '@/utils/apiPaths';


type Author = {
  name: string;
  profilePic: string | 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex';
};

type PostType = {
  title: string;
}

type Inbox = {
  _id: string;
  post: PostType;
  author: Author;
  content: string;
  parentComment: string | null;
  hasReplied: boolean;
  postAuthor: Author;
  createdAt: string;
  updatedAt: string;
}

const Test3 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'approved', 'spam'
  const [replyingTo, setReplyingTo] = useState(null); // ID of comment being replied to
  const [replyText, setReplyText] = useState('');
  
  const [loading, setLoading] = useState(false);
  
  const [inbox, setInbox] = useState<Inbox[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  const [currPage, setCurrPage] = useState(1);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleReplyClick = (id) => {
    if (replyingTo === id) {
      setReplyingTo(null); // Close if already open
    } else {
      setReplyingTo(id);
      setReplyText(''); // Reset text
    }
  };
  
  const getAllUnrepliedComments = async (pageNumber=1) => {
    try{
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.COMMENTS.GET_ALL_POSTS, {
        params: {
          page: pageNumber,
          limit: 5,
        }
      })
      
      const { inbox, totalCount, totalPages } = response.data;
      setInbox(inbox);
      setTotalCount(totalCount);
      setTotalPages(totalPages);
    } catch (error){
      console.log("Error fetching the comments: ", error);
    } finally {
      setLoading(true);
    }
  }

  const handleNext = () => {
    if (currPage < totalPages) {
      const newPage = currPage + 1;
      setCurrPage(newPage);
      getAllUnrepliedComments(newPage);
    }
  };

  const handlePrev = () => {
    if (currPage > 1) {
      const newPage = currPage - 1;
      setCurrPage(newPage);
      getAllUnrepliedComments(newPage);
    }
  };
  
  useEffect(() => {
    setCurrPage(1);
    getAllUnrepliedComments(1);
  }, []);
  
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="flex min-h-screen bg-background dark:bg-background text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
        
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
              <span className="text-zinc-400 text-sm border-l border-zinc-700 pl-4">{inbox.length} Total</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleTheme()}
                className="p-2 cursor-pointer bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors shadow-sm dark:shadow-none"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Comments Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <th className="py-4 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 w-1/4">Author</th>
                  <th className="py-4 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 w-1/2">Comment</th>
                  {/*<th className="py-4 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-center">Status</th>*/}
                  <th className="py-4 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {inbox.map((comment) => (
                  <React.Fragment key={comment._id}>
                    <tr className={`
                      group transition-colors
                      ${replyingTo === comment._id ? 'bg-zinc-50 dark:bg-zinc-800/60' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}
                    `}>
                      
                      {/* Author */}
                      <td className="py-4 px-6 align-top">
                        <div className="flex items-start gap-3">
                           <img src={comment.author?.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown"} alt="avatar" className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                           <div>
                             <div className="font-medium font-primary text-xl text-zinc-900 dark:text-zinc-200">{comment.author?.name}</div>
                             <div className="text-sm text-zinc-500 mt-0.5">{comment.updatedAt}</div>
                           </div>
                        </div>
                      </td>

                      {/* Comment Content */}
                      <td className="py-4 px-6 align-top">
                        <div className="flex flex-col gap-1">
                            {/* Context: Is it a reply? */}
                            {/*{comment.isReplyTo && (
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                                    <CornerDownRight size={12} className="text-zinc-400" />
                                    <span>Replying to <span className="text-emerald-500 font-medium">@{comment.isReplyTo}</span></span>
                                </div>
                            )}*/}
                            
                            {/* The Comment */}
                            <p className="font-primary text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                {comment.content}
                            </p>
                            
                            {/* Context: Which Post? */}
                            <div className="mt-2 text-xs text-zinc-400 flex items-center gap-1">
                                <span>on</span>
                                <span className="text-zinc-500 dark:text-zinc-400 font-medium hover:underline cursor-pointer">{comment.post.title}</span>
                            </div>
                        </div>
                      </td>

                      {/* Status */}
                      {/*<td className="py-4 px-6 align-top text-center">
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
                      </td>*/}

                      {/* Actions */}
                      <td className="py-4 px-6 align-top text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleReplyClick(comment._id)}
                            className={`p-1.5 rounded transition-colors text-sm font-medium flex items-center gap-1.5 ${replyingTo === comment._id ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
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
                    {replyingTo === comment._id && (
                        <tr className="bg-zinc-50 dark:bg-zinc-800/30 animate-in fade-in slide-in-from-top-2 duration-200">
                            <td colSpan="4" className="p-4 pl-16 pr-6 border-b border-zinc-200 dark:border-zinc-800">
                                <div className="flex gap-4">
                                    <div className="h-full flex flex-col items-center">
                                         <div className="w-0.5 h-full bg-zinc-200 dark:bg-zinc-700"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Replying to @{comment.author?.name}</span>
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
                {inbox.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-12 text-xl font-primary text-center text-zinc-500 dark:text-zinc-400">
                        <MessageSquare size={32} className="mx-auto mb-3 opacity-20" />
                        No unreplied comments.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 flex items-center justify-between">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Showing{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-200">
                  {inbox.length === 0 ? 0 : 1 + (currPage - 1) * 8}
                </span>{" "}
                to{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-200">
                  {(currPage - 1) * 8 + inbox.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-200">
                  {totalCount}
                </span>{" "}
                results
              </div>
              <div className="flex gap-2">
                <button
                  disabled={currPage === 1 || loading}
                  onClick={handlePrev}
                  className={`px-3 py-1 text-xs border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  Previous
                </button>
                <button
                  disabled={currPage >= totalPages || loading}
                  onClick={handleNext}
                  className="px-3 py-1 text-xs border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Test3;