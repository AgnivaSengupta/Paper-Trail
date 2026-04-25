import type { Dispatch, SetStateAction } from "react";
import ImageUploadBox from "./ImageUploadBox"
import TagInput from "./TagInput"

interface Meta {
  title: string;
  slug: string;
  coverImageUrl: string | null;
  tags: string[];
  excerpt: string;
}

interface PostSettingsSidebarProps {
  meta: Meta;
  setMeta: (meta: Meta) => void;
  previewUrl: string;
  setPreviewUrl: Dispatch<SetStateAction<string>>;
  setCoverFile: Dispatch<SetStateAction<File | null>>;
}

const PostSettingsSidebar = ({meta, setMeta, previewUrl, setPreviewUrl, setCoverFile} : PostSettingsSidebarProps) => {
  return (
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
                onAddTag={(t: string) =>
                  setMeta({ ...meta, tags: [...meta.tags, t] })
                }
                onRemoveTag={(t: string) =>
                  setMeta({
                    ...meta,
                    tags: meta.tags.filter((tag) => tag !== t),
                  })
                }
                className=""
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
  )
}

export default PostSettingsSidebar;