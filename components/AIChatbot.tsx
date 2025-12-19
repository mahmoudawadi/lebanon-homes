"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";

const AIChatbot = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const translations = {
    en: {
      title: "AI Assistant",
      placeholder: "Ask about properties, prices, locations...",
      send: "Send",
      examples: "Try asking:",
      example1: "Show me apartments for rent in Beirut",
      example2: "What's the average price for a 3BR apartment?",
      example3: "Properties with sea view under $500k",
    },
    ar: {
      title: "مساعد ذكي",
      placeholder: "اسأل عن العقارات والأسعار والمواقع...",
      send: "إرسال",
      examples: "جرب أن تسأل:",
      example1: "أرني شقق للإيجار في بيروت",
      example2: "ما هو متوسط سعر شقة 3 غرف نوم؟",
      example3: "عقارات بإطلالة على البحر تحت 500 ألف",
    },
    fr: {
      title: "Assistant IA",
      placeholder: "Demandez sur les propriétés, prix, emplacements...",
      send: "Envoyer",
      examples: "Essayez de demander:",
      example1: "Montrez-moi des appartements à louer à Beyrouth",
      example2: "Quel est le prix moyen d'un appartement 3 chambres?",
      example3: "Propriétés avec vue sur mer sous 500k",
    },
  };

  const t = translations[language];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        type: "bot",
        text: language === "en" 
          ? "Hello! I'm your AI assistant. I can help you find properties, answer questions about prices, locations, and more. How can I help you today?"
          : language === "ar"
          ? "مرحباً! أنا مساعدك الذكي. يمكنني مساعدتك في العثور على العقارات والإجابة على الأسئلة حول الأسعار والمواقع والمزيد. كيف يمكنني مساعدتك اليوم؟"
          : "Bonjour! Je suis votre assistant IA. Je peux vous aider à trouver des propriétés, répondre aux questions sur les prix, les emplacements, et plus encore. Comment puis-je vous aider aujourd'hui?",
      }]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, language }),
      });

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: data.response || "I'm sorry, I couldn't process that request." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Sorry, there was an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 flex items-center gap-2"
        aria-label="Open AI Assistant"
      >
        <FiMessageCircle className="w-6 h-6" />
        <span className="hidden md:block font-semibold">AI Assistant</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <h3 className="font-semibold">{t.title}</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.type === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Examples */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">{t.examples}</p>
          <div className="space-y-1">
            <button
              onClick={() => handleExampleClick(t.example1)}
              className="text-xs text-blue-600 hover:underline block w-full text-left"
            >
              • {t.example1}
            </button>
            <button
              onClick={() => handleExampleClick(t.example2)}
              className="text-xs text-blue-600 hover:underline block w-full text-left"
            >
              • {t.example2}
            </button>
            <button
              onClick={() => handleExampleClick(t.example3)}
              className="text-xs text-blue-600 hover:underline block w-full text-left"
            >
              • {t.example3}
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={t.placeholder}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;


