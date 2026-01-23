import React, { useEffect, useState } from 'react';
import { 
  Sun,
  Moon,
  FileText,
  MessageSquare,
  MapPin,
  Mail,
  Link as LinkIcon,
  Github,
  Twitter,
  Linkedin,
  Edit2,
  Calendar,
  Award,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Sidebar from '@/components/dashboard/Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useThemeStore } from '@/store/themeStore';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ProfileUpdateForm } from '@/components/dashboard/ProfileUpdateForm';
import { useAuthStore } from '@/store/useAuthStore';
import axiosInstance from '@/utils/axiosInstance';
import { API_PATHS } from '@/utils/apiPaths';


// --- Mock Data ---
const userProfile = {
  name: 'Felix Johnson',
  role: 'Senior ML Engineer',
  location: 'San Francisco, CA',
  email: 'felix.j@modelmetric.com',
  website: 'felix-ml.dev',
  joinDate: 'Joined March 2023',
  bio: 'Passionate about democratizing AI. Currently working on optimizing transformer models for edge devices. Contributor to PyTorch and TensorFlow ecosystems.',
  stats: {
    posts: 42,
    comments: 185,
    likesReceived: '12.4K',
    reputation: 980
  }
};

const activityLog = [
  { id: 1, type: 'post', content: 'Published "Optimizing Transformer Models"', date: '2 hours ago', icon: FileText, color: 'text-emerald-500' },
  { id: 2, type: 'comment', content: 'Replied to Sarah Chen on "Future of Generative AI"', date: '5 hours ago', icon: MessageSquare, color: 'text-blue-500' },
  { id: 3, type: 'milestone', content: 'Reached 10,000 views on a single post', date: '1 day ago', icon: Award, color: 'text-amber-500' },
  { id: 4, type: 'system', content: 'Deployed model "v4-NLP-Quantized" to production', date: '2 days ago', icon: Zap, color: 'text-purple-500' },
  { id: 5, type: 'post', content: 'Drafted "Migrating from PyTorch to JAX"', date: '3 days ago', icon: FileText, color: 'text-zinc-400' },
];

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  // const [profile, setProfile] = useState();

  const {user, setUser} = useAuthStore();
  
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
        withCredentials: true,
      });

      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      console.log(user);
    }
  };
  
  useEffect(() => {
    fetchProfile();
    //fetchPosts(1);
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
      <div className="flex min-h-screen bg-zinc-50 dark:bg-[#0f1014] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
        
        {/* --- Sidebar (Standard) --- */}
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>

        {/* --- Main Content --- */}
        <main 
          className={`
            flex-1 p-8 
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'ml-64' : 'ml-20'}
          `}
        >
          
          {/* Header Actions */}
          <header className="flex justify-end items-center mb-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleTheme()}
                className="p-2 cursor-pointer bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors shadow-sm dark:shadow-none"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <Avatar>
                <AvatarImage src={user?.profilePic || "https://github.com/shadcn.png"} alt="@shadcn" className='object-cover' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* --- Profile Section --- */}
          
          {/* Cover Image & Header */}
          <div className="relative mb-20 pt-14">
            
            <div className="absolute -bottom-14 left-8 flex items-end gap-6">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-zinc-50 dark:border-[#0f1014] overflow-hidden bg-zinc-800">
                        <img src={user?.profilePic ||"https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Felix" className="w-full h-full object-cover" />
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                      <button className="absolute bottom-1 right-1 cursor-pointer bg-emerald-500 text-white p-1.5 rounded-full border-4 border-zinc-50 dark:border-[#0f1014] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <Edit2 size={12} />
                      </button>
                      </TooltipTrigger>
                      <TooltipContent className='bg-white text-black'>
                        <p>Change image</p>
                      </TooltipContent>
                    </Tooltip>
                </div>
                <div className="mb-2">
                    <h1 className="text-5xl font-primary text-black dark:text-zinc-100 flex items-center gap-2">
                        {user?.name} 
                        <CheckCircle2 size={18} className="text-emerald-500" />
                    </h1>
                    <p className="font-primary text-2xl text-zinc-500 dark:text-zinc-400">{user?.title}</p>
                </div>
            </div>

            <div className="absolute -bottom-10 right-0 flex gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm dark:shadow-none">
                      <Edit2 size={16} /> Edit Profile
                  </button>
                </DialogTrigger>
                
                <DialogContent>
                  <ProfileUpdateForm/>
                </DialogContent>
              </Dialog>

                <button className="px-4 py-2 cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-900/20">
                    Share Profile
                </button>
            </div>
          </div>

          {/* Profile Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            
            {/* Left Column: Info */}
            <div className="space-y-6">
                
                {/* About Card */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                    <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold font-primary text-2xl mb-4">About</h3>
                    <p className="font-primary text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                        {user?.bio}
                    </p>
                    
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <MapPin size={16} className="text-zinc-400 dark:text-zinc-500" />
                            {user?.location}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <Mail size={16} className="text-zinc-400 dark:text-zinc-500" />
                            {user?.email}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <LinkIcon size={16} className="text-zinc-400 dark:text-zinc-500" />
                            <a href="#" className="text-emerald-600 dark:text-emerald-500 hover:underline">{user?.socials}</a>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <Calendar size={16} className="text-zinc-400 dark:text-zinc-500" />
                            {userProfile.joinDate}
                        </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-4">
                        <a href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><Github size={20}/></a>
                        <a href="#" className="text-zinc-400 hover:text-blue-500 transition-colors"><Twitter size={20}/></a>
                        <a href="#" className="text-zinc-400 hover:text-blue-600 transition-colors"><Linkedin size={20}/></a>
                    </div>
                </div>

                {/* Skills/Tags */}
              {user?.skills && (
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                  <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold font-primary text-2xl mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}


            </div>

            {/* Right Column: Stats & Activity */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Stats Row */}
                <div className="font-primary grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center shadow-sm dark:shadow-none">
                        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{userProfile.stats.posts}</div>
                        <div className="text-base text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Posts</div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center shadow-sm dark:shadow-none">
                        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{userProfile.stats.comments}</div>
                        <div className="text-base text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Comments</div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center shadow-sm dark:shadow-none">
                        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{userProfile.stats.likesReceived}</div>
                        <div className="text-base text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Likes</div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center shadow-sm dark:shadow-none">
                        <div className="text-3xl font-bold text-emerald-500">{userProfile.stats.reputation}</div>
                        <div className="text-base text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Reputation</div>
                    </div>
                </div>

                {/* Activity Feed */}
                
                {/* <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                         <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold font-primary text-2xl">Recent Activity</h3>
                         <button className="text-xs text-emerald-600 dark:text-emerald-500 font-medium hover:underline">View All</button>
                    </div>

                    <div className="space-y-0 relative">
                        <div className="absolute left-[19px] top-2 bottom-4 w-px bg-zinc-200 dark:bg-zinc-800"></div>

                        {activityLog.map((activity) => (
                            <div key={activity.id} className="relative pl-12 pb-8 last:pb-0">
                                
                                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center z-10">
                                    <activity.icon size={18} className={activity.color} />
                                </div>
                                
                                <div className="flex flex-col">
                                    <div className="text-sm text-zinc-900 dark:text-zinc-200 font-medium">
                                        {activity.content}
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-1">
                                        {activity.date} • <span className="capitalize">{activity.type}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}

            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default ProfilePage;