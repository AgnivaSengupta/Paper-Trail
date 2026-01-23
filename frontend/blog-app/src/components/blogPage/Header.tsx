import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PenLine, Menu, Moon, Sun, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {motion} from 'framer-motion'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const { user, setUser } = useAuthStore();
  const { authFormOpen, setAuthFormOpen } = useAuthStore();

  useEffect(() => {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
          withCredentials: true,
        });

        setUser(response.data);
      } catch (error) {
        setUser(null);
        console.log(error);
      }
    };
    fetchProfile();
  }, [setUser]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const navLinks = [
    { href: "#posts", label: "Posts" },
    { href: "#", label: "About" },
  ];

  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGOUT, {
        withCredentials: true,
      })
      console.log(response);
    } catch (error) {
      console.log("Error while logging out..")
    }
  }
  
  return (
    <header className="fixed top-4 left-4 right-4 z-[100]">
      <motion.div
        initial={{ width: "0%", opacity: 0, y: -20 }}
          animate={{ width: "100%", opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20, 
            delay: 0.2,
            // Width animation usually looks better with a slightly longer duration
            width: { duration: 1.0, ease: "easeOut" } 
          }}
        className="container max-w-6xl mx-auto flex h-14 items-center justify-between px-6 rounded-full border border-border/50 bg-gradient-to-b from-background/80 to-background/60 backdrop-blur-xl shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <PenLine className="h-5 w-5" />
          <span className="font-sketch text-2xl ">PaperTrails</span>
        </div>
        
        {/* Desktop Navigation */}
        {/*<nav className="hidden md:flex items-center gap-6 font-mono text-sm">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>*/}

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {/*<Button variant="ghost" size="sm" className="font-mono text-sm">
            Sign In
          </Button>*/}
          {user ? (
            <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar>
                      <AvatarImage src={ user.profilePic } alt='User Image'/>
                      <AvatarFallback>
                        <User/>
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-3" align="start">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                        Profile
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/admin/overview')}>
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/posts')}>
                        My Posts
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/admin/comments')}>
                        My comments
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate('/admin/create')}>Create a new post</DropdownMenuItem>
                    </DropdownMenuGroup>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogOut}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

          ): (
            <Button size="sm" variant='signin' className="font-mono text-sm sketch-border cursor-pointer rounded-full" onClick={() => setAuthFormOpen(true)}>
              Start Writing
            </Button>
          )}

        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full h-9 w-9"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] grid-paper z-100">
              <div className="flex flex-col gap-8 mt-8 ml-4">
                {/* Mobile Logo */}
                <div className="flex items-center gap-2">
                  <PenLine className="h-5 w-5" />
                  <span className="font-sketch text-2xl">PaperTrails</span>
                </div>

                {/* Mobile Nav Links */}
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="font-sketch text-2xl text-muted-foreground hover:text-foreground transition-colors"
                    >
                      → {link.label}
                    </a>
                  ))}
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t border-border w-3/4 mx-auto">
                  <Button className="font-mono text-sm sketch-border justify-start">
                    Start Writing
                  </Button>
                </div>

                {/* Annotation */}
                <div className="mt-auto font-sketch text-muted-foreground mx-auto">
                  {"{ menu }"}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
