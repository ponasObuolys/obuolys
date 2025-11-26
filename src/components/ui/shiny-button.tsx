/**
 * Shiny Button Component
 * Animated CTA button with spinning gradient border effect
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import "./shiny-button.css";

export interface ShinyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: "default" | "sm" | "lg";
}

const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ className, asChild = false, size = "default", children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      default: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <Comp
        className={cn("shiny-cta", sizeClasses[size], className)}
        ref={ref}
        {...props}
      >
        <span>{children}</span>
      </Comp>
    );
  }
);

ShinyButton.displayName = "ShinyButton";

export { ShinyButton };
