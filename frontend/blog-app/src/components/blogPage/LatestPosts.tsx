import { useState } from "react";
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
// import { mockPosts } from "../data/mockPosts";

const POSTS_PER_PAGE = 6;

interface Post {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  coverImage: string;
}

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Building a Minimal Design System",
    excerpt: "Exploring the fundamentals of creating cohesive visual languages that scale across products and teams.",
    author: "Alex Chen",
    date: "Dec 24, 2025",
    category: "Design",
    readTime: "5 min",
    coverImage: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop",
  },
  {
    id: "2",
    title: "The Art of Technical Writing",
    excerpt: "How to communicate complex ideas simply, with clarity and precision that respects the reader's time.",
    author: "Sarah Mitchell",
    date: "Dec 22, 2025",
    category: "Writing",
    readTime: "8 min",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop",
  },
  {
    id: "3",
    title: "React Patterns I Use Daily",
    excerpt: "A collection of patterns and practices that have stood the test of time in production applications.",
    author: "James Rodriguez",
    date: "Dec 20, 2025",
    category: "Engineering",
    readTime: "12 min",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
  },
  {
    id: "4",
    title: "Notes on Learning in Public",
    excerpt: "Why sharing your journey, mistakes and all, accelerates growth and builds genuine connections.",
    author: "Maya Patel",
    date: "Dec 18, 2025",
    category: "Thoughts",
    readTime: "4 min",
    coverImage: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&h=600&fit=crop",
  },
  {
    id: "5",
    title: "Sketch-First Development",
    excerpt: "Starting with pen and paper before touching code. An old practice that still yields surprising results.",
    author: "Tom Wilson",
    date: "Dec 15, 2025",
    category: "Process",
    readTime: "6 min",
    coverImage: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=600&fit=crop",
  },
  {
    id: "6",
    title: "Understanding TypeScript Generics",
    excerpt: "Demystifying one of TypeScript's most powerful features through practical, real-world examples.",
    author: "Lisa Chen",
    date: "Dec 12, 2025",
    category: "Engineering",
    readTime: "10 min",
    coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop",
  },
  {
    id: "7",
    title: "The Notebook Method",
    excerpt: "A simple system for capturing ideas, tracking progress, and maintaining clarity in creative work.",
    author: "David Kim",
    date: "Dec 10, 2025",
    category: "Productivity",
    readTime: "7 min",
    coverImage: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=600&fit=crop",
  },
  {
    id: "8",
    title: "CSS Grid: Beyond the Basics",
    excerpt: "Advanced layout techniques that unlock the full potential of CSS Grid for complex interfaces.",
    author: "Emma Stone",
    date: "Dec 8, 2025",
    category: "Engineering",
    readTime: "9 min",
    coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=600&fit=crop",
  },
  {
    id: "9",
    title: "Digital Minimalism in Practice",
    excerpt: "Practical strategies for reducing noise and focusing on what matters in our hyper-connected world.",
    author: "Chris Park",
    date: "Dec 5, 2025",
    category: "Thoughts",
    readTime: "6 min",
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop",
  },
  {
    id: "10",
    title: "Building in the Open",
    excerpt: "The benefits and challenges of transparent development, from side projects to production apps.",
    author: "Nina Sharma",
    date: "Dec 3, 2025",
    category: "Process",
    readTime: "5 min",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
  },
  {
    id: "11",
    title: "API Design Principles",
    excerpt: "Creating interfaces that developers love to use. Lessons learned from years of building APIs.",
    author: "Mark Johnson",
    date: "Dec 1, 2025",
    category: "Engineering",
    readTime: "11 min",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
  },
  {
    id: "12",
    title: "The Power of Constraints",
    excerpt: "How limitations spark creativity and lead to more focused, elegant solutions.",
    author: "Anna Lee",
    date: "Nov 28, 2025",
    category: "Design",
    readTime: "4 min",
    coverImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&h=600&fit=crop",
  },
];


const LatestPosts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(mockPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = mockPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          {currentPosts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index}/>
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
