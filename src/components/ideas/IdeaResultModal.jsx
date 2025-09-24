import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
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
  RefreshCw,
  Edit3,
  Download,
  FileText,
} from "lucide-react";

const IdeaResultModal = ({
  isOpen,
  onClose,
  idea,
  business_models,
  roadmap,
  feasibility,
  automation_insights,
  onIterativeUpdate,
  isGenerating,
  onClearSession,
}) => {
  const { getUserAccountStatus } = useAuth();
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const cardRefs = useRef([]);

  const [modificationInput, setModificationInput] = useState("");
  const [showModificationSection, setShowModificationSection] = useState(false);

  const accountType = getUserAccountStatus();
  const isPro = accountType?.toLowerCase() === "pro";

  // Log when modal receives new data
  useEffect(() => {
    if (isOpen && idea) {
      console.log("🎭 MODAL UPDATED WITH NEW DATA:");
      console.log("💡 Idea:", idea);
      console.log("🏢 Business Models:", business_models);
      console.log("🗺️ Roadmap:", roadmap);
      console.log("📈 Feasibility:", feasibility);
      console.log("🤖 Automation Insights:", automation_insights);
      console.log("📊 Data comparison - Idea title:", idea?.title);
      console.log("📊 Data comparison - Budget:", idea?.budget);
    }
  }, [
    isOpen,
    idea,
    business_models,
    roadmap,
    feasibility,
    automation_insights,
  ]);

  // Log when any prop changes to track re-renders
  useEffect(() => {
    console.log("🔍 MODAL PROPS CHANGED - Re-render triggered");
  });

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

  const handleModificationSubmit = () => {
    if (!modificationInput.trim() || isGenerating) return;

    console.log("🔄 MODIFICATION SUBMITTED FROM MODAL:");
    console.log("📝 Modification text:", modificationInput.trim());
    console.log("📊 Current idea data being modified:", {
      idea,
      business_models,
      roadmap,
      feasibility,
    });

    if (onIterativeUpdate) {
      onIterativeUpdate(modificationInput.trim());
      setModificationInput("");
      setShowModificationSection(false);

      console.log("✅ Modification sent to parent component");
    }
  };

  const toggleModificationSection = () => {
    setShowModificationSection(!showModificationSection);
    setModificationInput("");
  };

  // Function to convert data to CSV format
  const convertToCSV = (data) => {
    const csvRows = [];

    // Add headers
    csvRows.push(["Field", "Value", "Details"]);

    // Basic idea information
    if (data.idea) {
      csvRows.push(["Business Idea Title", data.idea.title || "", ""]);
      csvRows.push(["Location", data.idea.location || "", ""]);
      csvRows.push(["Budget", data.idea.budget || "", ""]);
      csvRows.push(["Category", data.idea.category || "", ""]);
      csvRows.push(["Description", data.idea.description || "", ""]);
    }

    // Business models
    if (data.business_models && data.business_models.length > 0) {
      csvRows.push(["", "", ""]); // Empty row for separation
      csvRows.push(["BUSINESS MODELS", "", ""]);

      data.business_models.forEach((model, index) => {
        csvRows.push([`Model ${index + 1} - Name`, model.name || "", ""]);
        csvRows.push([`Model ${index + 1} - Summary`, model.summary || "", ""]);

        // Cost breakdown
        if (model.cost_breakdown) {
          if (typeof model.cost_breakdown === "object") {
            Object.entries(model.cost_breakdown).forEach(([key, value]) => {
              csvRows.push([
                `Model ${index + 1} - Cost: ${key}`,
                value || "",
                "",
              ]);
            });
          } else {
            csvRows.push([
              `Model ${index + 1} - Cost Breakdown`,
              model.cost_breakdown,
              "",
            ]);
          }
        }

        // Revenue forecast
        if (model.revenue_forecast) {
          if (typeof model.revenue_forecast === "object") {
            Object.entries(model.revenue_forecast).forEach(([key, value]) => {
              csvRows.push([
                `Model ${index + 1} - Revenue: ${key}`,
                value || "",
                "",
              ]);
            });
          } else {
            csvRows.push([
              `Model ${index + 1} - Revenue Forecast`,
              model.revenue_forecast,
              "",
            ]);
          }
        }

        // Risks and opportunities
        if (model.risks && Array.isArray(model.risks)) {
          model.risks.forEach((risk, riskIndex) => {
            csvRows.push([
              `Model ${index + 1} - Risk ${riskIndex + 1}`,
              risk,
              "",
            ]);
          });
        }

        if (model.opportunities && Array.isArray(model.opportunities)) {
          model.opportunities.forEach((opportunity, oppIndex) => {
            csvRows.push([
              `Model ${index + 1} - Opportunity ${oppIndex + 1}`,
              opportunity,
              "",
            ]);
          });
        }
      });
    }

    // Roadmap
    if (data.roadmap && data.roadmap.milestones) {
      csvRows.push(["", "", ""]); // Empty row for separation
      csvRows.push(["ROADMAP MILESTONES", "", ""]);

      if (Array.isArray(data.roadmap.milestones)) {
        data.roadmap.milestones.forEach((milestone, index) => {
          if (typeof milestone === "object") {
            csvRows.push([
              `Milestone ${index + 1} - Month`,
              milestone.month || "",
              "",
            ]);
            csvRows.push([
              `Milestone ${index + 1} - Title`,
              milestone.title || "",
              "",
            ]);
            csvRows.push([
              `Milestone ${index + 1} - Description`,
              milestone.description || "",
              "",
            ]);
          } else {
            csvRows.push([`Milestone ${index + 1}`, milestone, ""]);
          }
        });
      }
    }

    // Feasibility
    if (data.feasibility) {
      csvRows.push(["", "", ""]); // Empty row for separation
      csvRows.push(["FEASIBILITY ANALYSIS", "", ""]);
      csvRows.push([
        "Profitable",
        data.feasibility.profitable ? "Yes" : "No",
        "",
      ]);
      csvRows.push([
        "Recommended Model",
        data.feasibility.recommended_model || "",
        "",
      ]);
      csvRows.push([
        "Confidence Score",
        data.feasibility.confidence_score || "",
        "",
      ]);
    }

    // Automation insights (if available)
    if (data.automation_insights) {
      csvRows.push(["", "", ""]); // Empty row for separation
      csvRows.push(["AUTOMATION INSIGHTS", "", ""]);

      Object.entries(data.automation_insights).forEach(([key, value]) => {
        if (typeof value === "object") {
          csvRows.push([`Automation - ${key}`, JSON.stringify(value), ""]);
        } else {
          csvRows.push([`Automation - ${key}`, value || "", ""]);
        }
      });
    }

    // Convert to CSV string
    return csvRows
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
  };

  // Function to download CSV
  const downloadCSV = () => {
    try {
      console.log("📥 CSV DOWNLOAD INITIATED:");
      console.log("💾 Exporting data:", {
        idea,
        business_models,
        roadmap,
        feasibility,
        automation_insights,
      });

      const csvData = convertToCSV({
        idea,
        business_models,
        roadmap,
        feasibility,
        automation_insights,
      });

      console.log("📄 CSV data generated, length:", csvData.length);

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);

        // Generate filename with idea title and timestamp
        const timestamp = new Date().toISOString().slice(0, 10);
        const ideaTitle =
          idea?.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() ||
          "business_idea";
        const filename = `${ideaTitle}_${timestamp}.csv`;

        link.setAttribute("download", filename);

        console.log("📁 Filename:", filename);

        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("✅ CSV download completed successfully");
      }
    } catch (error) {
      console.error("❌ Error downloading CSV:", error);
      // You could add a toast notification here
    }
  };

  // Function to download PDF with charts
  const downloadPDF = async () => {
    try {
      console.log("📄 PDF DOWNLOAD INITIATED:");
      console.log("💾 Generating PDF with charts and data");

      // Create a new PDF document
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Add title
      pdf.setFontSize(20);
      pdf.setTextColor(47, 184, 106); // BizPilot green
      pdf.text("Business Idea Report", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 15;

      // Add idea title
      if (idea?.title) {
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Title: ${idea.title}`, 20, yPosition);
        yPosition += 10;
      }

      // Add basic info
      pdf.setFontSize(12);
      if (idea?.location) {
        pdf.text(`Location: ${idea.location}`, 20, yPosition);
        yPosition += 7;
      }
      if (idea?.budget) {
        pdf.text(`Budget: ${idea.budget}`, 20, yPosition);
        yPosition += 7;
      }
      if (idea?.category) {
        pdf.text(`Category: ${idea.category}`, 20, yPosition);
        yPosition += 10;
      }

      // Add business models section
      if (business_models && business_models.length > 0) {
        pdf.setFontSize(14);
        pdf.setTextColor(47, 184, 106);
        pdf.text("Business Models:", 20, yPosition);
        yPosition += 10;

        for (let i = 0; i < business_models.length; i++) {
          const model = business_models[i];

          // Check if we need a new page
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          pdf.text(
            `${i + 1}. ${model.name || "Business Model"}`,
            20,
            yPosition
          );
          yPosition += 7;

          if (model.summary || model.summery) {
            const summary = model.summary || model.summery;
            const splitSummary = pdf.splitTextToSize(summary, pageWidth - 40);
            pdf.text(splitSummary, 25, yPosition);
            yPosition += splitSummary.length * 5 + 5;
          }

          // Add revenue forecast data
          if (
            model.revenue_forecast &&
            typeof model.revenue_forecast === "object"
          ) {
            pdf.text("Revenue Forecast:", 25, yPosition);
            yPosition += 5;
            Object.entries(model.revenue_forecast).forEach(
              ([period, amount]) => {
                pdf.text(
                  `  ${period.replace("_", " ")}: $${amount}`,
                  30,
                  yPosition
                );
                yPosition += 5;
              }
            );
            yPosition += 3;
          }

          // Add cost breakdown data
          if (
            model.cost_breakdown &&
            typeof model.cost_breakdown === "object"
          ) {
            pdf.text("Cost Breakdown:", 25, yPosition);
            yPosition += 5;
            Object.entries(model.cost_breakdown).forEach(([key, value]) => {
              pdf.text(`  ${key}: $${value}`, 30, yPosition);
              yPosition += 5;
            });
            yPosition += 3;
          }

          yPosition += 5;
        }
      }

      // Capture charts as images and add to PDF
      const chartElements = document.querySelectorAll(
        ".bg-gray-50.p-3.rounded-lg"
      );
      let chartIndex = 0;

      for (const chartElement of chartElements) {
        if (chartIndex >= 6) break; // Limit to prevent PDF from being too large

        try {
          const canvas = await html2canvas(chartElement, {
            backgroundColor: "#f9fafb",
            scale: 2,
            logging: false,
            useCORS: true,
          });

          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 80;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Check if we need a new page for the chart
          if (yPosition + imgHeight > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.addImage(imgData, "PNG", 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
          chartIndex++;
        } catch (chartError) {
          console.warn("Failed to capture chart:", chartError);
        }
      }

      // Add feasibility analysis
      if (feasibility) {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(14);
        pdf.setTextColor(47, 184, 106);
        pdf.text("Feasibility Analysis:", 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(
          `Profitable: ${feasibility.profitable ? "Yes" : "No"}`,
          20,
          yPosition
        );
        yPosition += 7;

        if (feasibility.recommended_model) {
          pdf.text(
            `Recommended Model: ${feasibility.recommended_model}`,
            20,
            yPosition
          );
          yPosition += 7;
        }

        if (feasibility.confidence_score) {
          pdf.text(
            `Confidence Score: ${feasibility.confidence_score}`,
            20,
            yPosition
          );
          yPosition += 7;
        }
      }

      // Add footer
      const timestamp = new Date().toLocaleString();
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `Generated by BizPilot on ${timestamp}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      // Generate filename and save
      const ideaTitle =
        idea?.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() ||
        "business_idea";
      const dateStamp = new Date().toISOString().slice(0, 10);
      const filename = `${ideaTitle}_report_${dateStamp}.pdf`;

      pdf.save(filename);

      console.log("📁 PDF filename:", filename);
      console.log("✅ PDF download completed successfully");
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      // You could add a toast notification here
    }
  };

  // Chart utility functions
  const createCostBreakdownChart = (costData) => {
    if (!costData || typeof costData !== "object") return null;

    const labels = Object.keys(costData);
    const values = Object.values(costData).map((val) => {
      // Extract number from string if it contains currency symbols
      const numValue =
        typeof val === "string"
          ? parseFloat(val.replace(/[^0-9.-]/g, ""))
          : parseFloat(val) || 0;
      return numValue;
    });

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "#2fb86a",
            "#059669",
            "#10b981",
            "#34d399",
            "#6ee7b7",
            "#a7f3d0",
          ],
          borderWidth: 0,
        },
      ],
    };
  };

  const createRevenueChart = (revenueData) => {
    if (!revenueData || typeof revenueData !== "object") return null;

    const labels = Object.keys(revenueData);
    const values = Object.values(revenueData).map((val) => {
      const numValue =
        typeof val === "string"
          ? parseFloat(val.replace(/[^0-9.-]/g, ""))
          : parseFloat(val) || 0;
      return numValue;
    });

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: values,
          backgroundColor: "rgba(47, 184, 106, 0.8)",
          borderColor: "#2fb86a",
          borderWidth: 2,
        },
      ],
    };
  };

  const createRiskOpportunityChart = (risks, opportunities) => {
    const riskCount = risks ? (Array.isArray(risks) ? risks.length : 1) : 0;
    const opportunityCount = opportunities
      ? Array.isArray(opportunities)
        ? opportunities.length
        : 1
      : 0;

    return {
      labels: ["Risks", "Opportunities"],
      datasets: [
        {
          data: [riskCount, opportunityCount],
          backgroundColor: ["#ef4444", "#22c55e"],
          borderWidth: 0,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 10,
          font: {
            size: 10,
          },
        },
      },
    },
  };

  const doughnutOptions = {
    ...chartOptions,
    cutout: "60%",
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: "right",
        labels: {
          padding: 8,
          font: {
            size: 10,
          },
          usePointStyle: true,
        },
      },
    },
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
        className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div
                  className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"
                  style={{ borderTopColor: "#2fb86a" }}
                ></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Updating Business Idea
              </h3>
              <p className="text-sm text-gray-600 max-w-xs">
                AI is analyzing your modification and updating the business
                plan...
              </p>
              <div className="mt-4 flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

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
                <BarChart3
                  className="h-5 w-5 text-blue-500"
                  title="Interactive Charts Available"
                />
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

                  {/* Charts Section */}
                  <div className="space-y-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Cost Breakdown Chart */}
                      {model.cost_breakdown &&
                        typeof model.cost_breakdown === "object" && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-gray-700 text-xs mb-2 text-center">
                              Cost Breakdown
                            </h5>
                            <div style={{ height: "120px" }}>
                              <Doughnut
                                data={createCostBreakdownChart(
                                  model.cost_breakdown
                                )}
                                options={doughnutOptions}
                              />
                            </div>
                          </div>
                        )}

                      {/* Revenue Forecast Chart */}
                      {model.revenue_forecast &&
                        typeof model.revenue_forecast === "object" && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-gray-700 text-xs mb-2 text-center">
                              Revenue Forecast
                            </h5>
                            <div style={{ height: "120px" }}>
                              <Bar
                                data={createRevenueChart(
                                  model.revenue_forecast
                                )}
                                options={chartOptions}
                              />
                            </div>
                          </div>
                        )}

                      {/* Risk vs Opportunity Chart */}
                      {(model.risks || model.opportunities) && (
                        <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                          <h5 className="font-semibold text-gray-700 text-xs mb-2 text-center">
                            Risk vs Opportunity Analysis
                          </h5>
                          <div style={{ height: "100px" }}>
                            <Doughnut
                              data={createRiskOpportunityChart(
                                model.risks,
                                model.opportunities
                              )}
                              options={{
                                ...doughnutOptions,
                                plugins: {
                                  ...doughnutOptions.plugins,
                                  legend: {
                                    position: "bottom",
                                    labels: {
                                      padding: 5,
                                      font: { size: 10 },
                                      usePointStyle: true,
                                    },
                                  },
                                },
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

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

          {/* Iterative Modification Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Edit3 className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Modify This Idea
                </h3>
              </div>
              <button
                onClick={toggleModificationSection}
                disabled={isGenerating}
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showModificationSection ? "Cancel" : "Make Changes"}
              </button>
            </div>

            {showModificationSection && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 mb-3">
                    Tell us what you'd like to change about this business idea:
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., What if the budget increased by 20%? or What if material costs increased by 15%?"
                      value={modificationInput}
                      onChange={(e) => setModificationInput(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleModificationSubmit()
                      }
                      disabled={isGenerating}
                    />
                    <button
                      onClick={handleModificationSubmit}
                      disabled={!modificationInput.trim() || isGenerating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isGenerating ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Updating...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4" />
                          Update
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick modification examples */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600">Quick examples:</span>
                  {[
                    "budget increased by 20%",
                    "target urban markets instead",
                    "material costs increased by 15%",
                    "focus on sustainability more",
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setModificationInput(example)}
                      disabled={isGenerating}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              disabled={isGenerating}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Close
            </button>

            {/* CSV Download Button */}
            <button
              onClick={downloadCSV}
              disabled={isGenerating || !idea}
              className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="Download business idea data as CSV"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            {/* PDF Download Button */}
            <button
              onClick={downloadPDF}
              disabled={isGenerating || !idea}
              className="px-4 py-3 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="Download business idea report as PDF with charts"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            {onClearSession && (
              <button
                onClick={onClearSession}
                disabled={isGenerating}
                className="px-4 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clear this session and start fresh"
              >
                Clear Session
              </button>
            )}
            <button
              disabled={isGenerating}
              className="flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: isGenerating ? "#9ca3af" : "#2fb86a" }}
              onMouseEnter={(e) => {
                if (!isGenerating) {
                  e.target.style.backgroundColor = "#059669";
                }
              }}
              onMouseLeave={(e) => {
                if (!isGenerating) {
                  e.target.style.backgroundColor = "#2fb86a";
                }
              }}
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
