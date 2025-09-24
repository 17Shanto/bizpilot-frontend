import React from "react";
import { Header } from "@/components/layout/header";
import { AnimatedButton } from "@/components/ui/animated-button";
import { IdeaCard } from "@/components/ui/idea-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Lightbulb,
  Clock,
  Star,
  MessageCircle,
} from "lucide-react";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const mockIdeas = [
    {
      id: 1,
      title: "Eco-Friendly Food Delivery",
      description:
        "Sustainable food delivery service using electric bikes and biodegradable packaging in Dhaka metropolitan area.",
      status: "completed",
      lastUpdated: "2 hours ago",
      modelsCount: 3,
      estimatedRevenue: "৳45,000/month",
      riskLevel: "Medium",
    },
    {
      id: 2,
      title: "Digital Learning Platform",
      description:
        "Online skill development platform for Bangladesh youth focusing on technology and entrepreneurship.",
      status: "generating",
      lastUpdated: "30 minutes ago",
      modelsCount: 1,
      estimatedRevenue: "৳25,000/month",
      riskLevel: "Low",
    },
    {
      id: 3,
      title: "Smart Agriculture System",
      description:
        "IoT-based crop monitoring and automated irrigation system for small-scale farmers in rural Bangladesh.",
      status: "draft",
      lastUpdated: "1 day ago",
      modelsCount: 0,
      estimatedRevenue: "৳80,000/month",
      riskLevel: "High",
    },
    {
      id: 4,
      title: "Local Handicraft Marketplace",
      description:
        "E-commerce platform connecting artisans across Bangladesh with global customers, focusing on traditional crafts.",
      status: "completed",
      lastUpdated: "3 days ago",
      modelsCount: 2,
      estimatedRevenue: "৳35,000/month",
      riskLevel: "Medium",
    },
  ];

  const stats = [
    {
      title: "Total Ideas",
      value: "12",
      change: "+3 this month",
      icon: Lightbulb,
      color: "text-bp-green-600",
    },
    {
      title: "Completed Models",
      value: "8",
      change: "+2 this week",
      icon: BarChart3,
      color: "text-primary",
    },
    {
      title: "Avg. Revenue Projection",
      value: "৳42,500",
      change: "+15% from last analysis",
      icon: TrendingUp,
      color: "text-bp-green-700",
    },
    {
      title: "Success Score",
      value: "78%",
      change: "Based on market analysis",
      icon: Star,
      color: "text-accent",
    },
  ];

  const getRiskBadgeColor = (risk) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-bp-green-100 text-bp-green-700 border-bp-green-200";
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "high":
        return "bg-bp-red-50 text-bp-red border-bp-red/20";
      default:
        return "bg-bp-gray-100 text-bp-gray-700 border-bp-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-screen-2xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-balance">
                Welcome back, Entrepreneur!
              </h1>
              <p className="text-muted-foreground mt-1">
                Ready to turn your next idea into a successful business?
              </p>
            </div>
            <div className="flex gap-3">
              <AnimatedButton variant="outline" size="lg">
                <MessageCircle className="mr-2 h-4 w-4" />
                AI Assistant
              </AnimatedButton>
              <AnimatedButton variant="hero" size="lg">
                <Plus className="mr-2 h-4 w-4" />
                New Idea
              </AnimatedButton>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="card-shadow hover:card-shadow-hover transition-smooth"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 card-shadow">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-xl">Your Business Ideas</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search ideas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <AnimatedButton variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </AnimatedButton>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockIdeas
            .filter(
              (idea) =>
                idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                idea.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
            )
            .map((idea) => (
              <IdeaCard
                key={idea.id}
                title={idea.title}
                description={idea.description}
                status={idea.status}
                lastUpdated={idea.lastUpdated}
                modelsCount={idea.modelsCount}
                className="cursor-pointer"
              >
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Est. Revenue:</span>
                    <span className="font-semibold text-primary">
                      {idea.estimatedRevenue}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Risk Level:
                    </span>
                    <Badge
                      className={getRiskBadgeColor(idea.riskLevel)}
                      variant="outline"
                    >
                      {idea.riskLevel}
                    </Badge>
                  </div>
                </div>
              </IdeaCard>
            ))}
        </div>

        {/* Quick Actions */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatedButton variant="outline" className="h-20 flex-col gap-2">
                <Plus className="h-5 w-5" />
                <span className="text-sm">Create New Idea</span>
              </AnimatedButton>
              <AnimatedButton variant="outline" className="h-20 flex-col gap-2">
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm">View Analytics</span>
              </AnimatedButton>
              <AnimatedButton variant="outline" className="h-20 flex-col gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">Market Trends</span>
              </AnimatedButton>
              <AnimatedButton variant="outline" className="h-20 flex-col gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Recent Activity</span>
              </AnimatedButton>
            </div>
          </CardContent>
        </Card>

        {/* AI Chat Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatedButton
            variant="hero"
            size="lg"
            className="rounded-full shadow-lg"
            aria-label="Open AI Chat"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            AI Helper
            <Badge className="ml-2 bg-accent text-accent-foreground text-xs">
              2
            </Badge>
          </AnimatedButton>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
