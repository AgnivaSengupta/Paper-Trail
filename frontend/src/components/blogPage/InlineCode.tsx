import { cn } from "@/lib/utils";

interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
}

const InlineCode = ({ children, className }: InlineCodeProps) => {
  return (
    <code
      className={cn(
        "px-1.5 py-0.5 rounded text-sm font-mono bg-muted text-red-500 border border-border",
        className
      )}
    >
      {children}
    </code>
  );
};

export default InlineCode;
