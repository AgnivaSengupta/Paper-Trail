import DOMPurify from "dompurify";
import BlogNavbar from "@/components/layouts/BlogNavbar";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom"; // Changed from useLocation
import BlogLayout from "@/components/layouts/BlogLayout";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import Comment from "@/components/blogPage/Comment";
import { buildTrees, type IComment } from "@/utils/treeBuilder";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
        <h1
          className="
          col-start-2 col-span-full mr-4 row-start-3 row-span-auto z-10
          flex items-end pb-4
          font-primary italic text-5xl md:text-7xl lg:text-9xl text-black leading-none break-words
        "
        >
          {title}
        </h1>

        {/* AUTHOR BOX - Made responsive positioning */}
        <div
          className="
          col-start-2 col-span-12 row-start-[10] row-span-2
          flex items-center z-10 mb-4
        "
        >
          <div
            className="
            relative w-full flex items-center gap-3 px-3 py-2
            border-2 border-gray-600 bg-white/90
          "
          >
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
        <div
          className="
          col-start-14 col-span-10 row-start-[10] row-span-2
          flex items-center pl-4 z-10 mb-4
          text-sm md:text-xl font-primary text-gray-800 bg-white/50
        "
        >
          {date && <span>Date: {new Date(date).toLocaleDateString()}</span>}
        </div>
      </div>
    </div>
  );
};

const BlogPage = () => {
  // 1. Consolidated State
  const [post, setPost] = useState(null);
  const [blogLoading, setBlogLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [blogError, setBlogError] = useState(null);
  // const [commentsError, setCommentsError] = useState(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [rootComment, setRootComment] = useState("");

  // 2. Use useParams for robust routing
  // Assumes your route is defined like <Route path="/blog/:slug" ... />
  const { slug } = useParams();
  const navRef = useRef(null);

  // -------------------------------------------
  // 1. Fetch Blog Post (Critical Path)
  // -------------------------------------------
  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      setBlogLoading(true);
      try {
        const response = await axiosInstance(
          API_PATHS.POST.GET_POST_BY_SLUG(slug),
        );
        setPost(response.data);
      } catch (err) {
        console.error("Blog Fetching failed", err);
        setBlogError("Could not load blog post.");
      } finally {
        setBlogLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // -------------------------------------------
  // 2. Fetch Comments (Dependent Path)
  // Only runs when 'post._id' is available
  // -------------------------------------------
  useEffect(() => {
    // Guard clause: Don't run if post isn't loaded yet
    if (!post?._id) return;

    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const response = await axiosInstance.get(
          API_PATHS.COMMENTS.GET_COMMENT_BY_POST(post._id),
        );
        setComments(response.data);
      } catch (error) {
        // Log error but DO NOT set global error state
        console.error("Failed to load comments", error);
        // Optional: set a specific 'commentError' state if you want to show a message in the comment section
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [post?._id]);

  const handleReply = async (parentComment: string | null, content: string) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.COMMENTS.ADD_COMMENT(post._id),
        {
          content,
          post,
          parentComment,
        },{
          withCredentials: true,
        }
      );
      setComments((prev) => [...prev, response.data]);
    } catch (error) {
      alert("Failed to add comment");
    }
  };

  const commentTree = useMemo(() => buildTrees(comments), [comments]);

  if (blogLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (blogError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {blogError}
      </div>
    );
  if (!post) return null;

  return (
    <BlogLayout>
      {/* Main Container - Changed fixed width to max-w */}
      <div className="dot-grid">
        {/*<div className="pt-10">*/}
        {/*<GridHeader
            title={post.title}
            authorName={post.author?.name}
            authorImage={post.author?.profilePic}
            date={post.updatedAt}
          />*/}

        <div className="container mx-auto pt-28">
          <div
            className="h-[241px] my-5 py-6 px-12 flex flex-col gap-6"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--grid-color)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--grid-color)) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          >
            <h1 className="font-primary italic text-[clamp(1.5rem,4vw,7rem)]">
              {post.title}
            </h1>

            <div className="flex gap-5 items-center">
              <div className="flex gap-3 py-[8px] px-[9px] w-fit bg-background border-1">
                <Avatar className="bg-zinc-400">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-primary tracking-wider">
                  {post.author.name}
                </h2>
              </div>

              <div>
                <h2 className="text-xl font-primary tracking-wider">
                  {"Date: " + post.updatedAt}
                </h2>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-center">
            {/* Cover Image - Fallback logic added */}
            {/*<div className="w-full mb-10">
              <img
                src={post.coverImageUrl || "/stock-1.jpeg"}
                alt="Cover"
                className="w-full h-[400px] md:h-[700px] object-cover rounded-2xl shadow-sm"
              />
            </div>*/}

            {/* Text Section Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12 w-full mx-auto mt-5">
              {/* Sidebar (Table of Contents) */}
              {/* Hidden on mobile (lg:block), visible on desktop */}
              <aside className="hidden lg:block border-r border-gray-400 pr-6 h-fit sticky top-32">
                <nav className="flex flex-col space-y-4 font-primary text-xl text-gray-500">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Contents
                  </span>
                  {/* TODO: These links are static.
                      Ideally, you parse `post.content.html` to generate these dynamically.
                  */}
                  <a href="#" className="hover:text-black">
                    Introduction
                  </a>
                </nav>
              </aside>

              {/* Main Content */}
              <div className="space-y-10 font-primary w-full max-w-[90vw] overflow-hidden">
                <div
                  id="blog-content"
                  className="tiptap-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.content?.html || ""),
                  }}
                />
              </div>
            </div>

            <div className="w-full mx-auto py-8 mt-20">
              <h3 className="text-2xl font-primary font-bold mb-4">
                Comments ({comments.length})
              </h3>

              {/* Global Reply Input (Top level) */}
              <div className="mb-8 flex gap-4">
                <Avatar className="w-10 h-10">
                  {/* Use current user's profile pic if available */}
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                
                <div className="flex-grow">
                  <Textarea
                    value={rootComment}
                    onChange={(e) => setRootComment(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="w-full p-3 text-lg min-h-[80px] resize-y"
                  />
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={() => {
                        if (!rootComment.trim()) return;
                        handleReply(null, rootComment); // null parentId = root comment
                        setRootComment("");
                      }}
                      className="px-4 py-2 cursor-pointer bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50"
                      disabled={!rootComment.trim()}
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Specific loading indicator for comments */}
              {commentsLoading ? (
                <div className="text-gray-500 text-sm">
                  Loading discussion...
                </div>
              ) : (
                <>
                  {/* Global Reply Input */}
                  {/* ... */}

                  {/* Render Tree */}
                  {commentTree.map((root) => (
                    <Comment
                      key={root._id}
                      comment={root}
                      onReply={handleReply}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogPage;
