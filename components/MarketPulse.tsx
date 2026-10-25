"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  en: [
    { value: "500+", label: "Properties sold" },
    { value: "15+", label: "Years of experience" },
    { value: "150+", label: "New listings this month" },
    { value: "98%", label: "Client satisfaction" },
  ],
  ar: [
    { value: "+500", label: "عقار مباع" },
    { value: "+15", label: "سنة من الخبرة" },
    { value: "+150", label: "قائمة جديدة هذا الشهر" },
    { value: "98%", label: "رضا العملاء" },
  ],
  fr: [
    { value: "500+", label: "Propriétés vendues" },
    { value: "15+", label: "Années d'expérience" },
    { value: "150+", label: "Nouvelles annonces ce mois" },
    { value: "98%", label: "Clients satisfaits" },
  ],
};

const MarketPulse = () => {
  const { language } = useLanguage();
  const stats = translations[language];

  return (
    <section className="border-b border-line bg-white">
      <div className="container-x grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x rtl:md:divide-x-reverse">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-8 text-center md:py-10">
            <div className="font-serif text-3xl font-semibold text-ink md:text-4xl">{stat.value}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarketPulse;
