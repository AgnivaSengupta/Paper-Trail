import AuthForm from "@/components/auth/AuthForm";
import Footer from "@/components/blogPage/Footer";
import Header from "@/components/blogPage/Header";
import Hero from "@/components/blogPage/Hero";
import LatestPosts from "@/components/blogPage/LatestPosts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthStore } from "@/store/useAuthStore";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import type { Post } from "../Admin/BlogPosts";

const LandingPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { authFormOpen, setAuthFormOpen } = useAuthStore();
  const { user, setUser } = useAuthStore();
  
  const [posts, setPosts] = useState<Post[]>([]);
  
  const fetchPosts = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.POST.GET_LATEST_POSTS);
      
      const { posts } = response.data;
      
      setPosts(posts);
      //setCurrPage(page);
      //setTotalPages(totalPages);
      setLoading(false);
      
      console.log(posts);
      
    } catch (error) {
      console.log("Error while fetching the posts: ", error);
      setLoading(false);
      // TO-DO --> in case the posts are not loading, Do not render the landing page only. Tell the user that website is under maintenance and will live shortly.
      // Meanwhile send the notification that the website is down to the admin/maintainer....
    } finally {
      setLoading(false);
    }
  }
  
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
    fetchPosts(1);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <LatestPosts />
      </main>
      <Footer />
      
      <Dialog open={authFormOpen} onOpenChange={setAuthFormOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-stone-100">
          <DialogHeader className="p-6 pb-0 ">
            <DialogTitle className="text-center text-foreground text-2xl font-playfair">
              Papertrail
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            {/* <SignupForm /> */}
            <AuthForm />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;
