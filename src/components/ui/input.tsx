import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[0.83331rem] border-2 border-escobets-yellow/80 bg-escobets-gray-card px-4 py-2 text-white placeholder:text-escobets-yellow/80 focus:outline-none focus:ring-2 focus:ring-escobets-yellow/50 focus:border-escobets-yellow disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
