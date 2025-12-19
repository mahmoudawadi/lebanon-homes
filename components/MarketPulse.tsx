"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const MarketPulse = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Market Pulse",
      priceUp: "Prices up 18%",
      demandUp: "Demand increased 25%",
      newListings: "150+ new listings this month",
    },
    ar: {
      title: "نبض السوق",
      priceUp: "ارتفعت الأسعار 18%",
      demandUp: "زاد الطلب 25%",
      newListings: "أكثر من 150 قائمة جديدة هذا الشهر",
    },
    fr: {
      title: "Pouls du Marché",
      priceUp: "Prix en hausse de 18%",
      demandUp: "Demande augmentée de 25%",
      newListings: "Plus de 150 nouvelles listes ce mois-ci",
    },
  };

  const t = translations[language];

  return (
    <section className="py-12 bg-gradient-to-r from-estate-primary to-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-3">
            <FiTrendingUp className="w-8 h-8" />
            <div>
              <div className="text-sm opacity-90">{t.title}</div>
              <div className="text-2xl font-bold">{t.priceUp}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiTrendingUp className="w-8 h-8" />
            <div>
              <div className="text-sm opacity-90">Demand</div>
              <div className="text-2xl font-bold">{t.demandUp}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiTrendingUp className="w-8 h-8" />
            <div>
              <div className="text-sm opacity-90">New Listings</div>
              <div className="text-2xl font-bold">{t.newListings}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketPulse;

