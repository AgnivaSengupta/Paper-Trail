// import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
// import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { Delete, Eye, Heart, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Test from "./Test";

type Author = {
  name: string;
  profilePic: string;
};

type Post = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImageUrl?: string | null;
  tags: string[];
  author: Author;
  isDraft: boolean;
  views: number;
  likes: number;
  generatedByAi: boolean;
  createdAt: string;
  updatedAt: string;
};

const Count = ({ value }: { value: number }) => {
  return (
    <div className="bg-black flex justify-center items-center h-5 w-5 rounded-full">
      <h1 className="text-white text-xs">{value}</h1>
    </div>
  );
};

const BlogTableRow = ({
  title,
  views,
  likes,
  slug,
}: {
  title: string;
  views: number;
  likes: number;
  slug: string;
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-auto h-30 border-b-1 border-gray-500 flex items-center gap-5 px-5 py-2 hover:bg-white/20 cursor-pointer font-munoch"
      onClick={() => navigate(`/${slug}`)}
    >
      <div className="w-30 h-20 bg-gray-100 rounded-lg"></div>
      <div className="w-full h-25 flex flex-col justify-center gap-3 p-2">
        <h1 className="text-xl">{title}</h1>
        <div className="flex gap-5">
          <div className="flex justify-center items-center text-sm px-2 bg-white rounded-sm text-foreground shadow-lg">
            Updated 11/09/2025
          </div>
          <Button
            size="sm"
            className="text-sm bg-green-300/10 text-green-500 hover:bg-green-300/10 shadow-green-500 shadow-lg"
          >
            <Eye />
            {views} Views
          </Button>
          <Button
            size="sm"
            className="text-sm bg-red-400/10 text-red-600 hover:bg-red-400/10 shadow-lg shadow-red-600"
          >
            <Heart />
            {likes} Likes
          </Button>
        </div>
      </div>

      <div>
        <Trash2 className="w-5 h-5"/>
      </div>
    </div>
  );
};

const BlogPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [counts, setCounts] = useState({ all: 0, published: 0, draft: 0 });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");

  const getAllPosts = async (pageNumber = 1, reset = false) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.POST.GET_ALL_POSTS, {
        params: {
          status: status.toLowerCase(),
          page: pageNumber,
        },
      });

      const { posts: newPosts, totalPages, counts } = response.data;

      setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
      setTotalPages(totalPages);
      setCounts(counts);
    } catch (error) {
      console.error("Error fetching posts: ", error);
    } finally {
      setLoading(false);
    }
  };

  // refresh on tab change

  useEffect(() => {
    setPage(1);
    getAllPosts(1, true);
  }, [status]);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          const nextPage = page + 1;
          setPage(nextPage);
          getAllPosts(nextPage); // --> appending the new posts, reset = false
        }
      },
      { threshold: 1.0 },
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [loading, page, totalPages]);

  return (
    <Test>
      <div
        className="flex justify-between pl-5 pr-10 font-munoch"
        onClick={() => navigate("/admin/create")}
      >
        <h1 className="text-3xl font-semibold">Blog Posts</h1>
        <Button className="text-xl">Create new</Button>
      </div>

      {/* <div id='container' className="w-auto h-150 m-5 mt-0"> */}
      <div id="tabs" className="w-auto h-10 flex items-center gap-3 mx-5 font-munoch">
        <Button
          size="sm"
          onClick={() => setStatus("all")}
          className={`text-lg text-foreground h-8 border-1 border-border focus-visible:ring-ring cursor-pointer ${status === "all" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-background hover:bg-accent hover:text-accent-foreground"}`}
        >
          All
          <Count value={counts.all} />
        </Button>

        <Button
          size="sm"
          onClick={() => setStatus("published")}
          className={`text-lg text-foreground h-8 border-1 border-input focus-visible:ring-ring cursor-pointer ${status === "published" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-background hover:bg-accent hover:text-accent-foreground"}`}
        >
          Published
          <Count value={counts.published} />
        </Button>

        <Button
          size="sm"
          onClick={() => setStatus("draft")}
          className={`text-lg text-foreground h-8 border-1 border-input focus-visible:ring-ring cursor-pointer ${status === "draft" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-background hover:bg-accent hover:text-accent-foreground"}`}
        >
          Draft
          <Count value={counts.draft} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        {posts.map((post, index) => (
          <BlogTableRow
            key={index}
            title={post.title}
            views={post.views}
            likes={post.likes}
            slug={post.slug}
          />
        ))}
        {/* Here it will be like infinite loading */}
        <div
          ref={loadMoreRef}
          className="h-10 flex justify-center items-center"
        >
          {loading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>
      </div>
    </Test>
  );
};

export default BlogPosts;
