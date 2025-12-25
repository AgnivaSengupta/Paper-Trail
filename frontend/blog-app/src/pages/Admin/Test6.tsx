import React, { useState } from "react";
import {
  LayoutDashboard,
  Box,
  PieChart,
  Cpu,
  HardDrive,
  Wallet,
  Settings,
  Search,
  Bell,
  PanelLeft,
  PanelLeftClose,
  Sun,
  Moon,
  FileText,
  MessageSquare,
  MapPin,
  Mail,
  Link as LinkIcon,
  Github,
  Twitter,
  Linkedin,
  Edit2,
  Calendar,
  Award,
  Zap,
  CheckCircle2,
  Camera,
  Eye,
  Save,
  Send,
  UploadCloud,
  Hash,
  Plus,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Sidebar from "@/components/dashboard/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import useEditorStore from "@/store/tempStore";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { useThemeStore } from "@/store/themeStore";
import TagInput from "@/components/dashboard/TagInput";
//import { TooltipArrow } from '@radix-ui/react-tooltip';

// const TagInput = ({ tags, onAddTag, onRemoveTag }) => {
//   const [input, setInput] = useState("");
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && input.trim()) {
//       e.preventDefault();
//       onAddTag(input.trim());
//       setInput("");
//     }
//   };
//   return (
//     <div className="space-y-2 mt-2">
//       <div className="flex flex-wrap gap-2 mb-2">
//         {tags.map((tag, index) => (
//           <span
//             key={index}
//             className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
//           >
//             <Hash size={10} className="opacity-50" /> {tag}
//             <button
//               onClick={() => onRemoveTag(tag)}
//               className="hover:text-rose-500 ml-1"
//             >
//               <X size={12} />
//             </button>
//           </span>
//         ))}
//       </div>
//       <div className="relative h-18">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Add tags..."
//           className="w-full bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
//         />
//         <Plus
//           size={14}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
//         />
//       </div>
//     </div>
//   );
// };

const ImageUploadBox = ({ image, onUpload, onRemove }) => (
  <div className="relative group w-full aspect-video rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center mt-2 transition-colors hover:border-zinc-400 dark:hover:border-zinc-600 overflow-hidden">
    {image ? (
      <>
        <img src={image} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={onRemove}
            className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </>
    ) : (
      <div className="text-center p-4">
        <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
          <UploadCloud size={20} />
        </div>
        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Click to upload cover
        </p>
      </div>
    )}
    <input
      type="file"
      className="absolute inset-0 opacity-0 cursor-pointer"
      onChange={(e) => {
        if (e.target.files?.[0])
          onUpload(URL.createObjectURL(e.target.files[0]));
      }}
    />
  </div>
);

const Test6 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  
  const [meta, setMeta] = useState({
    title: "",
    slug: "",
    coverImageUrl: null,
    tags: ["Technology"],
    excerpt: ''
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
      const payload = {
        title: meta.title,
        content: {
          json: json,
          html: html,
        },
        coverImageUrl: meta.coverImageUrl || 'https://picsum.photos/200/300',
        tags: meta.tags,
        isDraft: status === "draft" ? true : false,
      };

      const response = await axiosInstance.post(
        API_PATHS.POST.CREATE_POST,
        payload,
      );

      notify(status);
    } catch (error) {
      notify("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const setContent = useEditorStore((state) => state.setContent);

  return (
    <div className={theme === 'dark' ? "dark" : ""}>
      <Toaster containerClassName="text-lg"/>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-[#0f1014] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
        {/* --- Sidebar (Standard) --- */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* --- Main Content --- */}
        <main
          className={`
            flex-1 py-8
            transition-all duration-300 ease-in-out h-screen overflow-hidden
            ${isSidebarOpen ? "ml-64" : "ml-20"}
          `}
        >
          {/* Header Actions */}
          <header className="flex justify-between items-center py-4 px-8 border-b-4 border-double border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-primary  text-zinc-900 dark:text-zinc-200">
                Write a Post
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                // onClick={() => setIsDarkMode(!isDarkMode)}
                onClick={() => toggleTheme()}
                className="p-2 cursor-pointer bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors shadow-sm dark:shadow-none"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <div className="flex flex-1 bg-amber-200">
            {/* Left: Editor Canvas */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              {/* Top Header */}
              <header className="h-16 border-b-4 border-double border-zinc-200 dark:border-zinc-800 flex justify-between items-center px-8 bg-zinc-50 dark:bg-[#0f1014]">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 text-xs font-medium rounded border border-amber-200 dark:border-amber-500/20">
                    Draft
                  </span>
                  <span className="text-zinc-400 text-sm">
                    Last saved just now
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <Eye size={16} /> Preview
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    onClick={(e) => handleSubmit("draft")}
                  >
                    <Save size={16} /> Save
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-900/20 transition-colors"
                    onClick={(e) => handleSubmit("publish")}
                  >
                    <Send size={16} /> Publish
                  </button>
                </div>
              </header>

              {/* Editor Area */}
              <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-900 scroll-smooth">
                <SimpleEditor
                  onChange={(json, html) => {
                    setContent(html, json);
                  }}
                />
              </div>
            </div>

            {/* Right: Metadata Form */}
            <aside className="w-[350px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0f1014] flex flex-col h-screen overflow-y-auto hide-scrollbar z-40">
              <div className="p-6">
                <h2 className="text-xl font-primary text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                  Post Settings
                </h2>

                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                      Blog Title
                    </label>
                    <input
                      type="text"
                      value={meta.title}
                      onChange={(e) =>
                        setMeta({ ...meta, title: e.target.value })
                      }
                      placeholder="Enter title..."
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-zinc-100 "
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                      Cover Image
                    </label>
                    <ImageUploadBox
                      image={meta.coverImage}
                      onUpload={(url) =>
                        setMeta({ ...meta, coverImageUrl: url })
                      }
                      onRemove={() => setMeta({ ...meta, coverImage: null })}
                    />
                  </div>

                  <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                        Tags
                      </label>
                      <TagInput
                        tags={meta.tags}
                        onAddTag={(t) =>
                          setMeta({ ...meta, tags: [...meta.tags, t] })
                        }
                        onRemoveTag={(t) =>
                          setMeta({
                            ...meta,
                            tags: meta.tags.filter((tag) => tag !== t),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <label className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                      SEO Excerpt
                    </label>
                    <textarea
                      rows={4}
                      value={meta.excerpt}
                      onChange={(e) =>
                        setMeta({ ...meta, excerpt: e.target.value })
                      }
                      placeholder="Description..."
                      className="w-full h-36 mt-2  bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-zinc-100 resize-none"
                    />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Test6;
