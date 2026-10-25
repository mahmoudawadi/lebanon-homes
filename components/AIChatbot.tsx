"use client";

import React, { useState, useRef, useEffect } from "react";
import { LuSparkles, LuX, LuSend } from "react-icons/lu";
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

    const message = input;
    const userMessage = { type: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, language }),
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
        className="fixed bottom-6 start-6 z-50 flex items-center gap-2 rounded-full bg-ink py-3.5 pe-5 ps-4 text-white shadow-lift ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-ink-700"
        aria-label="Open AI Assistant"
      >
        <LuSparkles className="h-5 w-5 text-brass-400" />
        <span className="hidden text-sm font-semibold md:block">{t.title}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 start-4 z-50 flex h-[min(600px,calc(100svh-2rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-lift sm:bottom-6 sm:start-6 sm:w-96">
      {/* Header */}
      <div className="flex items-center justify-between bg-ink p-4 text-white">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brass/20 text-brass-400">
            <LuSparkles className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold !text-white">{t.title}</h3>
            <span className="flex items-center gap-1.5 text-xs text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full p-1.5 transition-colors hover:bg-white/10"
          aria-label="Close"
        >
          <LuX className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto bg-ivory-50 p-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.type === "user"
                  ? "rounded-ee-md bg-ink text-white"
                  : "rounded-es-md bg-white text-ink shadow-soft ring-1 ring-line"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white px-4 py-3 shadow-soft ring-1 ring-line">
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
        <div className="border-t border-line bg-ivory-50 px-4 py-3">
          <p className="mb-2 text-xs text-muted">{t.examples}</p>
          <div className="flex flex-col items-start gap-1.5">
            <button
              onClick={() => handleExampleClick(t.example1)}
              className="rounded-full bg-white px-3 py-1 text-start text-xs text-ink-600 ring-1 ring-line transition hover:ring-brass"
            >
              {t.example1}
            </button>
            <button
              onClick={() => handleExampleClick(t.example2)}
              className="rounded-full bg-white px-3 py-1 text-start text-xs text-ink-600 ring-1 ring-line transition hover:ring-brass"
            >
              {t.example2}
            </button>
            <button
              onClick={() => handleExampleClick(t.example3)}
              className="rounded-full bg-white px-3 py-1 text-start text-xs text-ink-600 ring-1 ring-line transition hover:ring-brass"
            >
              {t.example3}
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-line p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t.placeholder}
            className="input !rounded-full !py-2.5"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brass text-white transition hover:bg-brass-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t.send}
          >
            <LuSend className="h-4 w-4 rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;


