"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";
import PropertyGrid from "./PropertyGrid";
import { FiStar } from "react-icons/fi";

const AIPropertyRecommendations = () => {
  const { data: session } = useSession();
  const { language } = useLanguage();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/ai/recommendations")
        .then((res) => res.json())
        .then((data) => {
          setRecommendations(data.properties || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  if (!session?.user || recommendations.length === 0) return null;

  const translations = {
    en: {
      title: "AI Recommendations for You",
      subtitle: "Based on your preferences and browsing history",
    },
    ar: {
      title: "توصيات الذكاء الاصطناعي لك",
      subtitle: "بناءً على تفضيلاتك وسجل التصفح",
    },
    fr: {
      title: "Recommandations IA pour Vous",
      subtitle: "Basé sur vos préférences et historique de navigation",
    },
  };

  const t = translations[language];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <FiStar className="w-8 h-8 text-purple-600" />
            <h2 className="text-4xl font-serif font-bold text-luxury-dark">
              {t.title}
            </h2>
          </div>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        <PropertyGrid properties={recommendations} loading={loading} />
      </div>
    </section>
  );
};

export default AIPropertyRecommendations;

