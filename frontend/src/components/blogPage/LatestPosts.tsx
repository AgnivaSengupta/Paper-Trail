import { useEffect, useState } from "react";
// import { mockPosts } from "";
import PostCard from "./PostCard";
import AnimatedSection from "./AnimatedSection";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
// import { mockPosts } from "../data/mockPosts";
import type { Post } from "../../pages/Admin/BlogPosts";

const POSTS_PER_PAGE = 6;

// interface Post {
//   id: string;
//   title: string;
//   excerpt: string;
//   author: string;
//   date: string;
//   category: string;
//   readTime: string;
//   coverImage: string;
// }

const LatestPosts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  //const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  //const totalPages = Math.ceil(mockPosts.length / POSTS_PER_PAGE);
  // const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  // const endIndex = startIndex + POSTS_PER_PAGE;
  // const currentPosts = mockPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchPosts(page);
      document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchPosts = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.POST.GET_ALL_POSTS, {
        params: {
          status: 'published',
          page: pageNumber,
          limit: 5,
        },
      });
      
      const { posts, page, totalPages } = response.data;
      
      setPosts(posts);
      setCurrentPage(page);
      setTotalPages(totalPages);
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

  useEffect(() => {
    fetchPosts(1);
  }, [])
  
  return (
    <section id="posts" className="py-24 grid-paper min-h-screen">
      <div className="container max-w-6xl px-6 mx-auto">
        {/* Section header with annotations */}
        <AnimatedSection className="mb-16 relative">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-xs text-muted-foreground">02.</span>
            <h2 className="font-sketch text-4xl sm:text-5xl font-bold">Latest Posts</h2>
          </div>
          <div className="font-sketch text-lg text-muted-foreground mt-2 ml-8 italic">
            → recent writings & thoughts
          </div>
          
          {/* Technical annotation */}
          <div className="absolute -right-4 top-0 hidden lg:block">
            <span className="font-mono text-xs text-muted-foreground rotate-90 inline-block origin-left">
              SECTION_02
            </span>
          </div>
        </AnimatedSection>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {posts.map((post, index) => (
            <PostCard key={post._id} post={post} index={index}/>
          ))}
        </div>

        {/* Pagination */}
        <AnimatedSection className="flex flex-col items-center gap-4">
          <Pagination>
            <PaginationContent className="font-mono">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          
          {/* Page indicator annotation */}
          <span className="font-sketch text-muted-foreground italic">
            page {currentPage} of {totalPages}
          </span>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default LatestPosts;
