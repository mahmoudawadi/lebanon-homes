"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiTrendingUp, FiTrendingDown, FiBarChart2 } from "react-icons/fi";

const AIMarketInsights = () => {
  const { language } = useLanguage();
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai/market-insights")
      .then((res) => res.json())
      .then((data) => {
        setInsights(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const translations = {
    en: {
      title: "AI Market Insights",
      subtitle: "Real-time market analysis powered by AI",
      avgPrice: "Average Price",
      priceTrend: "Price Trend",
      hotAreas: "Hot Areas",
      bestDeals: "Best Deals",
      up: "Up",
      down: "Down",
    },
    ar: {
      title: "رؤى السوق بالذكاء الاصطناعي",
      subtitle: "تحليل السوق في الوقت الفعلي مدعوم بالذكاء الاصطناعي",
      avgPrice: "متوسط السعر",
      priceTrend: "اتجاه السعر",
      hotAreas: "المناطق الساخنة",
      bestDeals: "أفضل الصفقات",
      up: "صاعد",
      down: "هابط",
    },
    fr: {
      title: "Aperçus du Marché IA",
      subtitle: "Analyse de marché en temps réel alimentée par l'IA",
      avgPrice: "Prix Moyen",
      priceTrend: "Tendance des Prix",
      hotAreas: "Zones Chaudes",
      bestDeals: "Meilleures Offres",
      up: "Hausse",
      down: "Baisse",
    },
  };

  const t = translations[language];

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (!insights) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <FiBarChart2 className="w-8 h-8 text-indigo-600" />
            <h2 className="text-4xl font-serif font-bold text-luxury-dark">
              {t.title}
            </h2>
          </div>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-gray-600 mb-2">{t.avgPrice}</div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              ${insights.avgPrice?.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm">
              {insights.priceChange > 0 ? (
                <>
                  <FiTrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">{insights.priceChange}% {t.up}</span>
                </>
              ) : (
                <>
                  <FiTrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-red-500">{Math.abs(insights.priceChange)}% {t.down}</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-gray-600 mb-2">{t.hotAreas}</div>
            <div className="space-y-2">
              {insights.hotAreas?.slice(0, 3).map((area: string, i: number) => (
                <div key={i} className="text-lg font-semibold text-indigo-600">
                  {i + 1}. {area}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-gray-600 mb-2">Active Listings</div>
            <div className="text-3xl font-bold text-indigo-600">
              {insights.totalListings}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {insights.newThisMonth} new this month
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-gray-600 mb-2">{t.bestDeals}</div>
            <div className="text-lg font-semibold text-indigo-600">
              {insights.bestDealsCount} properties
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Below market value
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIMarketInsights;


