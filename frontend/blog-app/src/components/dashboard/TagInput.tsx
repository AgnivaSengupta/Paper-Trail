import { cn } from "@/lib/utils";
import { Hash, Plus, X } from "lucide-react";
import { useState } from "react";

const TagInput = ({ tags, onAddTag, onRemoveTag, className }) => {
  const [input, setInput] = useState<string>("");
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      onAddTag(input.trim());
      setInput("");
    }
  };
  return (
    <div className="space-y-2 mt-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
          >
            <Hash size={10} className="opacity-50" /> {tag}
            <button
              type='button'
              onClick={() => onRemoveTag(tag)}
              className="hover:text-rose-500 ml-1"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className={cn("relative h-18", className)}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tags..."
          className="w-full bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
        />
        <Plus
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
      </div>
    </div>
  );
};

export default TagInput;