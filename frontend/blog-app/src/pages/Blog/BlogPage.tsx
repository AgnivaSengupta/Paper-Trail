import DOMPurify from "dompurify";
import BlogNavbar from "@/components/layouts/BlogNavbar";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"; // Changed from useLocation

// Import styles...
// import "@/styles/BlogPageStyles.css";

// --- Components ---

const GridHeader = ({ title, authorName, authorImage, date }) => {
  return (
    // Changed fixed width to responsive container
    <div className="flex justify-center w-full px-4 mb-7">
      <div
        className="
          relative w-full max-w-[1500px] min-h-[300px]
          bg-white rounded-xl border border-gray-300 overflow-hidden
          
          /* Grid Pattern */
          bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)]
          bg-[size:24px_24px]
          
          /* CSS Grid Layout */
          grid
          grid-cols-[repeat(auto-fill,24px)]
          grid-rows-[repeat(auto-fill,24px)]
        "
      >
        {/* TITLE */}
        <h1 className="
          col-start-2 col-span-full mr-4 row-start-3 row-span-auto z-10
          flex items-end pb-4
          font-primary italic text-5xl md:text-7xl lg:text-9xl text-black leading-none break-words
        ">
          {title}
        </h1>

        {/* AUTHOR BOX - Made responsive positioning */}
        <div className="
          col-start-2 col-span-12 row-start-[10] row-span-2
          flex items-center z-10 mb-4
        ">
          <div className="
            relative w-full flex items-center gap-3 px-3 py-2
            border-2 border-gray-600 bg-white/90
          ">
            {/* Decorative Crosshairs */}
            <div className="absolute -top-1 -left-[2px] w-[2px] h-2 bg-gray-600"></div>
            <div className="absolute -top-1 -right-[2px] w-[2px] h-2 bg-gray-600"></div>
            <div className="absolute -bottom-1 -left-[2px] w-[2px] h-2 bg-gray-600"></div>
            <div className="absolute -bottom-1 -right-[2px] w-[2px] h-2 bg-gray-600"></div>

            {/* Avatar */}
            {authorImage && (
              <div className="w-7 h-7 rounded-full border border-black overflow-hidden flex-shrink-0">
                <img
                  src={authorImage}
                  alt={authorName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <span className="font-primary text-sm md:text-xl tracking-wider font-bold text-gray-800 whitespace-nowrap">
              {authorName}
            </span>
          </div>
        </div>

        {/* DATE */}
        <div className="
          col-start-14 col-span-10 row-start-[10] row-span-2
          flex items-center pl-4 z-10 mb-4
          text-sm md:text-xl font-primary text-gray-800 bg-white/50
        ">
          {date && <span>Date: {new Date(date).toLocaleDateString()}</span>}
        </div>
      </div>
    </div>
  );
};

const BlogPage = () => {
  // 1. Consolidated State
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Use useParams for robust routing
  // Assumes your route is defined like <Route path="/blog/:slug" ... />
  const { slug } = useParams(); 
  const navRef = useRef(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance(
            // Ensure this API path handles the slug correctly
            API_PATHS.POST.GET_POST_BY_SLUG(slug) 
        );
        setPost(response.data);
      } catch (err) {
        console.error("Blog Fetching failed", err);
        setError("Could not load blog post.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Header */}
      <div className="flex justify-center items-center w-full sticky top-0 z-50 h-28 bg-background/90 backdrop-blur">
        <BlogNavbar ref={navRef} />
      </div>

      {/* Main Container - Changed fixed width to max-w */}
      <div className="w-full max-w-[1500px] px-4">
        
        <GridHeader 
          title={post.title} 
          authorName={post.author?.name} 
          authorImage={post.author?.profilePic} 
          date={post.updatedAt}
        />
        
        <div className="w-full flex flex-col items-center">
          {/* Cover Image - Fallback logic added */}
          <div className="w-full mb-10">
            <img
              src={post.coverImageUrl || "/stock-1.jpeg"} 
              alt="Cover"
              className="w-full h-[400px] md:h-[700px] object-cover rounded-2xl shadow-sm"
            />
          </div>

          {/* Text Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12 w-full mx-auto mt-5">
            
            {/* Sidebar (Table of Contents) */}
            {/* Hidden on mobile (lg:block), visible on desktop */}
            <aside className="hidden lg:block border-r border-gray-400 pr-6 h-fit sticky top-32">
              <nav className="flex flex-col space-y-4 font-primary text-xl text-gray-500">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Contents</span>
                 {/* TODO: These links are static. 
                    Ideally, you parse `post.content.html` to generate these dynamically.
                 */}
                 <a href="#" className="hover:text-black">Introduction</a>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="space-y-10 font-primary w-full max-w-[90vw] overflow-hidden">
              <div
                id="blog-content"
                className="blog-content prose prose-lg max-w-none" 
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(post.content?.html || "") 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;