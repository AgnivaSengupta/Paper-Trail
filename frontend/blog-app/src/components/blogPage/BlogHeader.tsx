import { PenLine } from "lucide-react";

const BlogHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-14 flex items-center justify-center">
        <div className="flex items-center gap-2 text-foreground">
          <PenLine className="h-5 w-5" />
          <span className="font-serif text-lg font-medium tracking-wide">PaperTrails</span>
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;
