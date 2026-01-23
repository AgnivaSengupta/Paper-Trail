import React, { useState } from "react";
import { Sun, Moon, Eye, Save, Send, UploadCloud, X, Pen } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import useEditorStore from "@/store/tempStore";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { useThemeStore } from "@/store/themeStore";
import TagInput from "@/components/dashboard/TagInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { uploadImageToR2 } from "@/utils/r2-upload";
import { Spinner } from "@/components/ui/spinner";

const ImageUploadBox = ({ previewUrl, setPreviewUrl, setCoverFile }) => (
  <div className="relative group w-full aspect-video rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center mt-2 transition-colors hover:border-zinc-400 dark:hover:border-zinc-600 overflow-hidden">
    {previewUrl ? (
      <>
        <img src={previewUrl} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute z-10 inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => setPreviewUrl("")}
            className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors cursor-pointer z-100"
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
      accept="image/png, image/jpeg, image/webp"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file)
          setPreviewUrl(URL.createObjectURL(file));
          setCoverFile(file);
      }}
    />
  </div>
);

const EditorPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiTabOpen, setIsAiTabOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [coverFile, setCoverFile] = useState(null);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const [meta, setMeta] = useState({
    title: "",
    slug: "",
    coverImageUrl: null,
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

      await axiosInstance.post(
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
                variant="outline"
                className="cursor-pointer" 
                onClick={() => {
                  setIsAiTabOpen(!isAiTabOpen);
                }
                }>
                <span>Ask AI</span>
                <Pen />
              </Button>
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
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <div className="flex flex-1  min-h-0">
            {/* Left: Editor Canvas */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Top Header */}
              <header className="h-16 border-b-4 border-double border-zinc-200 dark:border-zinc-800 flex justify-end items-center px-8 bg-zinc-50 dark:bg-[#0f1014]">
                {/* <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 text-xs font-medium rounded border border-amber-200 dark:border-amber-500/20">
                    Draft
                  </span>
                  <span className="text-zinc-400 text-sm">
                    Last saved just now
                  </span>
                </div> */}

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <Eye size={16} /> Preview
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    onClick={(e) => handleSubmit("draft")}
                  >
                    {isSubmitting ? 
                      (<>
                        <Spinner/>
                      </>): 
                      (<>
                        <Save size={16} /> Save
                        </>
                      )}
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-900/20 transition-colors"
                    onClick={(e) => handleSubmit("publish")}
                  >
                    {isSubmitting ? 
                      (<>
                        <Spinner/>
                      </>): 
                      (<>
                        <Send size={16} /> Publish
                        </>
                      )}
                    
                  </button>
                </div>
              </header>

              {/* Editor Area */}
              <div className="flex-1 overflow-auto bg-white dark:bg-zinc-900 scroll-smooth">
                <SimpleEditor
                  onChange={(json, html) => {
                    setContent(html, json);
                  }}
                />
              </div>
            </div>

            {/* Right: Metadata Form */}
            <aside className="relative w-[500px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0f1014] flex flex-col h-full overflow-y-scroll z-40">
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
                      previewUrl={previewUrl}
                      setPreviewUrl={setPreviewUrl}
                      setCoverFile={setCoverFile}
                      // onUpload={(url) =>
                      //   setMeta({ ...meta, coverImageUrl: url })
                      // }
                      // onRemove={() => setPreviewUrl("")}
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

              {isAiTabOpen && (
                <div
                  className="absolute top-7 left-3 h-[86%] w-[95%] 
                      bg-zinc-900/90     {/* CHANGED: Uses color opacity, not element opacity */}
                      backdrop-blur-xs  {/* BLURS BEHIND: Keeps background blurry */}
                      rounded-sm 
                      z-50 text-white"
                >
                  <div className="relative flex justify-between items-center p-4">
                    <span className="font-semibold text-xl font-primary text-zinc-800 dark:text-zinc-100">
                      AI Assistant
                    </span>
                    {/*<button onClick={() => setIsAiOpen(false)} className="text-xs">Close</button>*/}
                    
                    <Textarea
                    className="absolute border-2 border-white w-full"
                    />
                  </div>
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditorPage;
