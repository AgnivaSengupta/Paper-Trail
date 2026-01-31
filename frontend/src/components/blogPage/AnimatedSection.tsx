import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import useScrollAnimation from "@/hooks/useScrollAnimation";

type AnimationType = "fade-in" | "fade-in-left" | "fade-in-right" | "scale-in";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
}

const AnimatedSection = ({
  children,
  className,
  animation = "fade-in",
  delay = 0,
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        "opacity-0",
        isVisible && `animate-${animation}`,
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
