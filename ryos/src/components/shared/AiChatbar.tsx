import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Minimize2, Maximize2, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "ai/react";
import { toast } from "sonner";

interface AiChatbarProps {
  className?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AiChatbar({ className = "" }: AiChatbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [],
    onResponse: (response) => {
      if (!response.ok) {
        toast.error("AI Error", {
          description: "Failed to get AI response. Please try again.",
        });
      }
    },
    onError: (error) => {
      toast.error("AI Error", {
        description: error.message || "Something went wrong with the AI.",
      });
    },
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsMinimized(false);
      // Focus input when expanding
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsExpanded(false);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setIsMinimized(false);
  };

  const quickPrompts = [
    "What can you help me with?",
    "Launch Calculator app",
    "Open Terminal",
    "Show me available apps",
    "What's the weather like?",
    "Help me with coding",
  ];

  const handleQuickPrompt = (prompt: string) => {
    if (inputRef.current) {
      inputRef.current.value = prompt;
      handleInputChange({
        target: { value: prompt },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <AnimatePresence mode="wait">
        {isMinimized ? (
          // Minimized state - just a small dot
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleToggleExpand}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : isExpanded ? (
          // Expanded chat interface
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="w-80 h-96 flex flex-col bg-white/95 backdrop-blur-sm border-2 border-blue-200 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">AI Assistant</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-blue-100"
                    onClick={handleMinimize}
                  >
                    <Minimize2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-blue-100"
                    onClick={handleClose}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-3" ref={chatRef}>
                <div className="space-y-2">
                  {messages.length === 0 ? (
                    <div className="text-center py-4">
                      <Sparkles className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">
                        Hi! I'm your AI assistant. How can I help you today?
                      </p>
                      <div className="space-y-1">
                        {quickPrompts.slice(0, 3).map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickPrompt(prompt)}
                            className="block w-full text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                            message.role === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Thinking...
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-3 border-t bg-gray-50">
                <form onSubmit={handleQuickSubmit} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask me anything..."
                    className="flex-1 h-8 text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600"
                    disabled={isLoading || !input.trim()}
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        ) : (
          // Collapsed state - floating button
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Button
              onClick={handleToggleExpand}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Sparkles className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}