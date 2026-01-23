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
    Calendar,
    Edit,
    Share2,
    Heart,
    Star,
    CheckCircle,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from '@/components/dashboard/Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/useAuthStore';
import axiosInstance from '@/utils/axiosInstance';
import { API_PATHS } from '@/utils/apiPaths';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ProfileUpdateForm } from '@/components/dashboard/ProfileUpdateForm';



interface StatCardProps {
    icon: React.ReactNode,
    value: number,
    label: string,
}


const StatCard = ({ icon, value, label }: StatCardProps) => (
    <Card className="group transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-default">
        <CardContent className="p-5 text-center">
            <div className="flex justify-center mb-2 text-muted-foreground group-hover:text-accent transition-colors">
                {icon}
            </div>
            <div className={`font-serif text-2xl font-semibold `}>
                {value}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                {label}
            </div>
        </CardContent>
    </Card>
);


const Profile2 = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // const [isDarkMode, setIsDarkMode] = useState(true);
    // const [profile, setProfile] = useState();

    const { user, setUser } = useAuthStore();

    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
                withCredentials: true,
            });

            await setUser();
            console.log(response.data);
        } catch (error) {
            // await setUser();
            console.log("Error fetching user details.");
        } finally {
            console.log(user);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    console.log(user?.skills[0])
    console.log(typeof (user?.skills[0]))
    return (
        <div className={theme === 'dark' ? 'dark' : ''}>
            <div className="flex min-h-screen bg-background">

                {/* --- Sidebar (Standard) --- */}
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

                <main className={`
            flex-1 p-8 
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'ml-64' : 'ml-20'}
            `}>
                    <div className="max-w-5xl mx-auto">

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
                        {/* Profile Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-in">
                            <div className="flex items-center gap-5">
                                {/* Enhanced Avatar */}
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-accent/30 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <Avatar className="w-24 h-24 ring-4 ring-background shadow-lg relative transition-transform duration-300 group-hover:scale-105">
                                        <AvatarImage src={user?.profilePic} alt="Agniva Sengupta" className='object-cover' />
                                        <AvatarFallback className="text-2xl font-serif bg-muted">AS</AvatarFallback>
                                    </Avatar>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="font-serif text-3xl font-semibold text-foreground">
                                            Agniva Sengupta
                                        </h1>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            </TooltipTrigger>
                                            <TooltipContent>Verified member</TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <p className="text-muted-foreground mt-1 text-base">{user?.title}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Dialog>
                                    <DialogTrigger>
                                        <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                                            <Edit className="w-4 h-4" />
                                            Edit Profile
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent>
                                        <ProfileUpdateForm/>
                                    </DialogContent>
                                </Dialog>

                                <Button size="sm" className="gap-2 translate-y-4.5 cursor-pointer">
                                    <Share2 className="w-4 h-4" />
                                    Share Profile
                                </Button>
                            </div>
                        </div>

                        {/* Stats and About Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* About Section */}
                            <Card className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="font-serif text-lg">About</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-muted-foreground text-lg font-content leading-relaxed">
                                            {/* {bioExpanded ? fullBio : shortBio} */}
                                            {user?.bio}
                                        </p>
                                        {/* <button
                                            onClick={() => setBioExpanded(!bioExpanded)}
                                            className="text-accent text-sm font-medium mt-2 flex items-center gap-1 hover:underline"
                                        >
                                            {bioExpanded ? (
                                                <>Show less <ChevronUp className="w-4 h-4" /></>
                                            ) : (
                                                <>Read more <ChevronDown className="w-4 h-4" /></>
                                            )}
                                        </button> */}
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="w-4 h-4" />
                                            <span>{user?.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="w-4 h-4" />
                                            <a href="mailto:agniva@example.com" className="hover:text-accent transition-colors">
                                                {user?.email}
                                            </a>
                                        </div>
                                        {user?.socials && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <LinkIcon className="w-4 h-4" />
                                                <a href="#" className="hover:text-accent transition-colors">
                                                    {user.socials}
                                                </a>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span>Joined March 2023</span>
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div className="flex gap-2 pt-2 border-t border-border">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-foreground hover:bg-muted">
                                                    <Github className="w-4 h-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>GitHub</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-foreground hover:bg-muted">
                                                    <Twitter className="w-4 h-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Twitter</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-foreground hover:bg-muted">
                                                    <Linkedin className="w-4 h-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>LinkedIn</TooltipContent>
                                        </Tooltip>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                                <StatCard icon={<FileText className="w-5 h-5" />} value={42} label="Posts" />
                                <StatCard icon={<MessageSquare className="w-5 h-5" />} value={185} label="Comments" />
                                <StatCard icon={<Heart className="w-5 h-5" />} value={1000} label="Likes" />
                                <StatCard icon={<Star className="w-5 h-5" />} value={980} label="Reputation" />
                            </div>
                        </div>

                        {/* Skills Section */}
                        <Card className="mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                            <CardHeader className="pb-3">
                                <CardTitle className="font-serif text-lg">Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {user?.skills.map((skill) => (
                                        <Badge
                                            key={skill}
                                            variant="secondary"
                                            className="px-3 py-1.5 text-sm font-medium bg-muted hover:bg-accent/10 hover:text-accent transition-colors cursor-default"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Timeline */}
                        {/* <Card className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                            <CardHeader className="pb-3">
                                <CardTitle className="font-serif text-lg">Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {activityData.map((activity, index) => (
                                        <div
                                            key={activity.id}
                                            className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                                        >
                                            <div className={`flex items-center justify-center w-9 h-9 rounded-full border shrink-0 ${getActivityColor(activity.type)}`}>
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-medium text-foreground truncate">
                                                        {activity.title}
                                                    </h4>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                        {activity.date}
                                                    </span>
                                                </div>
                                                {activity.description && (
                                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                                        {activity.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card> */}
                    </div>
                </main>

            </div>
        </div>
    );
};

export default Profile2;