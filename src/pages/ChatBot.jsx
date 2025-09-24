import React, { useState, useEffect, useRef } from "react";
import { Send, Trash2, Bot, User } from "lucide-react";
import { Header } from "@/components/layout/header";

// MessageBubble sub-component
const MessageBubble = ({ message, isUser, timestamp }) => {
  return (
    <div
      className={`flex mb-4 ${
        isUser ? "justify-end" : "justify-start"
      } animate-fadeIn`}
    >
      <div
        className={`flex max-w-xs md:max-w-md ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start`}
      >
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? "ml-2" : "mr-2"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? "bg-primary" : "bg-gray-100"
            }`}
            style={isUser ? { backgroundColor: "#2fb86a" } : {}}
          >
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-gray-600" />
            )}
          </div>
        </div>

        {/* Message Content */}
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? "text-white rounded-br-md"
              : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
          }`}
          style={isUser ? { backgroundColor: "#2fb86a" } : {}}
        >
          <p className="text-sm leading-relaxed">{message}</p>
          <p
            className={`text-xs mt-1 ${
              isUser ? "text-green-100" : "text-gray-500"
            }`}
          >
            {timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm BizPilot AI, your business assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock bot responses
  const getBotResponse = (userMessage) => {
    const responses = [
      "That's an interesting question! Let me help you with that business insight.",
      "Based on market analysis, here are some key points to consider for your business strategy.",
      "I can help you analyze that further. What specific aspect would you like to explore?",
      "Great question! For business optimization, I'd recommend focusing on these areas.",
      "Let me provide you with some AI-powered insights on that topic.",
      "That's a strategic thinking! Here's what the data suggests for your business growth.",
      "I can help you break that down into actionable business steps.",
      "Excellent point! Market trends indicate several opportunities in this area.",
    ];

    // Simple keyword-based responses
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
      return "For pricing strategies, consider value-based pricing aligned with your target market's willingness to pay. Would you like me to analyze your specific pricing model?";
    } else if (
      lowerMessage.includes("market") ||
      lowerMessage.includes("competition")
    ) {
      return "Market analysis is crucial for business success. I can help you identify market opportunities, competitor analysis, and positioning strategies. What's your target market?";
    } else if (
      lowerMessage.includes("idea") ||
      lowerMessage.includes("business")
    ) {
      return "I can help generate and validate business ideas! What industry or problem area interests you? I'll provide AI-powered insights and market validation.";
    } else if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("support")
    ) {
      return "I'm here to assist with business strategy, market analysis, idea generation, financial planning, and growth optimization. What specific area would you like to explore?";
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Simulate typing delay for bot response
  const simulateBotResponse = async (userMessage) => {
    setIsTyping(true);

    // Simulate processing time
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const botResponse = getBotResponse(userMessage);
    const newBotMessage = {
      id: Date.now() + 1,
      text: botResponse,
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newBotMessage]);
    setIsTyping(false);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    // Add user message
    const newUserMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");

    // Generate bot response
    simulateBotResponse(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearHistory = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm BizPilot AI, your business assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Header />
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Chat Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: "#2fb86a" }}
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  BizPilot AI Assistant
                </h1>
                <p className="text-sm text-gray-600">
                  Your intelligent business companion
                </p>
              </div>
            </div>

            {/* Clear History Button */}
            <button
              onClick={clearHistory}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4 animate-fadeIn">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your business..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 resize-none transition-colors"
                  style={{
                    minHeight: "48px",
                    maxHeight: "120px",
                    "--tw-ring-color": "#2fb86a",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#2fb86a";
                    e.target.style.boxShadow =
                      "0 0 0 2px rgba(47, 184, 106, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                    e.target.style.boxShadow = "none";
                  }}
                  rows="1"
                  disabled={isTyping}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === "" || isTyping}
                className="text-white p-3 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    inputMessage.trim() && !isTyping ? "#2fb86a" : "",
                  "--tw-ring-color": "#2fb86a",
                }}
                onMouseEnter={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = "#059669";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = "#2fb86a";
                  }
                }}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ChatBot;
