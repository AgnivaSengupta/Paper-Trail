import { BookOpen, User } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { forwardRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const BlogNavbar = forwardRef<HTMLElement>((_, ref) => {
  const navigate = useNavigate();
  const { user, setAuthFormOpen, logout } = useAuthStore();
  
  const handleLogOut = async () => {
    try {
      await logout();
      alert("Logged out successfully!");
      navigate("/");
    } catch (error) {
      alert("Logout failed!");
      console.error(error);
    }
  };

  return (
    <header ref={ref} className="bg-[#1a1a1a] text-sm min-w-[300px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[700px] 2xl:min-w-[1200px] rounded-lg">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center space-x-1 p-1 cursor-pointer" onClick={() => navigate("/")}>
            <BookOpen className="w-6 h-6 text-white translate-y-[2px]" />
            <h1 className="text-2xl text-white font-playfair inline-block">
              Papertrail
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user.profilePic} alt={user.name} />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/admin/overview")}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/admin/posts")}>
                      Blog Posts
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
                      Profile
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/admin/create")}>
                    Create a blog
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogOut} className="text-red-500 focus:text-red-500">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                className="bg-secondary text-secondary-foreground cursor-pointer hover:bg-secondary/80"
                onClick={() => setAuthFormOpen(true)}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

BlogNavbar.displayName = "BlogNavbar";

export default BlogNavbar;
