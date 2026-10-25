"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PropertyGrid from "@/components/PropertyGrid";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizedField } from "@/lib/format";
import { LuPhone, LuMail, LuChevronLeft } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";

const translations = {
  en: { back: "All agents", sold: "Properties sold", years: "Years experience", listings: "Active listings", languages: "Languages", properties: "Listings by", notFound: "Agent Not Found", defaultBio: "Experienced real estate professional", call: "Call", email: "Email" },
  ar: { back: "كل الوكلاء", sold: "عقارات مباعة", years: "سنوات الخبرة", listings: "عقارات نشطة", languages: "اللغات", properties: "عقارات", notFound: "الوكيل غير موجود", defaultBio: "خبير عقاري متمرس", call: "اتصال", email: "بريد" },
  fr: { back: "Tous les agents", sold: "Biens vendus", years: "Années d'expérience", listings: "Annonces actives", languages: "Langues", properties: "Annonces de", notFound: "Agent Introuvable", defaultBio: "Professionnel de l'immobilier expérimenté", call: "Appeler", email: "Email" },
};

const AgentProfilePage = () => {
  const params = useParams();
  const { language } = useLanguage();
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetch(`/api/agents/${params.slug}`)
        .then((res) => res.json())
        .then((data) => setAgent(data.agent || null))
        .catch(() => setAgent(null))
        .finally(() => setLoading(false));
    }
  }, [params.slug]);

  const t = translations[language];

  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />

      {loading ? (
        <div className="container-x py-12"><div className="skeleton h-80" /></div>
      ) : !agent ? (
        <div className="container-x py-28 text-center">
          <h1 className="font-serif text-4xl font-semibold">{t.notFound}</h1>
          <Link href="/agents" className="btn-primary mt-8">{t.back}</Link>
        </div>
      ) : (
        <>
          <section className="bg-ink text-white">
            <div className="container-x py-12 md:py-16">
              <Link href="/agents" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
                <LuChevronLeft className="h-4 w-4 rtl:rotate-180" /> {t.back}
              </Link>
              <div className="mt-8 grid items-center gap-10 md:grid-cols-[auto_1fr]">
                {agent.photo ? (
                  <img src={agent.photo} alt={agent.name} className="h-40 w-40 rounded-full object-cover ring-4 ring-brass/40 md:h-48 md:w-48" />
                ) : (
                  <span className="grid h-40 w-40 place-items-center rounded-full bg-white/10 font-serif text-6xl">{agent.name[0]}</span>
                )}
                <div>
                  <h1 className="font-serif text-4xl font-semibold !text-white md:text-5xl">{localizedField(agent, "name", language)}</h1>
                  {agent.specialties?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {agent.specialties.map((s: string) => (
                        <span key={s} className="chip bg-white/10 text-white/85 ring-1 ring-white/15">{s}</span>
                      ))}
                    </div>
                  )}
                  <p className="mt-5 max-w-2xl leading-relaxed text-white/70">
                    {localizedField(agent, "bio", language) || t.defaultBio}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {agent.whatsapp && (
                      <a href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] text-white hover:bg-[#1fb658]">
                        <FaWhatsapp className="h-5 w-5" /> WhatsApp
                      </a>
                    )}
                    <a href={`tel:${agent.phone}`} className="btn-ghost-light"><LuPhone className="h-4 w-4" /> {t.call}</a>
                    <a href={`mailto:${agent.email}`} className="btn-ghost-light"><LuMail className="h-4 w-4" /> {t.email}</a>
                  </div>
                </div>
              </div>
              <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-4">
                {[
                  { label: t.sold, value: agent.propertiesSold },
                  { label: t.years, value: agent.yearsExperience },
                  { label: t.listings, value: agent._count?.properties ?? agent.properties?.length ?? 0 },
                  { label: t.languages, value: (agent.languages || []).map((l: string) => l.toUpperCase()).join(" · ") || "—" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-ink p-6">
                    <dt className="text-xs uppercase tracking-wider text-white/50">{stat.label}</dt>
                    <dd className="mt-1 font-serif text-2xl font-semibold text-brass-400">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="container-x py-16">
            <h2 className="section-title !text-3xl">
              {t.properties} {agent.name.split(" ")[0]}
            </h2>
            <div className="mt-8">
              <PropertyGrid properties={agent.properties || []} loading={false} />
            </div>
          </section>
        </>
      )}
      <Footer />
    </div>
  );
};

export default AgentProfilePage;
