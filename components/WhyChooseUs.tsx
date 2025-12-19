"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiShield, FiGlobe, FiAward } from "react-icons/fi";

const WhyChooseUs = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Why Choose Us",
      subtitle: "Your trusted partner in real estate",
      exclusive: {
        title: "Exclusive Access",
        desc: "Access to off-market properties and exclusive listings not available elsewhere.",
      },
      legal: {
        title: "Legal Expertise",
        desc: "Full legal support and documentation assistance throughout your transaction.",
      },
      global: {
        title: "Global Reach",
        desc: "International network connecting you with buyers and sellers worldwide.",
      },
    },
    ar: {
      title: "لماذا تختارنا",
      subtitle: "شريكك الموثوق في العقارات الفاخرة",
      exclusive: {
        title: "وصول حصري",
        desc: "الوصول إلى العقارات غير المتاحة في السوق والقوائم الحصرية غير المتوفرة في مكان آخر.",
      },
      legal: {
        title: "الخبرة القانونية",
        desc: "دعم قانوني كامل ومساعدة في الوثائق طوال عملية المعاملة.",
      },
      global: {
        title: "الوصول العالمي",
        desc: "شبكة دولية تربطك بالمشترين والبائعين في جميع أنحاء العالم.",
      },
    },
    fr: {
      title: "Pourquoi Nous Choisir",
      subtitle: "Votre partenaire de confiance en immobilier de luxe",
      exclusive: {
        title: "Accès Exclusif",
        desc: "Accès à des propriétés hors marché et des listes exclusives non disponibles ailleurs.",
      },
      legal: {
        title: "Expertise Juridique",
        desc: "Support juridique complet et assistance documentaire tout au long de votre transaction.",
      },
      global: {
        title: "Portée Mondiale",
        desc: "Réseau international vous connectant avec des acheteurs et vendeurs du monde entier.",
      },
    },
  };

  const t = translations[language];

  const features = [
    {
      icon: FiShield,
      title: t.exclusive.title,
      description: t.exclusive.desc,
    },
    {
      icon: FiAward,
      title: t.legal.title,
      description: t.legal.desc,
    },
    {
      icon: FiGlobe,
      title: t.global.title,
      description: t.global.desc,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-estate-dark mb-4">
            {t.title}
          </h2>
          <p className="text-gray-600 text-lg">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-xl bg-white hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-estate-primary/10 rounded-full mb-6">
                <feature.icon className="w-8 h-8 text-estate-primary" />
              </div>
              <h3 className="text-xl font-semibold text-estate-dark mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

