import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  X,
  TrendingUp,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
  Star,
  Crown,
  Sparkles,
  BarChart3,
  Brain,
  MessageSquare,
  Zap,
  DollarSign,
} from "lucide-react";

const IdeaResultModal = ({
  isOpen,
  onClose,
  idea,
  business_models,
  roadmap,
  feasibility,
  automation_insights,
}) => {
  const { getUserAccountStatus } = useAuth();
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const cardRefs = useRef([]);

  const accountType = getUserAccountStatus();
  const isPro = accountType?.toLowerCase() === "pro";

  useEffect(() => {
    if (isOpen) {
      // Animate modal entrance
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );

      gsap.fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
          delay: 0.1,
        }
      );

      // Animate cards with stagger
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.3,
        }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
    });

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  const handleCardHover = (element, isEnter) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.to(element, {
      scale: isEnter ? 1.02 : 1,
      y: isEnter ? -5 : 0,
      boxShadow: isEnter
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      duration: 0.2,
      ease: "power2.out",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Business Idea Analysis
                </h2>
                <p className="text-green-100">
                  AI-Generated Insights for Your Business
                </p>
              </div>
              <Badge
                className={`${
                  isPro
                    ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                    : "bg-green-100 text-green-800 border-green-300"
                }`}
                variant="outline"
              >
                {isPro ? (
                  <div className="flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Pro Account
                  </div>
                ) : (
                  "Free Account"
                )}
              </Badge>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-white hover:text-green-100 transition-colors rounded-full hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Idea Overview */}
          <div
            ref={addToRefs}
            className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100"
            onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleCardHover(e.currentTarget, false)}
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Idea Overview</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Business Concept
                </h4>
                <p className="text-gray-600">
                  {idea?.title || "Business Idea"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Location</h4>
                <p className="text-gray-600">
                  {idea?.location || "Bangladesh"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Initial Budget
                </h4>
                <p className="text-gray-600">
                  {idea?.budget || "Budget not specified"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Category</h4>
                <p className="text-gray-600">
                  {idea?.category || "General Business"}
                </p>
              </div>
            </div>
          </div>

          {/* Business Models */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Business Models
                </h3>
              </div>
              {!isPro && business_models?.length >= 2 && (
                <Badge
                  className="bg-orange-100 text-orange-700 border-orange-200"
                  variant="outline"
                >
                  Limited to {business_models?.length || 2} models
                </Badge>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {business_models?.map((model, index) => (
                <div
                  key={index}
                  ref={addToRefs}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
                  onMouseLeave={(e) => handleCardHover(e.currentTarget, false)}
                >
                  <h4 className="text-lg font-bold text-gray-900 mb-3">
                    {model.name}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {model.summery || model.summary}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-gray-700 text-sm mb-1">
                        Revenue Forecast
                      </h5>
                      <div className="text-green-600 font-medium text-sm">
                        {model.revenue_forecast &&
                        typeof model.revenue_forecast === "object" ? (
                          <div className="space-y-1">
                            {Object.entries(model.revenue_forecast)
                              .slice(0, 3)
                              .map(([period, amount]) => (
                                <div
                                  key={period}
                                  className="flex justify-between"
                                >
                                  <span>{period.replace("_", " ")}:</span>
                                  <span>${amount}</span>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p>{model.revenue_forecast}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-700 text-sm mb-1">
                        Cost Breakdown
                      </h5>
                      <div className="text-gray-600 text-sm">
                        {model.cost_breakdown &&
                        typeof model.cost_breakdown === "object" ? (
                          <div className="grid grid-cols-2 gap-1">
                            {Object.entries(model.cost_breakdown).map(
                              ([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="capitalize">{key}:</span>
                                  <span>${value}</span>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <p>{model.cost_breakdown}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <h5 className="font-semibold text-gray-700 text-sm mb-1">
                          Opportunities
                        </h5>
                        <div className="text-blue-600 text-sm">
                          {Array.isArray(model.opportunities) ? (
                            <ul className="space-y-1">
                              {model.opportunities
                                .slice(0, 2)
                                .map((opportunity, idx) => (
                                  <li key={idx} className="text-xs">
                                    • {opportunity}
                                  </li>
                                ))}
                            </ul>
                          ) : (
                            <p>{model.opportunities}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-700 text-sm mb-1">
                          Risks
                        </h5>
                        <div className="text-red-600 text-sm">
                          {Array.isArray(model.risks) ? (
                            <ul className="space-y-1">
                              {model.risks.slice(0, 2).map((risk, idx) => (
                                <li key={idx} className="text-xs">
                                  • {risk}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>{model.risks}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Business Roadmap
              </h3>
            </div>
            <div
              ref={addToRefs}
              className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100"
              onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
              onMouseLeave={(e) => handleCardHover(e.currentTarget, false)}
            >
              <div className="space-y-4">
                {roadmap?.map((milestone, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: "#2fb86a" }}
                      >
                        {milestone.month}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        Month {milestone.month} Goals
                      </h4>
                      {Array.isArray(milestone.milestones) && (
                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                          {milestone.milestones.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pro-only Automation Insights */}
          {isPro && automation_insights && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Automation Insights
                </h3>
                <Badge
                  className="bg-purple-100 text-purple-700 border-purple-200"
                  variant="outline"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Pro Feature
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {automation_insights.predictive_inventory && (
                  <div
                    ref={addToRefs}
                    className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100"
                    onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
                    onMouseLeave={(e) =>
                      handleCardHover(e.currentTarget, false)
                    }
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">
                        Predictive Inventory
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {automation_insights.predictive_inventory}
                    </p>
                  </div>
                )}

                {automation_insights.employee_optimization && (
                  <div
                    ref={addToRefs}
                    className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100"
                    onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
                    onMouseLeave={(e) =>
                      handleCardHover(e.currentTarget, false)
                    }
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">
                        Employee Optimization
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {automation_insights.employee_optimization}
                    </p>
                  </div>
                )}

                {automation_insights.anomaly_detection && (
                  <div
                    ref={addToRefs}
                    className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border border-red-100"
                    onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
                    onMouseLeave={(e) =>
                      handleCardHover(e.currentTarget, false)
                    }
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-red-600" />
                      <h4 className="font-semibold text-gray-900">
                        Anomaly Detection
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {automation_insights.anomaly_detection}
                    </p>
                  </div>
                )}

                {automation_insights.cashflow_scenarios && (
                  <div
                    ref={addToRefs}
                    className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl border border-green-100"
                    onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
                    onMouseLeave={(e) =>
                      handleCardHover(e.currentTarget, false)
                    }
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">
                        Cashflow Scenarios
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {automation_insights.cashflow_scenarios}
                    </p>
                  </div>
                )}

                {automation_insights.conversational_coach && (
                  <div
                    ref={addToRefs}
                    className="bg-gradient-to-br from-yellow-50 to-white p-4 rounded-xl border border-yellow-100"
                    onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
                    onMouseLeave={(e) =>
                      handleCardHover(e.currentTarget, false)
                    }
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-semibold text-gray-900">
                        Conversational Coach
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {automation_insights.conversational_coach}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Feasibility Score */}
          <div
            ref={addToRefs}
            className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border border-yellow-100"
            onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleCardHover(e.currentTarget, false)}
          >
            <div className="flex items-center gap-3 mb-6">
              <Star className="h-6 w-6 text-yellow-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Feasibility Analysis
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {feasibility?.profitable ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  )}
                </div>
                <h4 className="font-semibold text-gray-700">Profitability</h4>
                <p
                  className={`text-sm ${
                    feasibility?.profitable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {feasibility?.profitable
                    ? "Likely Profitable"
                    : "Needs Review"}
                </p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {feasibility?.confidence_score || "N/A"} / 10
                </div>
                <h4 className="font-semibold text-gray-700">
                  Confidence Score
                </h4>
                <p className="text-sm text-gray-600">AI Analysis Confidence</p>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 mb-2">
                  {feasibility?.recommended_model || "Model 1"}
                </div>
                <h4 className="font-semibold text-gray-700">Recommended</h4>
                <p className="text-sm text-gray-600">Best Business Model</p>
              </div>
            </div>
          </div>

          {/* Upgrade CTA for Free Users */}
          {!isPro && (
            <div
              ref={addToRefs}
              className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-orange-100 p-6 rounded-xl border-2 border-yellow-200"
              onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
              onMouseLeave={(e) => handleCardHover(e.currentTarget, false)}
            >
              <div className="text-center">
                <Crown className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Unlock Pro Features
                </h3>
                <p className="text-gray-600 mb-4">
                  Get access to 3-5 detailed business models, extended roadmaps,
                  automation insights, and advanced AI features.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105"
                    onClick={() => {
                      // Handle upgrade action
                      console.log("Upgrade to Pro clicked");
                    }}
                  >
                    <Crown className="h-5 w-5 inline mr-2" />
                    Upgrade to Pro
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              className="flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors"
              style={{ backgroundColor: "#2fb86a" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#059669")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#2fb86a")}
            >
              Save to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaResultModal;
