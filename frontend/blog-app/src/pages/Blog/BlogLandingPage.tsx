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
import GridComponent from "@/components/blogPage/GridComponent";
// import BlogCard from "@/components/blogPage/BlogCard";
import type { Post, Author } from "../Admin/BlogPosts";


const blogPosts = [
  {
    id: "1",
    title: "Scaling Real-Time Chat Applications with Go and React",
    excerpt: "A deep dive into handling thousands of concurrent WebSocket connections, managing state, and ensuring message delivery in a distributed system.",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60", // Real image
    tags: ["System Design", "Go", "React Native"],
    author: "Alex Dev",
    publishedAt: "2025-12-19T10:00:00Z",
    clampLines: 3
  },
  {
    id: "2",
    title: "Understanding Interrupts in 8085 Microprocessors",
    excerpt: "Breaking down how hardware and software interrupts work, masking techniques, and writing efficient assembly code for legacy architecture.",
    coverImage: null, // Test case: Needs your default illustration
    tags: ["Assembly", "Hardware", "CS Fundamentals"],
    author: "Sarah Chips",
    publishedAt: "2025-11-20T14:30:00Z",
    clampLines: 2
  },
  {
    id: "3",
    title: "Getting Started with GSoC 2026: A Contributor's Guide",
    excerpt: "Google Summer of Code is approaching. Here is how to pick an organization, read a codebase, and make your first meaningful pull request.",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
    tags: ["Open Source", "Career", "GSoC"],
    author: "Alex Dev",
    publishedAt: "2025-12-18T09:15:00Z",
    clampLines: 4
  },
  {
    id: "4",
    title: "ESP32-S3 vs Arduino: Which one for your next IoT Project?",
    excerpt: "Comparing power consumption, Wi-Fi capabilities, and processing speed. Why I switched my home automation setup to ESP32.",
    coverImage: null, // Test case: Needs your default illustration
    tags: ["IoT", "Embedded Systems", "Electronics"],
    author: "Maker Mike",
    publishedAt: "2025-10-05T11:00:00Z",
    clampLines: 3
  },
  {
    id: "5",
    title: "Visualizing Pathfinding Algorithms: Dijkstra vs A*",
    excerpt: "An interactive look at how graph algorithms traverse nodes. We explore time complexity and real-world mapping use cases.",
    coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
    tags: ["Algorithms", "Data Structures", "Math"],
    author: "Sarah Chips",
    publishedAt: "2025-11-15T16:45:00Z",
    clampLines: 3
  }
];

const BlogLandingPage = () => {
  const { authFormOpen, setAuthFormOpen } = useAuthStore();
  const blogSectionRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const [loading, setLoading] = useState<boolean>(false);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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
    } catch (error) {
      setUser(null);
    }
  };
  
  useEffect(() => {
    fetchProfile();
    fetchPosts(1);
  }, []);

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
  
  const excerpt = "An interactive look at how graph algorithms traverse nodes. We explore time complexity and real-world mapping use cases."

  return (
    <div className="min-h-screen  bg-white">
      {/*<div className="border-1 max-w-[2400px]">*/}
        {/* Header */}
        <div className="flex justify-center items-center w-full sticky top-0 z-50 h-28">
          <BlogNavbar ref={navRef} />
        </div>

        {/* Hero Section */}
        <section className="relative mt-10 py-10 px-15 sm:px-6 lg:px-36 flex justify-center items-center">
          <div className="w-full max-w-[2100px] flex items-center justify-between">          
            <div className="text-left">
              <h1 className="text-9xl font-primary text-foreground mb-4 leading-tight">
                A Journal
                <br />
                of Ideas,
                <br />
                Open to all
              </h1>
  
              <p className="text-3xl font-primary text-muted-foreground mb-12 leading-snug max-w-2xl">
                A minimal space where I share my thoughts, projects, <br />
                and daily learnings — and where you can share yours too.
              </p>
            </div>
  
            <div className="flex justify-center items-center">
              <GridComponent />
            </div>
          </div>
        </section>
        
        {/* Post section */}
        <section id="PostsSection" className="py-15 px-4 sm:px-6 lg:px-26 flex flex-col items-center">
          <div className="relative w-full max-w-[2100px] flex flex-col">
            <div className="mb-12 ml-10">
              <h2 className="text-5xl text-foreground font-primary">
                Latest Posts
              </h2>
            </div>

            <div className="w-full flex justify-center">
              {/*<img src="stock-1.jpeg" height={700} width={1300} />*/}
              {/*<div className="grid grid-cols-4 gap-12 justify-items-center max-w-[1700px]">
                {posts.map((blog) => (
                  <BlogCard 
                    key={blog._id}
                    title={blog.title}
                    author={blog.author.name}
                    // publishedAt={Date(blog.updatedAt)}
                    tags={blog.tags[0]}
                    coverImage={'Default-cover.png'}
                    excerpt={excerpt}
                    clampLines={2}
                  />
                ))}
              </div>*/}

            </div>
          </div>

          <div className="w-full flex justify-center mt-15">
            <Button className="bg-secondary rounded-sm hover:bg-secondary/80 text-secondary-foreground cursor-pointer">
              Load more
            </Button>
          </div>
        </section>

        {/* footer */}
        <footer className=" bg-[#1a1a1a] text-white py-16 px-4 sm:px-6 lg:px-8 text-base">
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
      {/*</div>*/}
    </div>
  );
};

export default BlogLandingPage;
