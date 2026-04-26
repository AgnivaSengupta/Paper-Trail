import BlogLayout from "@/components/layouts/BlogLayout";
import TableOfContents from "@/components/blogPage/TableOfContents";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import TiptapRenderer from "@/components/blogPage/TiptapRenderer";
import { buildTrees, type IComment } from "@/utils/treeBuilder";
import { Textarea } from "@/components/ui/textarea";
import Comment from "@/components/blogPage/Comment";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { ScrollTracker } from "@/components/analytics/ScrollTracker";
import { useAuthStore } from "@/store/useAuthStore";
import ShareButtons from "@/components/blogPage/ShareButtons";
import type { Post } from "@/types/domain";
import formatDate from "@/utils/dateFormatter";
import SkeletonLoader from "@/components/blogPage/SkeletonLoader";

const BlogPage = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [blogLoading, setBlogLoading] = useState<boolean>(true);
  const [blogError, setBlogError] = useState<null | string>(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const [rootComment, setRootComment] = useState("");
  const { slug } = useParams();
  const {user, setAuthFormOpen} = useAuthStore();

  const { trackEvents } = useAnalytics(post?._id, user?._id, post?.author?._id);

  useEffect(() => {
    if (post?._id) {
      trackEvents('page_view', {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        // title: post?.title
      });
    }
  }, [post?._id, trackEvents]);


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
        // console.log(response.data.content);
      } catch (err) {
        console.error("Blog Fetching failed", err);
        setBlogError("Could not load blog post.");
      } finally {
        setBlogLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  // fetching comments ....
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
    if (!post) return;
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
      // console.log("Error: ", error);
      // alert("Failed to add comment");
      setAuthFormOpen(true);
    }
  }

  if (blogLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/*Loading...*/}
        <SkeletonLoader/>
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
        
        <div className="flex flex-col gap-4">
          {/* Title section */}
          <div className="min-h-[193px] mt-10 py-6 px-12 flex flex-col gap-6">
            <h1 className="font-primary italic text-[clamp(1.5rem,3vw,4rem)]">
              {post.title}
            </h1>
  
            <div className="flex gap-5 items-center justify-between">
              
              <div className="flex gap-2 items-center">
                <span className="text-base font-primary tracking-wider">by: </span>
                
                <div className="flex gap-3 py-[3px] px-[4px] w-fit bg-background border-1 items-center">
                  <Avatar className="">
                    <AvatarImage src={post.author?.profilePic || ""} className="rounded-full object-cover" />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-lg font-primary tracking-wider">
                    {post.author.name}
                  </h2>
                </div>
              </div>
  
              <div>
                <h2 className="text-lg font-primary tracking-wider">
                  {"Date: " + formatDate(post.updatedAt)}
                </h2>
              </div>
            </div>
          </div>
  
          {post.coverImageUrl && (
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
          )}
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
              authorImage={post.author.profilePic ?? undefined}
              publishDate={post.updatedAt}
              readTime="15 min read"
            />
            <div className="h-0.25 w-full bg-black/20"></div>
            {/* Comments section */}
            <div className="flex item-center gap-3 mt-10">
              <MessageSquare className="w-5 h-5 translate-y-1.5" />
              <h3 className="text-2xl font-primary font-bold mb-4">
                Comments ({comments.length})
              </h3>
            </div>

            <div className="mb-8 p-6 rounded-lg border bg-white dark:bg-zinc-900">
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
                      className="px-4 py-2 cursor-pointer bg-black dark:bg-slate-100 text-white dark:text-black text-sm font-bold rounded hover:bg-gray-800 disabled:opacity-50"
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

export default BlogPage;
