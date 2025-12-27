import {
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  PanelLeft,
  PanelLeftClose,
  Pen,
  Send,
  Settings,
  Sun,
} from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useThemeStore } from "@/store/themeStore";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { useUserStore } from "@/store/userStore";

const SidebarItem = React.forwardRef(
  (
    { icon: Icon, label, active, badge, collapsed, path, variant, ...props },
    ref,
  ) => {
    const navigate = useNavigate();

    const handleClick = (e) => {
      if (path) {
        navigate(path);
      }
    };
    return (
      <div
        ref={ref}
        {...props}
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
        onClick={(e) => {
          props.onClick?.(e);
          handleClick(e);
        }}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} />
          {!collapsed && (
            <span className="text-base whitespace-nowrap">{label}</span>
          )}
        </div>
        {!collapsed && badge && (
          <span className="bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 text-sm px-2 py-0.5 rounded">
            {badge}
          </span>
        )}
        {collapsed && badge && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></div>
        )}
      </div>
    );
  },
);

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const sidebaeItemRef = useRef(null);

  const [supportText, setSupportText] = useState("");

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser)

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  
  
  const handleLogOut = async () => {
    try{    
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGOUT, {
        withCredentials: true,
      });
      clearUser();
    } catch (error) {
      console.log("Error while logging out.", error);
    }
  }
  
  
  return (
    <aside
      className={`
            border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-4 fixed h-full left-0 top-0 overflow-y-auto hide-scrollbar z-50
            bg-white dark:bg-[#0f1014]
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "w-64" : "w-20"}
          `}
    >
      <div
        className={`flex items-center ${isSidebarOpen ? "justify-between px-2" : "justify-center"} mb-8 transition-all duration-300`}
      >
        <div
          className={`flex items-center gap-2 cursor-pointer ${!isSidebarOpen && "hidden"}`}
          onClick={() => navigate("/")}
        >
          <div className="w-6 h-6 bg-zinc-900 dark:bg-zinc-700 rounded flex items-center justify-center">
            <div className="w-3 h-3 bg-zinc-400 rounded-sm"></div>
          </div>
          <span className="font-primary text-3xl tracking-tight whitespace-nowrap dark:text-white text-zinc-900">
            PaperTrails
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white transition-colors p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {isSidebarOpen ? (
            <PanelLeftClose size={20} />
          ) : (
            <PanelLeft size={20} />
          )}
        </button>
      </div>

      <div className="space-y-1 flex-1">
        <SidebarItem
          icon={LayoutDashboard}
          label="Home"
          collapsed={!isSidebarOpen}
          path="/admin/overview"
        />
        <SidebarItem
          icon={FileText}
          label="Posts"
          collapsed={!isSidebarOpen}
          badge="12"
          path="/admin/posts"
        />
        <SidebarItem
          icon={MessageSquare}
          label="Comments"
          collapsed={!isSidebarOpen}
          badge="3"
          path="/admin/comments"
        />
        <SidebarItem
          icon={Settings}
          label="Profile"
          active
          collapsed={!isSidebarOpen}
          path="/admin/profile"
        />

        <div className="my-6 border-t border-zinc-200 dark:border-zinc-800 mx-2"></div>

        <SidebarItem
          icon={Pen}
          label="Write a Post"
          collapsed={!isSidebarOpen}
          path="/admin/create"
        />
      </div>

      <div className="space-y-1">
        <Popover>
          <PopoverTrigger asChild>
            <SidebarItem
              ref={sidebaeItemRef}
              icon={Settings}
              label="Settings"
              collapsed={!isSidebarOpen}
            />
          </PopoverTrigger>

          <PopoverContent className="w-80 bg-background p-2 ml-10 mb-2">
            <div className="font-primary font-bold text-2xl pb-2 ml-2 mt-2">
              <h4>Settings</h4>
            </div>
            {/*<Separator/>*/}
            <div className="flex flex-col gap-1">
              <div className="group">
                <div
                  onClick={() => toggleTheme()}
                  className="p-2 flex gap-3 items-center rounded-sm  group-hover:bg-zinc-300/40 cursor-pointer"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                  <p className="text-sm tracking-wider">Change Theme</p>
                </div>
              </div>
              <Separator />
              <div className="group" onClick={() => handleLogOut()}>
                <div className="p-2 flex gap-3 item-center rounded-sm  group-hover:bg-red-200/30 cursor-pointer">
                  <Avatar className="size-6">
                    <AvatarImage
                      src={ user?.profilePic || "https://github.com/shadcn.png"}
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className="text-sm tracking-wider group-hover:text-red-500">
                    Logout
                  </p>
                  <LogOut className="w-5 h-5 group-hover:text-red-500" />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Dialog>
          <DialogTrigger asChild>
            <SidebarItem
              icon={HelpCircle}
              label="Help Center"
              collapsed={!isSidebarOpen}
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact us</DialogTitle>
              <DialogDescription>
                Facing any issue or bugs? <br />
                Tell us about it so that we can help.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <Label htmlFor="supportText">Your message</Label>
              <Textarea
                id="supportText"
                className="min-h-28"
                placeholder="Type your message here."
                value={supportText}
                onChange={(e) => setSupportText(e.target.value)}
              />

              <div className="flex gap-4 justify-end">
                <DialogClose asChild>
                  <Button className="cursor-pointer" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button className="cursor-pointer">
                  Send
                  <Send />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  );
};

export default Sidebar;
