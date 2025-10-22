import React from "react";
import { cn } from "@/lib/utils";

type BaseProps = {
  className?: string;
};

type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  BaseProps & {
    active?: boolean;
  };

export const EditorButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, active = false, type = "button", children, ...props }, ref) => (
    <button
      {...props}
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground",
        className
      )}
    >
      {children}
    </button>
  )
);

EditorButton.displayName = "EditorButton";

type IconProps = React.ComponentPropsWithoutRef<"span"> & BaseProps;

export const EditorIcon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ className, children, ...props }, ref) => (
    <span {...props} ref={ref} className={cn("material-icons text-lg", className)}>
      {children}
    </span>
  )
);

EditorIcon.displayName = "EditorIcon";

type ToolbarProps = React.ComponentPropsWithoutRef<"div"> & BaseProps;

export const EditorToolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={cn(
        "flex flex-wrap gap-1 border-b border-border bg-background p-2 mb-4",
        className
      )}
    >
      {children}
    </div>
  )
);

EditorToolbar.displayName = "EditorToolbar";
