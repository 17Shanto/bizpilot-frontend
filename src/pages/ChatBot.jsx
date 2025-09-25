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
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // API call to get bot response
  const getBotResponse = async (userMessage) => {
    try {
      setError("");
      const response = await fetch(
        "https://bizpilot-backend.vercel.app/bizpilot-api/idea/chatbot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            // You can add additional parameters if your API requires them
            // timestamp: new Date().toISOString(),
            // sessionId: "current-session-id" // if you want to maintain session
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Adjust this based on your API response structure
      // Common response structures might be:
      // { response: "message" } or { answer: "message" } or { data: "message" }
      if (data.response) {
        return data.response;
      } else if (data.answer) {
        return data.answer;
      } else if (data.data) {
        return data.data;
      } else if (data.message) {
        return data.message;
      } else {
        // If the structure is different, return the entire response as string
        return JSON.stringify(data);
      }
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      setError(
        "Sorry, I'm having trouble connecting right now. Please try again."
      );

      // Fallback responses when API is unavailable
      const fallbackResponses = [
        "I'm currently experiencing technical difficulties. Please try again in a moment.",
        "It seems I'm having connection issues. Let's try that again?",
        "I apologize for the interruption. Could you please repeat your question?",
      ];

      return fallbackResponses[
        Math.floor(Math.random() * fallbackResponses.length)
      ];
    }
  };

  // Simulate typing delay and get bot response from API
  const simulateBotResponse = async (userMessage) => {
    setIsTyping(true);

    try {
      // Get response from API
      const botResponse = await getBotResponse(userMessage);

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
    } catch (error) {
      console.error("Error in bot response:", error);

      // Error message already handled in getBotResponse
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble processing your request. Please try again.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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

    // Generate bot response via API
    simulateBotResponse(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

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
