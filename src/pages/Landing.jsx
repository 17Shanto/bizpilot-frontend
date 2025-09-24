import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { AnimatedButton } from "@/components/ui/animated-button";
import { IdeaCard } from "@/components/ui/idea-card";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import IdeaResultModal from "@/components/ideas/IdeaResultModal";
import { useAuth } from "@/context/AuthContext";
import { generateBusinessIdea } from "@/services/authService";
import { toast } from "sonner";
import {
  Lightbulb,
  TrendingUp,
  Users,
  BarChart3,
  Mic,
  ArrowRight,
  Check,
  Star,
  Globe,
  Shield,
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, token, getUserAccountStatus } = useAuth();

  const [demoInput, setDemoInput] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [generatedData, setGeneratedData] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [originalPrompt, setOriginalPrompt] = React.useState("");
  const [showRestoreNotification, setShowRestoreNotification] =
    React.useState(false);

  // Load data from localStorage on component mount
  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem("bizpilot-generated-data");
      const savedPrompt = localStorage.getItem("bizpilot-original-prompt");

      if (savedData && isAuthenticated()) {
        const parsedData = JSON.parse(savedData);
        // Show notification to restore previous session
        setShowRestoreNotification(true);
        // Don't auto-load, let user choose
        // setGeneratedData(parsedData);
      }

      if (savedPrompt) {
        setOriginalPrompt(savedPrompt);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem("bizpilot-generated-data");
      localStorage.removeItem("bizpilot-original-prompt");
    }
  }, [isAuthenticated]);

  // Save to localStorage whenever data changes
  const saveToLocalStorage = (data, prompt) => {
    try {
      if (data) {
        localStorage.setItem("bizpilot-generated-data", JSON.stringify(data));
      }
      if (prompt) {
        localStorage.setItem("bizpilot-original-prompt", prompt);
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Clear localStorage data
  const clearStoredData = () => {
    try {
      localStorage.removeItem("bizpilot-generated-data");
      localStorage.removeItem("bizpilot-original-prompt");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  // Restore previous session data
  const restorePreviousSession = () => {
    try {
      const savedData = localStorage.getItem("bizpilot-generated-data");
      const savedPrompt = localStorage.getItem("bizpilot-original-prompt");

      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setGeneratedData(parsedData);
        setShowModal(true);
        toast.success("Previous session restored!");
      }

      if (savedPrompt) {
        setOriginalPrompt(savedPrompt);
      }

      setShowRestoreNotification(false);
    } catch (error) {
      console.error("Error restoring session:", error);
      toast.error("Failed to restore previous session");
      clearStoredData();
      setShowRestoreNotification(false);
    }
  };

  // Dismiss restore notification and clear old data
  const dismissRestoreNotification = () => {
    setShowRestoreNotification(false);
    clearStoredData();
  };

  const handleDemoSubmit = async () => {
    if (!demoInput.trim()) return;

    // Check if user is logged in
    if (!isAuthenticated()) {
      setErrorMessage("Please log in to generate business ideas");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");

    try {
      // Generate the prompt with the format: "idea, location, and budget"
      const prompt = demoInput.trim();
      const accountType = getUserAccountStatus();

      // Save the original prompt for potential iterative updates
      setOriginalPrompt(prompt);

      const response = await generateBusinessIdea(
        prompt,
        user._id,
        token,
        accountType
      );

      if (response.statusCode === 201 && response.data) {
        setGeneratedData(response.data);
        // Save to localStorage for persistence
        saveToLocalStorage(response.data, prompt);
        setShowModal(true);
        toast.success("Business idea generated successfully!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error generating business idea:", error);
      setErrorMessage("Failed to generate idea. Please try again.");
      toast.error("Failed to generate business idea");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle iterative updates to existing business ideas
  const handleIterativeUpdate = async (modification) => {
    if (!generatedData || !originalPrompt || !modification.trim()) {
      toast.error("No previous idea to modify or invalid modification");
      return;
    }

    // Check if user is logged in
    if (!isAuthenticated()) {
      toast.error("Please log in to modify business ideas");
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");

    try {
      const accountType = getUserAccountStatus();

      const response = await generateBusinessIdea(
        originalPrompt, // Original prompt (not used when modification provided)
        user._id,
        token,
        accountType,
        modification, // Modification text
        generatedData // Previous output for context
      );

      if (response.statusCode === 201 && response.data) {
        console.log("🎉 ITERATIVE UPDATE SUCCESS:");
        console.log("📥 New data from server:", response.data);
        console.log("📊 Previous data (before update):", generatedData);

        setGeneratedData(response.data);

        console.log("✅ State updated with new data");

        // Save updated data to localStorage
        saveToLocalStorage(response.data, originalPrompt);
        toast.success("Business idea updated successfully!");

        console.log("💾 New data saved to localStorage");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error updating business idea:", error);
      setErrorMessage("Failed to update idea. Please try again.");
      toast.error("Failed to update business idea");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Restore Previous Session Notification */}
      {showRestoreNotification && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="container max-w-screen-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Previous session found
                  </p>
                  <p className="text-xs text-blue-700">
                    You have an unsaved business idea from a previous session.
                    Would you like to restore it?
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={restorePreviousSession}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Restore
                </button>
                <button
                  onClick={dismissRestoreNotification}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient py-16 lg:py-24">
        <div className="container max-w-screen-2xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-accent/10 text-accent border-accent/20 font-medium">
                  🇧🇩 Made for Bangladesh Entrepreneurs
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                  Your AI Business
                  <span className="text-primary block">Planning Assistant</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-lg">
                  Transform your business ideas into actionable plans with
                  AI-powered insights, market analysis, and growth strategies
                  tailored for Bangladesh.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <AnimatedButton
                  variant="hero"
                  size="xl"
                  className="flex-1 sm:flex-none"
                >
                  Try Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </AnimatedButton>
                <AnimatedButton variant="outline" size="xl">
                  See Pricing
                </AnimatedButton>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="BizPilot AI Business Planning Interface"
                className="rounded-2xl card-shadow-hover w-full h-auto"
              />
              <div className="absolute -bottom-4 -right-4 bg-card p-4 rounded-xl card-shadow border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    AI Analysis in Progress
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-screen-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              See BizPilot in Action
            </h2>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              Enter a business idea and watch our AI generate multiple business
              models instantly.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                AI Demo: Business Idea Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="E.g., Eco-friendly food delivery service in Dhaka with $5000 budget"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleDemoSubmit()}
                />
                <AnimatedButton
                  variant="ghost"
                  size="icon"
                  aria-label="Voice input"
                >
                  <Mic className="h-4 w-4" />
                </AnimatedButton>
                <AnimatedButton
                  onClick={handleDemoSubmit}
                  disabled={!demoInput.trim() || isGenerating}
                  className="min-w-[140px]"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </div>
                  ) : (
                    "Generate Models"
                  )}
                </AnimatedButton>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}

              {/* Mock demo results removed - now using real API integration */}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container max-w-screen-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Everything You Need to Launch
            </h2>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              From idea validation to market entry, BizPilot guides every step
              of your entrepreneurial journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Market Analysis",
                description:
                  "Real-time insights into Bangladesh market trends, competitor analysis, and opportunities.",
              },
              {
                icon: TrendingUp,
                title: "Growth Modeling",
                description:
                  "AI-powered revenue forecasts and growth strategies tailored to your business model.",
              },
              {
                icon: Users,
                title: "Customer Insights",
                description:
                  "Deep understanding of your target audience with Bangladesh-specific demographics.",
              },
              {
                icon: Globe,
                title: "Local Expertise",
                description:
                  "Business regulations, tax structures, and market nuances specific to Bangladesh.",
              },
              {
                icon: Shield,
                title: "Risk Assessment",
                description:
                  "Identify potential challenges and mitigation strategies before you invest.",
              },
              {
                icon: Lightbulb,
                title: "Innovation Hub",
                description:
                  "Explore new business models and pivot strategies based on market feedback.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center card-shadow hover:card-shadow-hover transition-smooth"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-balance">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-screen-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              Choose the plan that fits your entrepreneurial journey. Start
              free, upgrade as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "৳0",
                period: "forever",
                description: "Perfect for exploring ideas",
                features: [
                  "3 business idea analyses per month",
                  "Basic market insights",
                  "Community support",
                  "Bangladesh market data",
                ],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "৳2,500",
                period: "per month",
                description: "For serious entrepreneurs",
                features: [
                  "Unlimited idea analyses",
                  "Advanced AI insights",
                  "Priority support",
                  "Custom market reports",
                  "Growth tracking",
                  "Export capabilities",
                ],
                cta: "Start Free Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "pricing",
                description: "For incubators & organizations",
                features: [
                  "Everything in Pro",
                  "Bulk processing",
                  "Team collaboration",
                  "API access",
                  "Custom integrations",
                  "Dedicated support",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular ? "ring-2 ring-primary" : ""
                } card-shadow hover:card-shadow-hover transition-smooth`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">
                      {plan.period}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-balance">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <AnimatedButton
                    variant={plan.popular ? "hero" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    {plan.cta}
                  </AnimatedButton>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container max-w-screen-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Trusted by Bangladesh Entrepreneurs
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Fatima Rahman",
                role: "Tech Startup Founder, Dhaka",
                content:
                  "BizPilot helped me validate my e-commerce idea and create a solid business plan. The Bangladesh-specific insights were invaluable.",
                rating: 5,
              },
              {
                name: "Rahim Ahmed",
                role: "Restaurant Chain Owner, Chittagong",
                content:
                  "The AI-generated financial projections were incredibly accurate. Saved me weeks of manual planning and research.",
                rating: 5,
              },
              {
                name: "Nasir Uddin",
                role: "Export Business, Sylhet",
                content:
                  "Finally, a tool that understands the Bangladesh market. The export guidance features are game-changing.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="card-shadow hover:card-shadow-hover transition-smooth"
              >
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 text-balance">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 hero-gradient">
        <div className="container max-w-screen-2xl mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
              Ready to Build Your Dream Business?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground text-balance">
              Join thousands of entrepreneurs who trust BizPilot to turn their
              ideas into successful businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton variant="hero" size="xl">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </AnimatedButton>
              <AnimatedButton variant="outline" size="xl">
                Schedule Demo
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40 bg-card/50">
        <div className="container max-w-screen-2xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary">BizPilot</span>
                <div className="w-2 h-2 rounded-full bg-accent"></div>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering Bangladesh entrepreneurs with AI-driven business
                insights and planning tools.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 BizPilot. Made with ❤️ for Bangladesh entrepreneurs.
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 md:mt-0">
              <span>🇧🇩</span>
              <span>Proudly Bangladesh</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Idea Result Modal */}
      <IdeaResultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        idea={generatedData?.idea}
        business_models={generatedData?.business_models}
        roadmap={generatedData?.roadmap}
        feasibility={generatedData?.feasibility}
        automation_insights={generatedData?.automation_insights}
        onIterativeUpdate={handleIterativeUpdate}
        isGenerating={isGenerating}
        onClearSession={() => {
          clearStoredData();
          setGeneratedData(null);
          setOriginalPrompt("");
          setShowModal(false);
          toast.success("Session cleared successfully!");
        }}
      />
    </div>
  );
};

export default Landing;
