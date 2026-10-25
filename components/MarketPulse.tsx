"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CountUp } from "./Motion";

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

const places = ["Beirut", "Achrafieh", "Jounieh", "Byblos", "Batroun", "Dbayeh", "Broummana", "Metn", "Faqra", "Saida"];

const MarketPulse = () => {
  const { language } = useLanguage();
  const stats = translations[language];

  return (
    <section className="border-b border-line bg-white">
      <div className="container-x grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x rtl:md:divide-x-reverse">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-8 text-center md:py-10">
            <CountUp value={stat.value} className="block font-serif text-3xl font-semibold text-ink md:text-4xl" />
            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Endless ribbon of locations */}
      <div className="relative overflow-hidden border-t border-line bg-ink py-4" aria-hidden dir="ltr">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {[...places, ...places].map((place, i) => (
            <span key={i} className="flex items-center gap-10 font-serif text-lg italic text-white/80">
              {place}
              <span className="h-1.5 w-1.5 rounded-full bg-brass" />
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
      </div>
    </section>
  );
};

export default MarketPulse;
