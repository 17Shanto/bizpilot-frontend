import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground card-shadow hover:bg-primary/90",
        hero: "bg-primary text-primary-foreground font-semibold card-shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground card-shadow hover:bg-destructive/90",
        outline:
          "border border-border bg-card text-card-foreground card-shadow hover:bg-secondary hover:text-secondary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground card-shadow hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium:
          "bg-accent text-accent-foreground font-semibold card-shadow hover:bg-accent/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const AnimatedButton = React.forwardRef(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const buttonRef = React.useRef(null);

    React.useImperativeHandle(ref, () => buttonRef.current, []);

    const onMouseEnter = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 1.03,
          duration: 0.18,
          ease: "power2.out",
        });
      }
    };

    const onMouseLeave = () => {
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.15,
          ease: "power2.out",
        });
      }
    };

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={buttonRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, buttonVariants };
