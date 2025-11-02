import { BookOpen, Menu, PenTool } from "lucide-react";
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
import { forwardRef, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

const BlogNavbar = forwardRef<HTMLElement>((_, ref) => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const { authFormOpen, setAuthFormOpen } = useAuthStore();

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

  const handleLogOut = async () => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.LOGOUT,
        {},
        {
          withCredentials: true,
        },
      );
      alert("Logged out successfully!");
      console.log(response.data);
    } catch (error) {
      alert("Logout failed!");
      console.log(error);
    }
  };

  return (
    <header ref={ref} className="bg-[#1a1a1a] text-sm min-w-[400px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[700px] 2xl:min-w-[900px] rounded-lg">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center space-x-1 p-1">
            {/*<div className="w-8 h-8 rounded-lg flex items-center justify-center">*/}
            <BookOpen className="w-4 h-4 text-white translate-y-[2px]" />
            {/*</div>*/}
            <h1 className="text-xl text-white font-playfair inline-block">
              Papertrail
            </h1>
          </div>

          {/*<Switch/>*/}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <div className="p-2 flex justify-center items-center rounded-full bg-yellow-50">
                      A
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuLabel>My Profile</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/overview")}
                    >
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/admin/posts")}>
                      Blog Posts
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/profile")}
                    >
                      Profile
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/admin/create")}>
                    Create a blog
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogOut}>
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



export default BlogNavbar;
