import BlogLayout from "@/components/layouts/BlogLayout";
import TableOfContents from "@/components/blogPage/TableOfContents";
import BlogContent from "@/components/blogPage/BlogContent";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MessageSquare, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import TiptapRenderer from "@/components/blogPage/TiptapRenderer";
import { buildTrees, type IComment } from "@/utils/treeBuilder";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Comment from "@/components/blogPage/Comment";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { useActiveTimer } from "@/hooks/analytics/useActiveTimer";
import { ScrollTracker } from "@/components/analytics/ScrollTracker";
import { useAuthStore } from "@/store/useAuthStore";
import ShareCard from "@/components/ShareCard";
import ShareButtons from "@/components/blogPage/ShareButtons";

const tocItems = [
  { id: "introduction", title: "Introduction", level: 2 },
  { id: "cors-policy", title: 'CORS "Read" Policy', level: 2 },
  { id: "implementation", title: "Implementation Details", level: 3 },
  { id: "math-example", title: "Mathematical Notation", level: 2 },
  { id: "best-practices", title: "Best Practices", level: 2 },
  { id: "conclusion", title: "Conclusion", level: 2 },
];

const BlogPage2 = () => {
  const [post, setPost] = useState(null);
  const [blogLoading, setBlogLoading] = useState<boolean>(true);
  const [blogError, setBlogError] = useState<null | string>(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const [rootComment, setRootComment] = useState("");
  const { slug } = useParams();
  const navRef = useRef(null);

  const {user} = useAuthStore();

  // const { json } = useEditorStore();

  const { trackEvents } = useAnalytics(post?._id, user?._id, post?.author._id);
  // useActiveTimer(trackEvents, post?._id);

  useEffect(() => {
    if (post?._id) {
      trackEvents('page_view', {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        // title: post?.title
      });
    }
  }, [post?._id]);


  //Post Content Fetching ....
  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      setBlogLoading(true);
      try {
        const response = await axiosInstance(
          API_PATHS.POST.GET_POST_BY_SLUG(slug),
        );
        setPost(response.data);
        console.log(response.data.content);
      } catch (err) {
        console.error("Blog Fetching failed", err);
        setBlogError("Could not load blog post.");
      } finally {
        setBlogLoading(false);
      }
    };
    // console.log(post.content?.html);
    fetchBlog();
  }, []);

  useEffect(() => {
    if (!post?._id) return;

    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const response = await axiosInstance.get(API_PATHS.COMMENTS.GET_COMMENT_BY_POST(post._id));
        setComments(response.data);
      } catch (error) {
        console.log("Failed to load comments", error);
      } finally {
        setCommentsLoading(false);
      }
    }

    fetchComments();
  }, [post?._id]);


  const commentTree = useMemo(() => buildTrees(comments), [comments]);

  const handleReply = async (parentComment: string | null, content: string) => {
    try {
      const response = await axiosInstance.post(API_PATHS.COMMENTS.ADD_COMMENT(post._id),
      {
        content,
        post,
        parentComment,
      }, {
        withCredentials: true,
      }
    );

    setComments((prev) => [...prev, response.data]);
    } catch (error) {
      alert("Failed to add comment");
    }
  }

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
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Title section */}
        <div
          className="h-[193px] my-12 py-6 px-12 flex flex-col gap-6"
          style={{
            backgroundImage: `linear-gradient(hsl(235 0% 40.2% / 0.8) 1px, transparent 1px),
                linear-gradient(90deg, hsl(235 0% 40.2% / 0.8) 1px, transparent 1px)`,
            backgroundSize: "22px 24px",
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

        <div
          className="mb-12 rounded-lg overflow-hidden border border-border animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <img
            src={post.coverImageUrl || "/stock-1.jpeg"}
            alt="Blog hero"
            className="w-full h-auto object-cover aspect-[21/9]"
          />
        </div>

        <div className="flex gap-8 lg:gap-16">
          {/* Table of Contents - Desktop */}
          <aside
            className="hidden lg:block w-52 shrink-0 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <TableOfContents content={post.content.json}/>
          </aside>

          {/* Main Content */}
          <div
            className="flex-1 min-w-0 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {/* <BlogContent /> */}
            {/*<div
              id="blog-content"
              className="prose-doc"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.content?.html || ""),
              }}
            />*/}

            <div className="relative">

              {post && <ScrollTracker trackEvents={trackEvents} postId={post._id}/>}

              <article className="prose-docs">
                {/* <BlogContent /> */}
                <TiptapRenderer content={post.content.json} />
              </article>
            </div>

            {/* <ShareCard/> */}
            <ShareButtons
              title={post.title}
              description="A comprehensive guide to setting up cross-origin resource sharing for secure API communication."
              author={post.author.name}
              authorImage={post.author.profilePic}
              publishDate={post.updatedAt}
              readTime="15 min read"
              category="Web Development"
            />
            <div className="h-0.25 w-full bg-black/20"></div>
            {/* Comments section */}
            <div className="flex item-center gap-3 mt-10">
              <MessageSquare className="w-5 h-5 translate-y-1.5" />
              <h3 className="text-2xl font-primary font-bold mb-4">
                Comments ({comments.length})
              </h3>
            </div>

            <div className="mb-8 p-6 rounded-lg border bg-white">
              <h2 className="text-xl font-primary mb-5">Leave a comment</h2>
              <div className="flex item-center gap-4">

                <div className="flex-grow">
                  <Textarea
                    value={rootComment}
                    onChange={(e) => setRootComment(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="w-full p-3 text-lg min-h-[80px] resize-y bg-background"
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => {
                        if (!rootComment.trim()) return;
                        handleReply(null, rootComment); // null parentId = root comment
                        setRootComment("");
                      }}
                      className="px-4 py-2 cursor-pointer bg-black text-white text-sm font-bold rounded hover:bg-gray-800 disabled:opacity-50"
                      disabled={!rootComment.trim()}
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
                
              </div>
            </div>

            {commentsLoading ? (
              <div className="text-gray-500 text-sm">
                Loading discussions...
              </div>
            ): (
              <>
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
          <div>

          </div>
        </div>
      </main>
    </BlogLayout>
  );
};

export default BlogPage2;
