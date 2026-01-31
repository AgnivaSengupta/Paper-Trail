import { cn } from "@/lib/utils";

interface HighlightProps {
  children: React.ReactNode;
  color?: "yellow" | "green" | "blue" | "pink";
  className?: string;
}

const colorClasses = {
  yellow: "bg-yellow-100 dark:bg-yellow-900/40",
  green: "bg-green-100 dark:bg-green-900/40",
  blue: "bg-blue-100 dark:bg-blue-900/40",
  pink: "bg-pink-100 dark:bg-pink-900/40",
};

const Highlight = ({ children, color = "yellow", className }: HighlightProps) => {
  return (
    <mark
      className={cn(
        "px-1 py-0.5 rounded-sm text-foreground",
        colorClasses[color],
        className
      )}
    >
      {children}
    </mark>
  );
};

export default Highlight;
