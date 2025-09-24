import * as React from "react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

const IdeaCard = React.forwardRef(
  (
    {
      className,
      title,
      description,
      status = "draft",
      lastUpdated,
      modelsCount = 0,
      children,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef(null);

    React.useImperativeHandle(ref, () => cardRef.current, []);

    const onMouseEnter = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          scale: 1.02,
          y: -4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          duration: 0.25,
          ease: "power2.out",
        });
      }
    };

    const onMouseLeave = () => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          scale: 1,
          y: 0,
          boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
          duration: 0.2,
          ease: "power2.out",
        });
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "completed":
          return "bg-bp-green-600 text-white";
        case "generating":
          return "bg-bp-green-100 text-bp-green-700";
        default:
          return "bg-bp-gray-100 text-bp-gray-700";
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case "completed":
          return "Completed";
        case "generating":
          return "Generating...";
        default:
          return "Draft";
      }
    };

    return (
      <Card
        className={cn(
          "cursor-pointer card-shadow transition-smooth hover:card-shadow-hover",
          className
        )}
        ref={cardRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold text-balance">
              {title}
            </CardTitle>
            <span
              className={cn(
                "px-2 py-1 rounded-md text-xs font-medium",
                getStatusColor(status)
              )}
            >
              {getStatusText(status)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4 text-balance">
            {description}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{modelsCount} models</span>
            {lastUpdated && <span>Updated {lastUpdated}</span>}
          </div>

          {children}
        </CardContent>
      </Card>
    );
  }
);
IdeaCard.displayName = "IdeaCard";

export { IdeaCard };
