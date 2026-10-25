"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { LuTrendingUp, LuTrendingDown, LuMapPin, LuLayers, LuBadgeCheck, LuDollarSign } from "react-icons/lu";
import { formatMoney } from "@/lib/format";
import SectionHeading from "./SectionHeading";

const translations = {
  en: {
    eyebrow: "Market intelligence",
    title: "AI Market Insights",
    subtitle: "Real-time market analysis powered by AI",
    avgPrice: "Average Sale Price",
    hotAreas: "Hot Areas",
    activeListings: "Active Listings",
    newThisMonth: "new this month",
    bestDeals: "Best Deals",
    belowMarket: "properties below market value",
    up: "up",
    down: "down",
  },
  ar: {
    eyebrow: "ذكاء السوق",
    title: "رؤى السوق بالذكاء الاصطناعي",
    subtitle: "تحليل السوق في الوقت الفعلي مدعوم بالذكاء الاصطناعي",
    avgPrice: "متوسط سعر البيع",
    hotAreas: "المناطق الساخنة",
    activeListings: "القوائم النشطة",
    newThisMonth: "جديدة هذا الشهر",
    bestDeals: "أفضل الصفقات",
    belowMarket: "عقارات بأقل من سعر السوق",
    up: "صاعد",
    down: "هابط",
  },
  fr: {
    eyebrow: "Intelligence du marché",
    title: "Aperçus du Marché IA",
    subtitle: "Analyse de marché en temps réel alimentée par l'IA",
    avgPrice: "Prix de Vente Moyen",
    hotAreas: "Zones Chaudes",
    activeListings: "Annonces Actives",
    newThisMonth: "nouvelles ce mois",
    bestDeals: "Meilleures Offres",
    belowMarket: "propriétés sous la valeur du marché",
    up: "hausse",
    down: "baisse",
  },
};

const AIMarketInsights = () => {
  const { language } = useLanguage();
  const { currency, convertPrice } = useCurrency();
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai/market-insights")
      .then((res) => res.json())
      .then((data) => setInsights(data.error ? null : data))
      .catch(() => setInsights(null))
      .finally(() => setLoading(false));
  }, []);

  const t = translations[language];

  if (!loading && !insights) return null;

  const cardClass = "rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:border-brass/40 hover:bg-white/[0.07]";
  const iconClass = "grid h-10 w-10 place-items-center rounded-full bg-brass/15 text-brass-400";

  return (
    <section className="section relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute -end-40 -top-40 h-96 w-96 rounded-full bg-brass/20 blur-3xl" />
      <div className="container-x relative">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} lead={t.subtitle} light />

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className={cardClass}>
              <span className={iconClass}><LuDollarSign className="h-5 w-5" /></span>
              <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-white/50">{t.avgPrice}</div>
              <div className="mt-1 font-serif text-3xl font-semibold">
                {formatMoney(convertPrice(insights.avgPrice || 0), currency)}
              </div>
              {/* Only show a trend once there is listing history to compare against */}
              {insights.priceChange !== 0 && (
                <div className={`mt-2 flex items-center gap-1.5 text-sm ${insights.priceChange > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {insights.priceChange > 0 ? <LuTrendingUp className="h-4 w-4" /> : <LuTrendingDown className="h-4 w-4" />}
                  {Math.abs(insights.priceChange)}% {insights.priceChange > 0 ? t.up : t.down}
                </div>
              )}
            </div>

            <div className={cardClass}>
              <span className={iconClass}><LuMapPin className="h-5 w-5" /></span>
              <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-white/50">{t.hotAreas}</div>
              <ol className="mt-2 space-y-1.5">
                {insights.hotAreas?.slice(0, 3).map((area: string, i: number) => (
                  <li key={area} className="flex items-center gap-3 text-base font-medium">
                    <span className="font-serif text-sm text-brass-400">0{i + 1}</span>
                    {area}
                  </li>
                ))}
              </ol>
            </div>

            <div className={cardClass}>
              <span className={iconClass}><LuLayers className="h-5 w-5" /></span>
              <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-white/50">{t.activeListings}</div>
              <div className="mt-1 font-serif text-3xl font-semibold">{insights.totalListings}</div>
              <div className="mt-2 text-sm text-white/60">
                {insights.newThisMonth} {t.newThisMonth}
              </div>
            </div>

            <div className={cardClass}>
              <span className={iconClass}><LuBadgeCheck className="h-5 w-5" /></span>
              <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-white/50">{t.bestDeals}</div>
              <div className="mt-1 font-serif text-3xl font-semibold">{insights.bestDealsCount}</div>
              <div className="mt-2 text-sm text-white/60">{t.belowMarket}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AIMarketInsights;
