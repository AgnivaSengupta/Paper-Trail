import { UploadCloud, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface ImageUploadBoxProps {
  previewUrl: string;
  setPreviewUrl: Dispatch<SetStateAction<string>>;
  setCoverFile: Dispatch<SetStateAction<File | null>>;
}

const ImageUploadBox = ({ previewUrl, setPreviewUrl, setCoverFile }: ImageUploadBoxProps) => (
  <div className="relative group w-full aspect-video rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center mt-2 transition-colors hover:border-zinc-400 dark:hover:border-zinc-600 overflow-hidden">
    {previewUrl ? (
      <>
        <img src={previewUrl} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute z-10 inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => {
                setPreviewUrl("")
                setCoverFile(null);
              }
            }
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
        if (file) {
          setPreviewUrl(URL.createObjectURL(file));
          setCoverFile(file);
        }
      }}
    />
  </div>
);

export default ImageUploadBox;