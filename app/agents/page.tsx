"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizedField } from "@/lib/format";
import { LuArrowUpRight } from "react-icons/lu";

const translations = {
  en: { eyebrow: "Our team", title: "Our Agents", subtitle: "Experienced advisors who know every street, building and price point across Lebanon.", sold: "Sold", years: "Years", listings: "Listings", crumb: "Agents" },
  ar: { eyebrow: "فريقنا", title: "وكلاؤنا", subtitle: "مستشارون ذوو خبرة يعرفون كل شارع ومبنى وسعر في لبنان.", sold: "مباع", years: "سنوات", listings: "عقارات", crumb: "الوكلاء" },
  fr: { eyebrow: "Notre équipe", title: "Nos Agents", subtitle: "Des conseillers expérimentés qui connaissent chaque rue, immeuble et prix au Liban.", sold: "Vendus", years: "Années", listings: "Annonces", crumb: "Agents" },
};

const AgentsPage = () => {
  const { language } = useLanguage();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => setAgents(data.agents || []))
      .catch(() => setAgents([]))
      .finally(() => setLoading(false));
  }, []);

  const t = translations[language];

  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />
      <PageHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} crumb={t.crumb} />

      <div className="container-x py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [1, 2, 3].map((i) => <div key={i} className="skeleton h-[460px]" />)
            : agents.map((agent) => {
                const name = localizedField(agent, "name", language);
                return (
                  <Link
                    key={agent.id}
                    href={`/agent/${agent.slug}`}
                    className="group overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-ivory-200">
                      {agent.photo ? (
                        <img src={agent.photo} alt={name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <span className="grid h-full place-items-center font-serif text-6xl text-ink/30">{name[0]}</span>
                      )}
                      <span className="absolute end-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-ink opacity-0 shadow-soft transition group-hover:opacity-100">
                        <LuArrowUpRight className="h-5 w-5 rtl:-scale-x-100" />
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-2xl font-semibold">{name}</h3>
                      {agent.specialties?.length > 0 && (
                        <p className="mt-1 line-clamp-1 text-sm text-brass-600">{agent.specialties.slice(0, 2).join(" · ")}</p>
                      )}
                      <div className="mt-5 grid grid-cols-3 divide-x divide-line border-t border-line pt-4 text-center rtl:divide-x-reverse">
                        <div>
                          <div className="font-serif text-xl font-semibold">{agent.propertiesSold}</div>
                          <div className="text-xs text-muted">{t.sold}</div>
                        </div>
                        <div>
                          <div className="font-serif text-xl font-semibold">{agent.yearsExperience}</div>
                          <div className="text-xs text-muted">{t.years}</div>
                        </div>
                        <div>
                          <div className="font-serif text-xl font-semibold">{agent._count?.properties ?? 0}</div>
                          <div className="text-xs text-muted">{t.listings}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AgentsPage;
