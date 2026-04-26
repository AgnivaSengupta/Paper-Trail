import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import useEditorStore from "@/store/tempStore";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "@/components/ui/button";
import { uploadImageToR2 } from "@/utils/r2-upload";
import { useAuthStore } from "@/store/useAuthStore";
import PostSettingsSidebar from "@/components/dashboard/PostSettingsSidebar";
import { type JSONContent } from "@tiptap/react";
import EditorHeader from "@/components/dashboard/EditorHeader";

interface EditorContent {
  html: string;
  json: JSONContent | null;
}

const EditorPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const setContent = useEditorStore((state) => state.setContent);
  const [postId, setPostId] = useState<string | null>(null);
  const [initialContent, setInitialContent] = useState<JSONContent | string | undefined>(undefined);
  // const [isFetchingPost, setIsFetchingPost] = useState(false);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [previewUrl, setPreviewUrl] = useState("");
  // const [coverFile, setCoverFile] = useState<File | null>(null);

  // const theme = useThemeStore((state) => state.theme);
  // const toggleTheme = useThemeStore((state) => state.toggleTheme);

  // const [meta, setMeta] = useState({
  //   title: "",
  //   slug: "",
  //   coverImageUrl: "" as string | null,
  //   tags: ["Technology"],
  //   excerpt: "",
  // });

  // const notify = (type: string) => {
  //   switch (type) {
  //     case "titleMissing":
  //       toast.error("Please enter a post title!");
  //       break;
  //     case "emptyContent":
  //       toast.error("Empty post cannot be published");
  //       break;
  //     case "publish":
  //       toast.success("Post published successfully!");
  //       break;

  //   }

  const [isFetchingPost, setIsFetchingPost] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const [meta, setMeta] = useState({
    title: "",
    slug: "",
    coverImageUrl: "" as string | null,
    tags: ["Technology"],
    excerpt: "",
  });

  const notify = (type: string) => {
    switch (type) {
      case "titleMissing":
        toast.error("Please enter a post title!");
        break;
      case "emptyContent":
        toast.error("Empty post cannot be published");
        break;
      case "publish":
        toast.success("Post published successfully!");
        break;
      case "draft":
        toast.success("Draft saved successfully");
        break;
      case "error":
        toast.error("Something went wrong");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        setIsFetchingPost(true);
        try {
          const response = await axiosInstance.get(API_PATHS.POST.GET_POST_BY_SLUG(slug));
          const post = response.data;

          setPostId(post._id);
          setMeta({
            title: post.title,
            slug: post.slug,
            coverImageUrl: post.coverImageUrl || "",
            tags: post.tags || [],
            excerpt: post.excerpt || "",
          });

          if (post.coverImageUrl) {
            setPreviewUrl(post.coverImageUrl);
          }

          setInitialContent(post.content?.json || post.content?.html || "");
          setContent(post.content?.html || "", post.content?.json || null);

        } catch (error) {
          console.error("Failed to fetch post", error);
          toast.error("Failed to load post for editing");
        } finally {
          setIsFetchingPost(false);
        }
      };

      fetchPost();
    } else {
        setPostId(null);
        setInitialContent(undefined);
        setContent("", null);
        setMeta({
          title: "",
          slug: "",
          coverImageUrl: "",
          tags: ["Technology"],
          excerpt: "",
        });
        setPreviewUrl("");
    }
  }, [slug, setContent]);

  const json = useEditorStore((state) => state.json);
  const html = useEditorStore((state) => state.html);

  const handleSubmit = async (status: string) => {
    if (!meta.title.trim()) {
      notify("titleMissing");
      return;
    }
    if (!json || html.length == 0) {
      notify("emptyContent");
      return;
    }

    setIsSubmitting(true);

    try {

      // Image upload:
      // let finalPicUrl = await uploadImageToR2()
      let finalCoverUrl = meta.coverImageUrl;

      if (coverFile){
        try {
          finalCoverUrl = await uploadImageToR2(coverFile);
        } catch (error) {
          console.error("Upload failed", error);
          // toast.error("Failed to upload cover image");
          notify("error");
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        title: meta.title,
        content: {
          json: json,
          html: html,
        },
        coverImageUrl: finalCoverUrl || "https://picsum.photos/200/300",
        tags: meta.tags,
        isDraft: status === "draft" ? true : false,
      };

      if (postId) {
        await axiosInstance.put(
          API_PATHS.POST.UPDATE_POST(postId),
          payload,
        );
      } else {
        await axiosInstance.post(
          API_PATHS.POST.CREATE_POST,
          payload,
        );
      }

      notify(status);
    } catch (error) {
      notify("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { user } = useAuthStore();

  return (
    <div >
      <Toaster containerClassName="text-lg" />
      <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-[#0f1014] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
        {/* --- Sidebar (Standard) --- */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* --- Main Content --- */}
        <main
          className={`
            flex flex-col
            flex-1 pt-4
            transition-all duration-300 ease-in-out h-full overflow-hidden
            ${isSidebarOpen ? "ml-64" : "ml-20"}
          `}
        >
          {/* Header Actions */}
          <header className="shrink-0 flex justify-between items-center py-4 px-8 border-b-4 border-double border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-primary  text-zinc-900 dark:text-zinc-200">
                Write a Post
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="icon"
                // onClick={() => setIsDarkMode(!isDarkMode)}
                onClick={() => toggleTheme()}
                className="p-2 cursor-pointer bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors shadow-sm dark:shadow-none"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>

              <Avatar>
                <AvatarImage
                  src={user?.profilePic || "https://github.com/shadcn.png"}
                  alt="@shadcn"
                  className="object-cover"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <div className="flex flex-1  min-h-0">
            {/* Left: Editor Canvas */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Top Header */}
              <EditorHeader isSubmitting={ isSubmitting } onSubmit={handleSubmit} />

              {/* Editor Area */}
              <div className="flex-1 overflow-hidden bg-white dark:bg-zinc-900 scroll-smooth">
                {isFetchingPost ? (
                  <div className="flex items-center justify-center h-full text-zinc-500 font-primary">Loading post...</div>
                ) : (
                  <SimpleEditor
                    initialContent={initialContent}
                    onChange={(json, html) => {
                      setContent(html, json);
                    }}
                  />
                )}
              </div>
            </div>

            {/* Right: Metadata Form */}
            <PostSettingsSidebar meta={ meta } setMeta={setMeta} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} setCoverFile={setCoverFile} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditorPage;
