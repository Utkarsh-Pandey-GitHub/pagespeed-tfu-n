import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-zinc-50 hover:!text-white hover:bg-foreground/90",
        destructive:
          "bg-red-500 text-zinc-50 hover:text-white hover:bg-red-500/90",
        outline:
          "border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-foreground",
        secondary:
          "bg-zinc-100 text-foreground hover:text-foreground hover:bg-zinc-100/80",
        ghost: "hover:bg-zinc-100 border-none",
        link: "text-foreground underline-offset-4 border-none hover:text-foreground hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
