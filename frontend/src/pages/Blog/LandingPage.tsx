// import AuthForm from "@/components/auth/AuthForm";
// import Footer from "@/components/blogPage/Footer";
// import Header from "@/components/blogPage/Header";
import Hero from "@/components/blogPage/Hero";
import LatestPosts from "@/components/blogPage/LatestPosts";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
import { useAuthStore } from "@/store/useAuthStore";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import type { Post } from "../Admin/BlogPosts";
import BlogLayout from "@/components/layouts/BlogLayout";

const LandingPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  // const { authFormOpen, setAuthFormOpen } = useAuthStore();
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
  };

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
        withCredentials: true,
      });

      await setUser();
      console.log(response.data);
    } catch (error) {
      // setUser(null);
      console.log("Error while fetching user profile");
    } finally {
      console.log(user);
    }
  };

  useEffect(() => {
    fetchProfile();
    //fetchPosts(1);
  }, []);

  return (
    <BlogLayout>
      <main>
        <Hero />
        <LatestPosts posts={posts} />
      </main>

      {/*<Dialog open={authFormOpen} onOpenChange={setAuthFormOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-stone-100 dark:bg-zinc-900">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-center text-foreground text-2xl font-playfair">
              Papertrails
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            <AuthForm />
          </div>
        </DialogContent>
      </Dialog>*/}
    </BlogLayout>
  );
};

export default LandingPage;
