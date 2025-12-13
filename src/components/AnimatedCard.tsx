import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  index?: number;
  baseDelay?: number;
}

const AnimatedCard = ({ children, className, index = 0, baseDelay = 100 }: AnimatedCardProps) => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-out",
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95",
        className
      )}
      style={{ transitionDelay: `${index * baseDelay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
