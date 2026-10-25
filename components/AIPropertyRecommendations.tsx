"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";
import PropertyGrid from "./PropertyGrid";
import SectionHeading from "./SectionHeading";

const translations = {
  en: { eyebrow: "Just for you", title: "AI Recommendations for You", subtitle: "Based on your preferences and browsing history" },
  ar: { eyebrow: "لك خصيصاً", title: "توصيات الذكاء الاصطناعي لك", subtitle: "بناءً على تفضيلاتك وسجل التصفح" },
  fr: { eyebrow: "Pour vous", title: "Recommandations IA pour Vous", subtitle: "Basé sur vos préférences et historique de navigation" },
};

const AIPropertyRecommendations = () => {
  const { data: session } = useSession();
  const { language } = useLanguage();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/ai/recommendations")
        .then((res) => res.json())
        .then((data) => setRecommendations(data.properties || []))
        .catch(() => setRecommendations([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  if (!session?.user || recommendations.length === 0) return null;

  const t = translations[language];

  return (
    <section className="section border-t border-line bg-ivory-50">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} lead={t.subtitle} />
        <PropertyGrid properties={recommendations} loading={loading} />
      </div>
    </section>
  );
};

export default AIPropertyRecommendations;
