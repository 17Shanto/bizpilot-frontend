import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Check, Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/header";
import { toast } from "sonner";

const PricePage = () => {
  const { user, token, updateUser, getUserAccountStatus } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const freeCardRef = useRef(null);
  const proCardRef = useRef(null);
  const proButtonRef = useRef(null);

  const userAccount = getUserAccountStatus();
  const isPro = userAccount?.toLowerCase() === "pro";

  useEffect(() => {
    // GSAP animations for pricing cards
    const setupCardAnimation = (cardRef) => {
      const card = cardRef.current;
      if (card) {
        const handleMouseEnter = () => {
          gsap.to(card, {
            scale: 1.03,
            boxShadow: "0 20px 40px rgba(47, 184, 106, 0.15)",
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            scale: 1,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            duration: 0.3,
            ease: "power2.out",
          });
        };

        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          card.removeEventListener("mouseenter", handleMouseEnter);
          card.removeEventListener("mouseleave", handleMouseLeave);
        };
      }
    };

    // Setup animations for both cards
    const cleanupFree = setupCardAnimation(freeCardRef);
    const cleanupPro = setupCardAnimation(proCardRef);

    // Pro button animation
    const proButton = proButtonRef.current;
    if (proButton && !isPro && !isUpgrading) {
      const handleButtonMouseEnter = () => {
        gsap.to(proButton, {
          scale: 1.05,
          boxShadow: "0 0 25px rgba(47, 184, 106, 0.4)",
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleButtonMouseLeave = () => {
        gsap.to(proButton, {
          scale: 1,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      };

      proButton.addEventListener("mouseenter", handleButtonMouseEnter);
      proButton.addEventListener("mouseleave", handleButtonMouseLeave);

      return () => {
        if (cleanupFree) cleanupFree();
        if (cleanupPro) cleanupPro();
        proButton.removeEventListener("mouseenter", handleButtonMouseEnter);
        proButton.removeEventListener("mouseleave", handleButtonMouseLeave);
      };
    }

    return () => {
      if (cleanupFree) cleanupFree();
      if (cleanupPro) cleanupPro();
    };
  }, [isPro, isUpgrading]);

  const handleUpgradeClick = async () => {
    if (!user?._id || !token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    setIsUpgrading(true);

    try {
      const response = await fetch(
        `https://bizpilot-backend.vercel.app/bizpilot-api/user/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            account: "Pro",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upgrade account");
      }

      const data = await response.json();

      // Update the user context with the new account status
      if (data.data?.account) {
        updateUser({ account: data.data.account });
      } else {
        updateUser({ account: "Pro" });
      }

      toast.success(
        "🎉 Successfully upgraded to Pro! You now have access to all premium features."
      );

      console.log("Account upgraded successfully:", data);
    } catch (error) {
      console.error("Upgrade failed:", error);
      toast.error(`Upgrade failed: ${error.message}`);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Header />
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade anytime for advanced AI insights
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan Card */}
            <div
              ref={freeCardRef}
              className="relative bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
              style={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
            >
              {/* Active Badge */}
              <div className="absolute top-4 right-4">
                {!isPro ? (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </span>
                ) : (
                  <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Previous Plan
                  </span>
                )}
              </div>

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">৳0</span>
                  <span className="text-gray-600 ml-2">/ forever</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    3 business idea generations per month
                  </span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Basic market insights</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Community support</span>
                </div>
              </div>

              {/* Button */}
              <button
                disabled
                className="w-full py-3 px-6 rounded-lg font-medium bg-gray-100 text-gray-500 cursor-not-allowed transition-colors"
              >
                {!isPro ? "Current Plan" : "Previous Plan"}
              </button>
            </div>

            {/* Pro Plan Card */}
            <div
              ref={proCardRef}
              className="relative bg-white rounded-2xl shadow-lg p-8 border-2 border-green-500"
              style={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {isPro ? (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Active
                  </span>
                ) : (
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Upgrade Available
                  </span>
                )}
              </div>

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-green-600">
                    ৳2,500
                  </span>
                  <span className="text-gray-600 ml-2">/ month</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Unlimited idea generations
                  </span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Advanced AI insights</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Full automation features (cashflow, anomaly detection, etc.)
                  </span>
                </div>
              </div>

              {/* Button */}
              <button
                ref={proButtonRef}
                onClick={isPro ? undefined : handleUpgradeClick}
                disabled={isPro || isUpgrading}
                className={`w-full py-3 px-6 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors ${
                  isPro
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : isUpgrading
                    ? "bg-green-400 text-white cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
              >
                {isPro ? (
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="h-4 w-4" />
                    Current Plan
                  </div>
                ) : isUpgrading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Upgrading...
                  </div>
                ) : (
                  "Upgrade to Pro"
                )}
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-4">
              Need a custom solution for your enterprise?
            </p>
            <button className="text-green-600 hover:text-green-700 font-medium transition-colors">
              Contact our sales team
            </button>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Can I switch plans anytime?
                </h4>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time.
                  Changes take effect immediately, and we'll prorate any
                  charges.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  What happens if I exceed my free plan limits?
                </h4>
                <p className="text-gray-600">
                  You'll receive a notification when you're close to your
                  limits. You can either wait for the next month's reset or
                  upgrade to Pro for unlimited access.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Is there a money-back guarantee?
                </h4>
                <p className="text-gray-600">
                  Yes, we offer a 30-day money-back guarantee for Pro
                  subscriptions. If you're not satisfied, we'll refund your
                  payment in full.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricePage;
