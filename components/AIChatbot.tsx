"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuSparkles, LuX, LuSend, LuRotateCcw, LuBedDouble, LuMapPin, LuCircleCheck } from "react-icons/lu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { FALLBACK_IMAGE, displayPriceUSD, formatMoney, parseImages } from "@/lib/format";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  properties?: any[];
  booked?: boolean;
};

const STORAGE_KEY = "lebestate-assistant-chat";

const translations = {
  en: {
    title: "AI Assistant",
    online: "Online · replies instantly",
    placeholder: "Ask about properties, prices, viewings...",
    send: "Send",
    reset: "New chat",
    greeting:
      "Hello! I'm the LebEstate AI assistant. Tell me what you're looking for — area, budget, bedrooms — and I'll find matching homes, answer questions, or book a viewing for you.",
    examples: ["2 bedroom apartment for rent in Beirut under $1,000", "Villas with a sea view", "What's the average rent?", "Book a viewing"],
    status: {
      search_properties: "Searching listings…",
      get_property_details: "Reading the listing…",
      list_agents: "Checking our agents…",
      get_market_stats: "Crunching market data…",
      request_viewing: "Sending your request…",
      busy: "One moment, lots of visitors right now…",
    } as Record<string, string>,
    thinking: "Thinking…",
    booked: "Request sent to the team",
    error: "Sorry, there was an error. Please try again.",
  },
  ar: {
    title: "مساعد ذكي",
    online: "متصل · يرد فوراً",
    placeholder: "اسأل عن العقارات والأسعار والزيارات...",
    send: "إرسال",
    reset: "محادثة جديدة",
    greeting:
      "مرحباً! أنا المساعد الذكي في LebEstate. أخبرني بما تبحث عنه — المنطقة والميزانية وعدد الغرف — وسأجد لك العقارات المناسبة، أو أجيب عن أسئلتك، أو أحجز لك زيارة.",
    examples: ["شقة غرفتين للإيجار في بيروت", "فيلات بإطلالة على البحر", "ما هو متوسط الإيجار؟", "احجز زيارة"],
    status: {
      search_properties: "أبحث في العقارات…",
      get_property_details: "أقرأ تفاصيل العقار…",
      list_agents: "أتحقق من الوكلاء…",
      get_market_stats: "أحلل بيانات السوق…",
      request_viewing: "أرسل طلبك…",
      busy: "لحظة من فضلك، الضغط كبير الآن…",
    } as Record<string, string>,
    thinking: "أفكر…",
    booked: "تم إرسال الطلب إلى الفريق",
    error: "عذراً، حدث خطأ. حاول مرة أخرى.",
  },
  fr: {
    title: "Assistant IA",
    online: "En ligne · répond instantanément",
    placeholder: "Posez vos questions sur les biens, prix, visites...",
    send: "Envoyer",
    reset: "Nouvelle discussion",
    greeting:
      "Bonjour ! Je suis l'assistant IA de LebEstate. Dites-moi ce que vous cherchez — quartier, budget, chambres — et je trouverai des biens, répondrai à vos questions ou réserverai une visite.",
    examples: ["Appartement 2 chambres à louer à Beyrouth", "Villas avec vue mer", "Quel est le loyer moyen ?", "Réserver une visite"],
    status: {
      search_properties: "Recherche des annonces…",
      get_property_details: "Lecture de l'annonce…",
      list_agents: "Consultation des agents…",
      get_market_stats: "Analyse du marché…",
      request_viewing: "Envoi de votre demande…",
      busy: "Un instant, beaucoup de visiteurs en ce moment…",
    } as Record<string, string>,
    thinking: "Réflexion…",
    booked: "Demande envoyée à l'équipe",
    error: "Désolé, une erreur s'est produite. Réessayez.",
  },
};

// Minimal, safe markdown: **bold**, [text](/internal-link), "- " bullets, line breaks
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={key}>{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const href = link[2];
      return href.startsWith("/") ? (
        <Link key={key} href={href} className="font-semibold text-brass-600 underline underline-offset-2 hover:text-brass-700">
          {link[1]}
        </Link>
      ) : (
        <span key={key}>{link[1]}</span>
      );
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const bullet = line.match(/^\s*[-•*]\s+(.*)$/);
        if (bullet) {
          return (
            <div key={i} className="flex gap-2 ps-1">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
              <span>{renderInline(bullet[1], `l${i}`)}</span>
            </div>
          );
        }
        return line.trim() === "" ? <div key={i} className="h-2" /> : <div key={i}>{renderInline(line, `l${i}`)}</div>;
      })}
    </>
  );
}

function MiniPropertyCard({ property }: { property: any }) {
  const { currency, convertPrice } = useCurrency();
  return (
    <Link
      href={property.url || `/property/${property.slug}`}
      className="flex w-56 shrink-0 overflow-hidden rounded-xl bg-white text-start shadow-soft ring-1 ring-line transition hover:ring-brass"
    >
      <img src={property.image || parseImages(property.images)[0] || FALLBACK_IMAGE} alt="" className="h-auto w-20 shrink-0 object-cover" />
      <span className="min-w-0 p-2.5">
        <span className="block font-serif text-sm font-semibold text-ink">
          {formatMoney(convertPrice(displayPriceUSD(property)), currency)}
          {property.listingType === "rent" && <span className="font-sans text-[10px] font-normal text-muted"> /mo</span>}
        </span>
        <span className="block truncate text-xs text-ink-600">{property.title}</span>
        <span className="mt-1 flex items-center gap-2 text-[11px] text-muted">
          <span className="flex items-center gap-0.5"><LuMapPin className="h-3 w-3" />{property.city}</span>
          <span className="flex items-center gap-0.5"><LuBedDouble className="h-3 w-3" />{property.bedrooms}</span>
        </span>
      </span>
    </Link>
  );
}

