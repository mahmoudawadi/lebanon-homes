"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuShieldCheck, LuScale, LuGlobe, LuArrowRight } from "react-icons/lu";

const translations = {
  en: {
    eyebrow: "Why LebEstate",
    title: "Why Choose Us",
    subtitle: "Your trusted partner in real estate — local insight, international standards.",
    cta: "Meet our agents",
    years: "Years guiding clients across Lebanon",
    exclusive: { title: "Exclusive Access", desc: "Access to off-market properties and exclusive listings not available elsewhere." },
    legal: { title: "Legal Expertise", desc: "Full legal support and documentation assistance throughout your transaction." },
    global: { title: "Global Reach", desc: "International network connecting you with buyers and sellers worldwide." },
  },
  ar: {
    eyebrow: "لماذا LebEstate",
    title: "لماذا تختارنا",
    subtitle: "شريكك الموثوق في العقارات — خبرة محلية بمعايير دولية.",
    cta: "تعرّف على وكلائنا",
    years: "سنوات في خدمة العملاء في لبنان",
    exclusive: { title: "وصول حصري", desc: "الوصول إلى العقارات غير المتاحة في السوق والقوائم الحصرية غير المتوفرة في مكان آخر." },
    legal: { title: "الخبرة القانونية", desc: "دعم قانوني كامل ومساعدة في الوثائق طوال عملية المعاملة." },
    global: { title: "الوصول العالمي", desc: "شبكة دولية تربطك بالمشترين والبائعين في جميع أنحاء العالم." },
  },
  fr: {
    eyebrow: "Pourquoi LebEstate",
    title: "Pourquoi Nous Choisir",
    subtitle: "Votre partenaire de confiance en immobilier — expertise locale, standards internationaux.",
    cta: "Rencontrer nos agents",
    years: "Années au service de nos clients au Liban",
    exclusive: { title: "Accès Exclusif", desc: "Accès à des propriétés hors marché et des listes exclusives non disponibles ailleurs." },
    legal: { title: "Expertise Juridique", desc: "Support juridique complet et assistance documentaire tout au long de votre transaction." },
    global: { title: "Portée Mondiale", desc: "Réseau international vous connectant avec des acheteurs et vendeurs du monde entier." },
  },
};

const WhyChooseUs = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const features = [
    { icon: LuShieldCheck, ...t.exclusive },
    { icon: LuScale, ...t.legal },
    { icon: LuGlobe, ...t.global },
  ];

  return (
    <section className="section bg-white">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 end-6 max-w-[220px] rounded-2xl bg-ink p-6 text-white shadow-lift md:-end-6">
            <div className="font-serif text-5xl font-semibold text-brass-400">15+</div>
            <div className="mt-2 text-sm text-white/70">{t.years}</div>
          </div>
        </div>

        <div>
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 className="section-title mt-4">{t.title}</h2>
          <p className="section-lead">{t.subtitle}</p>

          <div className="mt-10 space-y-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brass-50 text-brass-600 ring-1 ring-brass-100">
                  <feature.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-muted">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/agents" className="btn-primary group mt-10">
            {t.cta}
            <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
