import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/services/authService";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  const googleButtonRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const card = cardRef.current;
    const button = buttonRef.current;
    const googleButton = googleButtonRef.current;

    // Card hover animations
    const handleCardMouseEnter = () => {
      gsap.to(card, {
        scale: 1.01,
        boxShadow: "0 25px 50px -12px rgba(47, 184, 106, 0.25)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleCardMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Button hover animations
    const handleButtonMouseEnter = () => {
      gsap.to(button, {
        scale: 1.03,
        boxShadow: "0 0 20px rgba(47, 184, 106, 0.5)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleButtonMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Google button hover animations
    const handleGoogleButtonMouseEnter = () => {
      gsap.to(googleButton, {
        scale: 1.02,
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleGoogleButtonMouseLeave = () => {
      gsap.to(googleButton, {
        scale: 1,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Add event listeners
    card.addEventListener("mouseenter", handleCardMouseEnter);
    card.addEventListener("mouseleave", handleCardMouseLeave);
    button.addEventListener("mouseenter", handleButtonMouseEnter);
    button.addEventListener("mouseleave", handleButtonMouseLeave);
    if (googleButton) {
      googleButton.addEventListener("mouseenter", handleGoogleButtonMouseEnter);
      googleButton.addEventListener("mouseleave", handleGoogleButtonMouseLeave);
    }

    // Cleanup
    return () => {
      card.removeEventListener("mouseenter", handleCardMouseEnter);
      card.removeEventListener("mouseleave", handleCardMouseLeave);
      button.removeEventListener("mouseenter", handleButtonMouseEnter);
      button.removeEventListener("mouseleave", handleButtonMouseLeave);
      if (googleButton) {
        googleButton.removeEventListener(
          "mouseenter",
          handleGoogleButtonMouseEnter
        );
        googleButton.removeEventListener(
          "mouseleave",
          handleGoogleButtonMouseLeave
        );
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const result = await login(email, password);
        if (result) {
          console.log("Logged in successfully:", result.user);
          navigate("/dashboard");
        }
      } catch (error) {
        setErrors({ auth: getErrorMessage(error) });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Header />
      <div className="flex items-center justify-center p-4 pt-8">
        <div
          ref={cardRef}
          className="w-full max-w-md bg-gradient-to-b from-green-50 to-white rounded-2xl shadow-lg p-8 transition-all duration-300"
        >
          {/* Header with BizPilot Logo */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "#2fb86a" }}
            >
              BizP
              <span className="relative">
                i
                <span className="absolute top-0 right-0 w-1 h-1 bg-red-500 rounded-full transform translate-x-1 -translate-y-1"></span>
              </span>
              lot
            </h1>
            <p className="text-gray-600 text-sm">
              Welcome back to your business dashboard
            </p>
          </div>

          {/* Auth Error Display */}
          {errors.auth && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600" role="alert">
                {errors.auth}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-400" : "border-gray-200"
                }`}
                style={{
                  "--focus-ring-color": "#2fb86a",
                  "--focus-border-color": "#2fb86a",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2fb86a";
                  e.target.style.boxShadow =
                    "0 0 0 2px rgba(47, 184, 106, 0.2)";
                }}
                onBlur={(e) => {
                  if (!errors.email) {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }
                }}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-400" : "border-gray-200"
                }`}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2fb86a";
                  e.target.style.boxShadow =
                    "0 0 0 2px rgba(47, 184, 106, 0.2)";
                }}
                onBlur={(e) => {
                  if (!errors.password) {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }
                }}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                aria-label="Remember me"
                className="h-4 w-4 border-gray-300 rounded focus:outline-none"
                style={{
                  accentColor: "#2fb86a",
                  "--focus-ring-color": "#2fb86a",
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow =
                    "0 0 0 2px rgba(47, 184, 106, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                }}
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>

              {/* Forgot Password Link */}
              <div className="ml-auto">
                <a
                  href="#"
                  className="text-sm text-gray-500 transition-colors duration-200"
                  style={{ "--hover-color": "#2fb86a" }}
                  onMouseEnter={(e) => (e.target.style.color = "#2fb86a")}
                  onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              ref={buttonRef}
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 px-4 rounded-lg font-medium shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#2fb86a",
                "--focus-ring-color": "#2fb86a",
              }}
              onFocus={(e) => {
                e.target.style.boxShadow =
                  "0 0 0 2px rgba(47, 184, 106, 0.2), 0 0 0 4px rgba(47, 184, 106, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
            >
              {isLoading ? "Signing in..." : "Login with Email"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="font-medium transition-colors duration-200 hover:underline"
                style={{ color: "#2fb86a" }}
                onMouseEnter={(e) => (e.target.style.color = "#059669")}
                onMouseLeave={(e) => (e.target.style.color = "#2fb86a")}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
