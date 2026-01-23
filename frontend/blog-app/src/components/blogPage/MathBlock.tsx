import { cn } from "@/lib/utils";

interface MathBlockProps {
  children: string;
  inline?: boolean;
  className?: string;
}

const MathBlock = ({ children, inline = false, className }: MathBlockProps) => {
  if (inline) {
    return (
      <span
        className={cn(
          "font-serif italic text-foreground mx-1",
          className
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "my-6 py-6 px-4 bg-muted/30 rounded-lg border border-border text-center overflow-x-auto",
        className
      )}
    >
      <span className="font-serif text-lg italic text-foreground">
        {children}
      </span>
    </div>
  );
};

export default MathBlock;
