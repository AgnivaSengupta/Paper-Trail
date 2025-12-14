import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  Eye,
  Heart,
  PenTool,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  mockPosts,
  // mockTrendingPosts,
  mockStats,
  // mockCategories,
} from "./mock";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AuthForm from "@/components/auth/AuthForm";
import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { useNavigate } from "react-router-dom";
import BlogNavbar from "@/components/layouts/BlogNavbar";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const BlogLandingPage = () => {
  const { authFormOpen, setAuthFormOpen } = useAuthStore();
  const blogSectionRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // const [posts, setPosts] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");

  gsap.registerPlugin(useGSAP);
  const navRef = useRef(null);

  useGSAP(() => {
    if (!navRef.current) return;

    gsap.from(navRef.current, {
      scaleX: 0,
      opacity: 0,
      duration: 1,
      delay: 0.35,
      ease: "power3.out",
    });
  }, []);

  const navigate = useNavigate();

  const handleScrollToBlogs = () => {
    blogSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
          withCredentials: true,
        });

        setUser(response.data);
      } catch (error) {
        setUser(null);
      }
    };

    fetchProfile();
  }, [setUser]);

  console.log(user);
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-center items-center w-full sticky top-0 z-50 h-28">
        <BlogNavbar ref={navRef} />
      </div>

      {/* Hero Section */}
      <section className="relative mt-10 py-10 px-10 sm:px-6 lg:px-26 flex justify-between">
        <div className="max-w-5xl text-left">
          {/*<div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4 mr-2" />
            Join {mockStats.totalAuthors}+ writers in our community
          </div>*/}
          <h1 className="text-9xl font-primary text-foreground mb-4 leading-tight">
            A Journal
            <br />
            of Ideas,
            <br />
            Open to all
          </h1>
          <p className="text-3xl font-primary text-muted-foreground mb-12 leading-snug max-w-2xl ">
            A minimal space where I share my thoughts, projects, <br />
            and daily learnings — and where you can share yours too.
          </p>

          {/*<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90  text-foreground focus-visible:ring-ring cursor-pointer px-8 text-base h-12"
              onClick={() => {
                const element = document.getElementById("PostsSection");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Start Reading
            </Button>
            <Button
              size="lg"
              className="px-8 h-12 text-base bg-secondary hover:bg-secondary/80 focus-visible:ring-ring text-secondary-foreground cursor-pointer"
              onClick={() => {
                if (user) {
                  navigate("/admin/create");
                } else {
                  setAuthFormOpen(true);
                }
                console.log(user);
              }}
            >
              <PenTool className="w-5 h-5 mr-2" />
              Write Your Story
            </Button>
          </div>*/}
        </div>

        <div>
          {/*Animation part -- to be done later .... */}
          <img src="Animation-1.png" width={1200} />
        </div>
      </section>

      <section id="PostsSection" className="py-15 px-4 sm:px-6 lg:px-26">
        <div className="relative max-w-7xl flex flex-col min-w-full">
          <div className="mb-12">
            <h2 className="text-5xl text-foreground font-primary">
              Latest Posts
            </h2>
          </div>

          <div className="w-full flex justify-center">
            <img src="stock-1.jpeg" height={700} width={1300} />
          </div>
        </div>

        <div className="w-full flex justify-center mt-15">
          <Button className="bg-secondary rounded-sm hover:bg-secondary/80 text-secondary-foreground cursor-pointer">
            Load more
          </Button>
        </div>
      </section>

      {/* footer */}
      <footer className="bg-[#1a1a1a] text-white py-16 px-4 sm:px-6 lg:px-8 text-base">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-5 h-5 text-white" />
                <h3 className="text-xl font-bold">PaperTrail</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Where personal stories become community wisdom. Join thousands
                of writers sharing their experiences.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Latest Posts
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Trending
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Authors
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Write
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PaperTrail. All rights reserved.</p>
          </div>
        </div>
      </footer>

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

export default BlogLandingPage;
