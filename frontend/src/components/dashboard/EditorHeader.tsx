import { Eye, Save, Send } from "lucide-react";
import { Spinner } from "../ui/spinner";

interface EditorHeaderProps {
  isSubmitting: boolean;
  onSubmit: (status: string) => Promise<void>
}

const EditorHeader = ({isSubmitting, onSubmit} : EditorHeaderProps) => {
  return (
    <header className="h-16 border-b-4 border-double border-zinc-200 dark:border-zinc-800 flex justify-end items-center px-8 bg-zinc-50 dark:bg-[#0f1014]">

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
          <Eye size={16} /> Preview
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          onClick={() => onSubmit("draft")}
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
          onClick={() => onSubmit("publish")}
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
  )
}

export default EditorHeader;