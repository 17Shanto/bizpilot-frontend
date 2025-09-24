import * as React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { gsap } from "gsap";
import { Menu, MessageCircle, User } from "lucide-react";

const Header = React.forwardRef(({ className, ...props }, ref) => {
  const navigate = useNavigate();
  const logoRef = React.useRef(null);
  const navItemRefs = React.useRef([]);
  const loginButtonRef = React.useRef(null);

  const onNavItemEnter = (index) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const item = navItemRefs.current[index];
    if (item) {
      gsap.to(item, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const onNavItemLeave = (index) => {
    const item = navItemRefs.current[index];
    if (item) {
      gsap.to(item, {
        scale: 1,
        duration: 0.15,
        ease: "power2.out",
      });
    }
  };

  const onLoginButtonEnter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const button = loginButtonRef.current;
    if (button) {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const onLoginButtonLeave = () => {
    const button = loginButtonRef.current;
    if (button) {
      gsap.to(button, {
        scale: 1,
        duration: 0.15,
        ease: "power2.out",
      });
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60",
        className
      )}
      ref={ref}
      {...props}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex" ref={logoRef}>
          <a className="mr-4 flex items-center space-x-2 lg:mr-6" href="/">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">BizPilot</span>
              <div className="w-2 h-2 rounded-full bg-accent"></div>
            </div>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <nav className="hidden md:flex items-center gap-4 text-sm lg:gap-6">
              <a
                className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
                href="/dashboard"
                ref={(el) => (navItemRefs.current[0] = el)}
                onMouseEnter={() => onNavItemEnter(0)}
                onMouseLeave={() => onNavItemLeave(0)}
              >
                Dashboard
              </a>
              <a
                className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
                href="/ideas"
                ref={(el) => (navItemRefs.current[1] = el)}
                onMouseEnter={() => onNavItemEnter(1)}
                onMouseLeave={() => onNavItemLeave(1)}
              >
                Ideas
              </a>
              <a
                className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
                href="/pricing"
                ref={(el) => (navItemRefs.current[2] = el)}
                onMouseEnter={() => onNavItemEnter(2)}
                onMouseLeave={() => onNavItemLeave(2)}
              >
                Pricing
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <AnimatedButton variant="ghost" size="icon" aria-label="AI Chat">
              <MessageCircle className="h-4 w-4" />
            </AnimatedButton>

            <AnimatedButton variant="ghost" size="icon" aria-label="Profile">
              <User className="h-4 w-4" />
            </AnimatedButton>

            <button
              ref={loginButtonRef}
              onClick={handleLoginClick}
              onMouseEnter={onLoginButtonEnter}
              onMouseLeave={onLoginButtonLeave}
              className="ml-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              style={{ backgroundColor: "#2fb86a" }}
              aria-label="Navigate to login page"
            >
              Login
            </button>

            <AnimatedButton
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Menu"
            >
              <Menu className="h-4 w-4" />
            </AnimatedButton>
          </div>
        </div>
      </div>
    </header>
  );
});
Header.displayName = "Header";

export { Header };
