import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { AnimatedButton } from "@/components/ui/animated-button";
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
  Languages,
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

  // Voice-to-text state
  const [isListening, setIsListening] = React.useState(false);
  const [recognition, setRecognition] = React.useState(null);
  const [speechSupported, setSpeechSupported] = React.useState(false);
  const [isTranslating, setIsTranslating] = React.useState(false);
  const [currentLanguage, setCurrentLanguage] = React.useState("bn-BD"); // Start with Bangla

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

  // Translation service function (using Google Translate API alternative - MyMemory)
  const translateText = async (text, fromLang = "bn", toLang = "en") => {
    try {
      setIsTranslating(true);
      console.log("🌐 Translating text:", text, "from", fromLang, "to", toLang);

      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=${fromLang}|${toLang}`
      );

      if (!response.ok) {
        throw new Error("Translation service error");
      }

      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData) {
        const translatedText = data.responseData.translatedText;
        console.log("✅ Translation successful:", translatedText);
        return translatedText;
      } else {
        throw new Error("Translation failed");
      }
    } catch (error) {
      console.error("❌ Translation error:", error);
      toast.error("Translation failed. Using original text.");
      return text; // Return original text if translation fails
    } finally {
      setIsTranslating(false);
    }
  };

  // Detect if text is primarily Bangla (simple detection)
  const isBanglaText = (text) => {
    const banglaRegex = /[\u0980-\u09FF]/;
    const banglaCharCount = (text.match(/[\u0980-\u09FF]/g) || []).length;
    const totalCharCount = text.replace(/\s/g, "").length;
    return banglaCharCount / totalCharCount > 0.3; // If more than 30% Bangla characters
  };

  // Initialize Speech Recognition
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);

        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = currentLanguage; // Use dynamic language

        recognitionInstance.onstart = () => {
          console.log("🎤 Voice recognition started");
          setIsListening(true);
        };

        recognitionInstance.onresult = async (event) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          // Process final transcript
          if (finalTranscript) {
            let processedText = finalTranscript.trim();

            // If we're using Bangla recognition or detect Bangla text, translate it
            if (currentLanguage === "bn-BD" || isBanglaText(processedText)) {
              console.log("🔄 Detected Bangla text, translating to English...");
              processedText = await translateText(processedText, "bn", "en");
            }

            // Update the input with processed text
            setDemoInput((prev) => {
              const cleanPrev = prev.trim();
              const cleanTranscript = processedText;
              if (cleanPrev && cleanTranscript) {
                return cleanPrev + " " + cleanTranscript;
              } else if (cleanTranscript) {
                return cleanTranscript;
              }
              return cleanPrev;
            });
          }

          // For interim results, we could show them in a different way if needed
          // For now, we'll just show them as they come in the console
          if (interimTranscript) {
            console.log("🎤 Interim result:", interimTranscript);
          }
        };

        recognitionInstance.onerror = (event) => {
          console.error("🎤 Speech recognition error:", event.error);
          setIsListening(false);

          // Handle different error types
          if (event.error === "not-allowed") {
            toast.error(
              "Microphone access denied. Please allow microphone permissions."
            );
          } else if (event.error === "no-speech") {
            toast.error("No speech detected. Please try again.");
          } else {
            toast.error("Voice recognition error. Please try again.");
          }
        };

        recognitionInstance.onend = () => {
          console.log("🎤 Voice recognition ended");
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } else {
        console.warn("🎤 Speech Recognition not supported in this browser");
        setSpeechSupported(false);
      }
    }

    // Cleanup function
    return () => {
      if (recognition) {
        recognition.stop();
        setIsListening(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);

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

  // Toggle language between Bangla and English
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "bn-BD" ? "en-US" : "bn-BD";
    setCurrentLanguage(newLanguage);
    console.log("🌐 Language switched to:", newLanguage);

    // Stop current recognition if active and restart with new language
    if (isListening && recognition) {
      recognition.stop();
    }
  };

  // Toggle voice recognition
  const toggleVoiceRecognition = () => {
    if (!speechSupported) {
      toast.error("Voice recognition is not supported in your browser.");
      return;
    }

    if (!recognition) {
      toast.error("Voice recognition is not initialized.");
      return;
    }

    if (isListening) {
      console.log("🎤 Stopping voice recognition");
      recognition.stop();
      setIsListening(false);
    } else {
      console.log("🎤 Starting voice recognition");
      try {
        recognition.start();
      } catch (error) {
        console.error("🎤 Error starting recognition:", error);
        toast.error("Failed to start voice recognition. Please try again.");
      }
    }
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
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="E.g., Eco-friendly food delivery service in Dhaka with $5000 budget"
                      value={demoInput}
                      onChange={(e) => setDemoInput(e.target.value)}
                      className={`flex-1 ${
                        isListening
                          ? "ring-2 ring-primary border-primary shadow-md"
                          : ""
                      }`}
                      onKeyDown={(e) => e.key === "Enter" && handleDemoSubmit()}
                    />
                    {(isListening || isTranslating) && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full animate-pulse ${
                              isTranslating ? "bg-blue-500" : "bg-red-500"
                            }`}
                          ></div>
                          <span className="text-xs text-primary font-medium">
                            {isTranslating ? "Translating..." : "Listening..."}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Language Toggle Button */}
                  <AnimatedButton
                    variant="ghost"
                    size="icon"
                    aria-label={`Switch to ${
                      currentLanguage === "bn-BD" ? "English" : "Bangla"
                    } input`}
                    onClick={toggleLanguage}
                    disabled={isListening}
                    className={`transition-all duration-200 ${
                      currentLanguage === "bn-BD"
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${isListening ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={`Currently: ${
                      currentLanguage === "bn-BD" ? "বাংলা" : "English"
                    } | Click to switch`}
                  >
                    <Languages className="h-4 w-4" />
                    <span className="absolute -bottom-1 -right-1 text-xs font-bold">
                      {currentLanguage === "bn-BD" ? "বাং" : "EN"}
                    </span>
                  </AnimatedButton>
                  <AnimatedButton
                    variant="ghost"
                    size="icon"
                    aria-label={
                      isListening ? "Stop voice input" : "Start voice input"
                    }
                    onClick={toggleVoiceRecognition}
                    disabled={!speechSupported}
                    className={`transition-all duration-200 ${
                      isListening
                        ? "bg-primary text-white hover:bg-primary/90 shadow-lg animate-pulse"
                        : speechSupported
                        ? "hover:bg-primary/10 hover:text-primary"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    style={isListening ? { backgroundColor: "#2fb86a" } : {}}
                    title={
                      !speechSupported
                        ? "Voice input not supported in your browser"
                        : isListening
                        ? "Click to stop listening"
                        : "Click to start voice input"
                    }
                  >
                    <Mic
                      className={`h-4 w-4 ${
                        isListening ? "animate-pulse" : ""
                      }`}
                    />
                    {isListening && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    )}
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
                {speechSupported ? (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mic className="h-3 w-3" />
                      <Languages className="h-3 w-3" />
                      Voice input supports both বাংলা and English with
                      auto-translation
                    </p>
                    <p className="text-xs text-gray-500">
                      Current language:{" "}
                      <span className="font-medium text-primary">
                        {currentLanguage === "bn-BD"
                          ? "বাংলা (Bangla)"
                          : "English"}
                      </span>
                      {currentLanguage === "bn-BD" &&
                        " → Auto-translate to English"}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Voice input not supported in your browser. Please type your
                    business idea.
                  </p>
                )}
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
              © 2024 BizPilot. Made for Bangladesh entrepreneurs.
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
