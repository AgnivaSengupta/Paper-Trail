import { cn } from "@/lib/utils";
import { AlertCircle, Info, Lightbulb, AlertTriangle } from "lucide-react";

type CalloutType = "info" | "warning" | "tip" | "note";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const calloutConfig = {
  info: {
    icon: Info,
    bgClass: "bg-blue-50 dark:bg-blue-950/30",
    borderClass: "border-blue-200 dark:border-blue-800",
    iconClass: "text-blue-500",
    titleClass: "text-blue-900 dark:text-blue-100",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-amber-50 dark:bg-amber-950/30",
    borderClass: "border-amber-200 dark:border-amber-800",
    iconClass: "text-amber-500",
    titleClass: "text-amber-900 dark:text-amber-100",
  },
  tip: {
    icon: Lightbulb,
    bgClass: "bg-green-50 dark:bg-green-950/30",
    borderClass: "border-green-200 dark:border-green-800",
    iconClass: "text-green-500",
    titleClass: "text-green-900 dark:text-green-100",
  },
  note: {
    icon: AlertCircle,
    bgClass: "bg-muted",
    borderClass: "border-border",
    iconClass: "text-muted-foreground",
    titleClass: "text-foreground",
  },
};

const Callout = ({ type = "note", title, children, className }: CalloutProps) => {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "my-6 p-4 rounded-lg border",
        config.bgClass,
        config.borderClass,
        className
      )}
    >
      <div className="flex gap-3">
        <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", config.iconClass)} />
        <div className="flex-1 min-w-0">
          {title && (
            <h5 className={cn("font-semibold text-sm mb-1", config.titleClass)}>
              {title}
            </h5>
          )}
          <div className="text-sm text-foreground/80 leading-relaxed [&>p]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Callout;
