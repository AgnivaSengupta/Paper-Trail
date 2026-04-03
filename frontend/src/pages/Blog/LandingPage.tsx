import Hero from "@/components/blogPage/Hero";
import LatestPosts from "@/components/blogPage/LatestPosts";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import BlogLayout from "@/components/layouts/BlogLayout";

const LandingPage = () => {
  const { refreshUser } = useAuthStore();

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  return (
    <BlogLayout>
      <main>
        <Hero />
        <LatestPosts />
      </main>
    </BlogLayout>
  );
};

export default LandingPage;