const AIChatbot = () => {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  // Keep the conversation while the visitor moves between pages
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {
      // Storage can be unavailable (private mode); start fresh
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const updateLast = (update: (msg: ChatMessage) => ChatMessage) =>
    setMessages((prev) => [...prev.slice(0, -1), update(prev[prev.length - 1])]);

  // Older keyword-based assistant, used when no AI key is configured
  const sendToFallback = async (message: string) => {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, language }),
    });
    const data = await response.json();
    updateLast((m) => ({ ...m, text: data.response || t.error, properties: data.properties }));
  };

  const handleSend = async (text = input) => {
    const message = text.trim();
    if (!message || loading) return;

    const history = [...messages, { role: "user" as const, text: message }];
    setMessages([...history, { role: "assistant", text: "" }]);
    setInput("");
    setLoading(true);
    setStatus(t.thinking);

    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.filter((m) => m.text).map((m) => ({ role: m.role, content: m.text })),
          language,
          page: pathname,
        }),
      });

      if (response.status === 503) {
        await sendToFallback(message);
        return;
      }
      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({}));
        updateLast((m) => ({ ...m, text: data.error || t.error }));
        return;
      }

      // Read the server-sent events as they arrive
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        for (const raw of events) {
          if (!raw.startsWith("data: ")) continue;
          const event = JSON.parse(raw.slice(6));
          if (event.type === "text") {
            setStatus(null);
            updateLast((m) => ({ ...m, text: m.text + event.text }));
          } else if (event.type === "status") {
            setStatus(t.status[event.tool] || t.thinking);
          } else if (event.type === "properties") {
            updateLast((m) => {
              const existing = m.properties || [];
              const fresh = event.properties.filter((p: any) => !existing.some((e) => e.id === p.id));
              return { ...m, properties: [...existing, ...fresh] };
            });
          } else if (event.type === "viewing_requested") {
            updateLast((m) => ({ ...m, booked: true }));
          } else if (event.type === "error") {
            updateLast((m) => ({ ...m, text: (m.text ? m.text + "\n\n" : "") + event.message }));
          }
        }
      }
    } catch {
      updateLast((m) => ({ ...m, text: m.text || t.error }));
    } finally {
      setLoading(false);
      setStatus(null);
    }
  };

  const reset = () => {
    setMessages([]);
    setInput("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-6 start-6 z-50 flex items-center gap-2 rounded-full bg-ink py-3.5 pe-5 ps-4 text-white shadow-lift ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-ink-700"
        aria-label="Open AI Assistant"
      >
        <span className="relative">
          <LuSparkles className="h-5 w-5 text-brass-400 transition-transform group-hover:rotate-12" />
          <span className="absolute -end-1 -top-1 h-2 w-2 animate-ping rounded-full bg-emerald-400" />
          <span className="absolute -end-1 -top-1 h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="hidden text-sm font-semibold md:block">{t.title}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 start-4 z-50 flex h-[min(640px,calc(100svh-2rem))] w-[calc(100vw-2rem)] animate-fade-up flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-lift sm:bottom-6 sm:start-6 sm:w-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between bg-ink p-4 text-white">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brass-400 to-brass-600 text-white">
            <LuSparkles className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold !text-white">{t.title}</h3>
            <span className="flex items-center gap-1.5 text-xs text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {t.online}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button onClick={reset} disabled={loading} className="rounded-full p-2 transition-colors hover:bg-white/10 disabled:opacity-40" aria-label={t.reset} title={t.reset}>
              <LuRotateCcw className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => setIsOpen(false)} className="rounded-full p-2 transition-colors hover:bg-white/10" aria-label="Close">
            <LuX className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-ivory-50 p-4">
        <div className="flex justify-start">
          <div className="max-w-[88%] rounded-2xl rounded-es-md bg-white px-4 py-3 text-sm leading-relaxed text-ink shadow-soft ring-1 ring-line">
            {t.greeting}
          </div>
        </div>

        {messages.map((msg, idx) => {
          const isLast = idx === messages.length - 1;
          if (msg.role === "assistant" && !msg.text && !msg.properties?.length && isLast && loading) return null;
          return (
            <div key={idx} className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
              {msg.text && (
                <div
                  className={`max-w-[88%] space-y-0.5 rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-ee-md bg-ink text-white"
                      : "rounded-es-md bg-white text-ink shadow-soft ring-1 ring-line"
                  }`}
                >
                  {msg.role === "assistant" ? <Markdown text={msg.text} /> : msg.text}
                </div>
              )}
              {msg.properties && msg.properties.length > 0 && (
                <div className="-mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 pb-1">
                  {msg.properties.map((p) => (
                    <MiniPropertyCard key={p.id} property={p} />
                  ))}
                </div>
              )}
              {msg.booked && (
                <span className="chip bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                  <LuCircleCheck className="h-3.5 w-3.5" /> {t.booked}
                </span>
              )}
            </div>
          );
        })}

        {loading && status && (
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brass" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brass [animation-delay:0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brass [animation-delay:0.3s]" />
            </span>
            {status}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-line bg-ivory-50 px-4 py-3">
          {t.examples.map((example) => (
            <button
              key={example}
              onClick={() => handleSend(example)}
              className="rounded-full bg-white px-3 py-1.5 text-start text-xs text-ink-600 ring-1 ring-line transition hover:text-ink hover:ring-brass"
            >
              {example}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="border-t border-line p-3"
      >
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            maxLength={2000}
            className="input !rounded-full !py-2.5"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brass text-white transition hover:bg-brass-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t.send}
          >
            <LuSend className="h-4 w-4 rtl:-scale-x-100" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChatbot;
