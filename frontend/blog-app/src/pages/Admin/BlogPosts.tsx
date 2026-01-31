import { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  FileText,
  Edit3,
  Trash2,
  ThumbsUp,
  Eye,
  Calendar,
} from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useThemeStore } from "@/store/themeStore";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export type Author = {
  name: string;
  profilePic: string;
};

export type Post = {
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

const BlogPosts = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [activeTab, setActiveTab] = useState("all"); // 'all', 'published', 'draft'

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  //const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [allPosts, setAllPosts] = useState(0);
  const [currPage, setCurrPage] = useState(1);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const {user} = useAuthStore();
  const navigate = useNavigate();

  const getAllPosts = async (pageNumber = 1, filterStatus: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.POST.GET_ALL_POSTS_BY_USER,
        {
          params: {
            status: filterStatus.toLowerCase(),
            page: pageNumber,
            limit: 8,
          },
        },
      );

      const { posts, totalPages, totalCount, allCount } = response.data;
      setPosts(posts);
      setTotalPages(totalPages);
      setTotalCount(totalCount);
      setAllPosts(allCount);
    } catch (error) {
      console.log("Error fetching the posts:--> ", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currPage < totalPages) {
      const newPage = currPage + 1;
      setCurrPage(newPage);
      //getAllPosts(newPage, activeTab);
    }
  };

  const handlePrev = () => {
    if (currPage > 1) {
      const newPage = currPage - 1;
      setCurrPage(newPage);
      //getAllPosts(newPage, activeTab);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await axiosInstance.delete(API_PATHS.POST.DELETE_POST(postId));
      console.log("Post Deleted");

      getAllPosts(currPage, activeTab);

      setDeleteDialogOpen(false);
      setSelectedPostId(null);
    } catch (error) {
      console.log("Failed to delete post: ", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    setCurrPage(1);
    // getAllPosts(1, activeTab);
  }, [activeTab]);

  useEffect(() => {
    getAllPosts(currPage, activeTab);
  }, [currPage, activeTab]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-[#0f1014] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* --- Main Content --- */}
        <main
          className={`
            flex-1 p-8
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "ml-64" : "ml-20"}
          `}
        >
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-primary text-zinc-900 dark:text-zinc-200">
                Posts
              </h1>
              <span className="text-zinc-400 text-sm border-l border-zinc-700 pl-4">
                {allPosts} Total Posts
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">

                <button
                  onClick={() => toggleTheme()}
                  className="p-2 cursor-pointer bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors shadow-sm dark:shadow-none"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <Avatar>
                  <AvatarImage
                    src={user?.profilePic || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                    className='object-cover'
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Controls & Filter Bar */}
          <div className="flex justify-between items-end mb-6">
            <div className="flex gap-1 bg-zinc-200 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
              {["all", "published", "draft"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all cursor-pointer
                    ${
                      activeTab === tab
                        ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300"
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/*<button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 px-3 py-2 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors">
              <Filter size={14} /> Filter View
            </button>*/}
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse ">
                <thead>
                  <tr className="py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <th className="py-6 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 w-[40%]">
                      Post Details
                    </th>
                    <th className="py-6 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Status
                    </th>
                    <th className="py-6 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Engagement
                    </th>
                    <th className="py-6 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Date
                    </th>
                    <th className="py-6 px-6 text-base font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12">
                        <div className="flex flex-col items-center justify-center w-full">
                          <Spinner />
                          <span className="mt-2 text-sm text-zinc-500">
                            Loading your posts...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    posts.map((post) => (
                      <tr
                        key={post._id}
                        className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        {/* Title & Category */}
                        <td className="py-6 px-6">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-400">
                              <FileText size={20} />
                            </div>
                            <div>
                              <div
                                onClick={() => navigate(`/${post.slug}`)}
                                className="font-primary text-xl text-zinc-900 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer">
                                {post.title}
                              </div>
                              <div className="text-sm text-zinc-500 mt-1 flex items-center gap-2">
                                <span>{post.author.name}</span>
                                <span className="w-1 h-1 bg-zinc-400 rounded-full"></span>
                                {/*<span>{post.category}</span>*/}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-6 px-6">
                          <span
                            className={`
                          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                          ${
                            post.isDraft == false
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                              : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                          }
                        `}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${post.isDraft == false ? "bg-emerald-500" : "bg-zinc-400"}`}
                            ></span>
                            {post.isDraft == false ? "Published" : "Draft"}
                          </span>
                        </td>

                        {/* Engagement (Likes/Views) */}
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-4 text-base text-zinc-600 dark:text-zinc-400">
                            <div
                              className="flex items-center gap-1.5 min-w-[60px]"
                              title="Likes"
                            >
                              <ThumbsUp
                                size={14}
                                className={
                                  post.isDraft == true
                                    ? "text-zinc-300 dark:text-zinc-700"
                                    : ""
                                }
                              />
                              <span>{post.likes}</span>
                            </div>
                            <div
                              className="flex items-center gap-1.5"
                              title="Views"
                            >
                              <Eye
                                size={14}
                                className={
                                  post.isDraft == true
                                    ? "text-zinc-300 dark:text-zinc-700"
                                    : ""
                                }
                              />
                              <span>{post.views}</span>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-2 text-base text-zinc-500 dark:text-zinc-400">
                            <Calendar size={14} />
                            <span>{post.updatedAt}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-6 px-6 text-center">
                          <div className="flex items-center justify-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity pl-4">
                            <button className="p-1.5 cursor-pointer text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                              <Edit3 size={16} />
                            </button>
                            <Dialog
                              open={
                                deleteDialogOpen && selectedPostId == post._id
                              }
                              onOpenChange={setDeleteDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <button
                                  onClick={() => {
                                    setSelectedPostId(post._id);
                                    setDeleteDialogOpen(true);
                                  }}
                                  className="p-1.5 cursor-pointer text-zinc-400 hover:text-rose-600 dark:hover:text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </DialogTrigger>

                              <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-lg">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl font-primary">
                                    Delete Post
                                  </DialogTitle>
                                  <DialogDescription className="text-lg font-primary text-zinc-600 dark:text-zinc-400">
                                    This action cannot be undone. This will
                                    permanently delete your post from our
                                    servers.
                                  </DialogDescription>
                                </DialogHeader>

                                <DialogFooter className="flex gap-2">
                                  <DialogClose asChild>
                                    <button
                                      onClick={() => {
                                        setSelectedPostId(null);
                                        setDeleteDialogOpen(false);
                                      }}
                                      className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </DialogClose>

                                  {/* Primary Action Button */}
                                  <button
                                    type="submit"
                                    onClick={() => handleDelete(post._id)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-sm tracking-wider transition-colors cursor-pointer"
                                  >
                                    Delete Post
                                  </button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            {/*<button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                            <MoreHorizontal size={16} />
                          </button>*/}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}

                  {/* Empty State if no results */}
                  {!loading && posts.length === 0 && (
                    <tr>
                      <td
                        colSpan={Number(5)}
                        className="py-12 text-xl font-primary text-center text-zinc-500 dark:text-zinc-400"
                      >
                        No posts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 flex items-center justify-between">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Showing{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-200">
                  {posts.length === 0 ? 0 : 1 + (currPage - 1) * 8}
                </span>{" "}
                to{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-200">
                  {(currPage - 1) * 8 + posts.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-200">
                  {totalCount}
                </span>{" "}
                results
              </div>
              <div className="flex gap-2">
                <button
                  disabled={currPage === 1 || loading}
                  onClick={handlePrev}
                  className={`px-3 py-1 text-xs border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  Previous
                </button>
                <button
                  disabled={currPage >= totalPages || loading}
                  onClick={handleNext}
                  className="px-3 py-1 text-xs border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlogPosts;
