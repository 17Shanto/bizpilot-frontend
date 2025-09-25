import * as React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { gsap } from "gsap";
import { Menu, MessageCircle, User, ChevronDown, LogOut } from "lucide-react";

const Header = React.forwardRef(({ className, ...props }, ref) => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    logout,
    user,
    getUserDisplayName,
    getUserInitials,
    getUserAvatar,
    getUserAccountStatus,
  } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const logoRef = React.useRef(null);
  const navItemRefs = React.useRef([]);
  const loginButtonRef = React.useRef(null);
  const profileButtonRef = React.useRef(null);
  const dropdownRef = React.useRef(null);

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

  const onProfileButtonEnter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const button = profileButtonRef.current;
    if (button) {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const onProfileButtonLeave = () => {
    const button = profileButtonRef.current;
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

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Get account badge styling based on account type
  const getAccountBadgeStyle = (accountType) => {
    const type = accountType?.toLowerCase();
    if (type === "free") {
      return {
        className: "bg-green-100 text-green-700 border-green-200",
        text: "Free Account",
      };
    } else if (type === "pro" || type === "enterprise") {
      return {
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
        text: `${accountType} Account`,
      };
    }
    return {
      className: "bg-green-100 text-green-700 border-green-200",
      text: "Free Account",
    };
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // GSAP animation for dropdown
  React.useEffect(() => {
    if (dropdownRef.current) {
      if (isDropdownOpen) {
        gsap.fromTo(
          dropdownRef.current,
          { opacity: 0, y: -10, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" }
        );
      }
    }
  }, [isDropdownOpen]);

  const isLoggedIn = isAuthenticated();

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
              {/* Show full navigation only when logged in */}
              {isLoggedIn && (
                <>
                  <a
                    className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
                    href="/dashboard"
                    ref={(el) => (navItemRefs.current[2] = el)}
                    onMouseEnter={() => onNavItemEnter(2)}
                    onMouseLeave={() => onNavItemLeave(2)}
                  >
                    Dashboard
                  </a>
                  <a
                    className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
                    href="/chatbot"
                    ref={(el) => (navItemRefs.current[2] = el)}
                    onMouseEnter={() => onNavItemEnter(2)}
                    onMouseLeave={() => onNavItemLeave(2)}
                  >
                    Chatbot
                  </a>
                  <a
                    className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
                    href="/pricing"
                    ref={(el) => (navItemRefs.current[3] = el)}
                    onMouseEnter={() => onNavItemEnter(3)}
                    onMouseLeave={() => onNavItemLeave(3)}
                  >
                    Pricing
                  </a>
                </>
              )}

              {/* Show only Home when not logged in */}
              {!isLoggedIn && (
                <a
                  className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
                  href="/"
                  ref={(el) => (navItemRefs.current[0] = el)}
                  onMouseEnter={() => onNavItemEnter(0)}
                  onMouseLeave={() => onNavItemLeave(0)}
                >
                  Home
                </a>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Show chatbot only when logged in */}
            {isLoggedIn && (
              <AnimatedButton
                variant="ghost"
                size="icon"
                aria-label="AI Chat"
                onClick={() => navigate("/chatbot")}
              >
                <MessageCircle className="h-4 w-4" />
              </AnimatedButton>
            )}

            {/* Authentication-dependent buttons */}
            {!isLoggedIn ? (
              // Show login button when not logged in
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
            ) : (
              // Show profile dropdown when logged in
              <div className="relative" ref={dropdownRef}>
                <button
                  ref={profileButtonRef}
                  onClick={toggleDropdown}
                  onMouseEnter={onProfileButtonEnter}
                  onMouseLeave={onProfileButtonLeave}
                  className="flex items-center space-x-2 ml-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 border border-gray-200 hover:border-gray-300"
                  aria-label="User profile menu"
                >
                  {/* Profile Avatar */}
                  <div className="flex items-center space-x-2">
                    {getUserAvatar() ? (
                      <img
                        src={getUserAvatar()}
                        alt="Profile"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: "#2fb86a" }}
                      >
                        {getUserInitials()}
                      </div>
                    )}
                    <div className="hidden sm:flex sm:flex-col sm:items-start">
                      <span className="max-w-32 truncate text-sm font-medium">
                        {getUserDisplayName()}
                      </span>
                      <Badge
                        className={`text-xs px-2 py-0.5 ${
                          getAccountBadgeStyle(getUserAccountStatus()).className
                        }`}
                        variant="outline"
                      >
                        {getAccountBadgeStyle(getUserAccountStatus()).text}
                      </Badge>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                      <div className="mt-2">
                        <Badge
                          className={`text-xs px-2 py-1 ${
                            getAccountBadgeStyle(getUserAccountStatus())
                              .className
                          }`}
                          variant="outline"
                        >
                          {getAccountBadgeStyle(getUserAccountStatus()).text}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
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
