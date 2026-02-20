import { HTMLAttributes } from "react";
import { cn } from "./utils";

type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
}

/**
 * Reusable loading spinner for async states and pending actions.
 */
export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  const sizeClasses: Record<SpinnerSize, string> = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-[3px]",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-border border-t-primary",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
}
