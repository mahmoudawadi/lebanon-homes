"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuPhone, LuMail, LuArrowRight } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import { localizedField } from "@/lib/format";

const translations = {
  en: { listedBy: "Listed by", sold: "properties sold", years: "yrs experience", whatsapp: "Chat on WhatsApp", profile: "View profile", hello: "Hello, I'm interested in" },
  ar: { listedBy: "معروض من قبل", sold: "عقار مباع", years: "سنوات خبرة", whatsapp: "تواصل عبر واتساب", profile: "عرض الملف", hello: "مرحباً، أنا مهتم بـ" },
  fr: { listedBy: "Proposé par", sold: "biens vendus", years: "ans d'expérience", whatsapp: "Discuter sur WhatsApp", profile: "Voir le profil", hello: "Bonjour, je suis intéressé par" },
};

const AgentCard = ({ agent, propertyTitle }: { agent: any; propertyTitle?: string }) => {
  const { language } = useLanguage();
  if (!agent) return null;

  const t = translations[language];
  const name = localizedField(agent, "name", language);
  const whatsappText = propertyTitle ? `?text=${encodeURIComponent(`${t.hello} ${propertyTitle}`)}` : "";

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-4 border-b border-line p-6">
        {agent.photo ? (
          <img src={agent.photo} alt={name} className="h-16 w-16 rounded-full object-cover ring-4 ring-ivory" />
        ) : (
          <span className="grid h-16 w-16 place-items-center rounded-full bg-ink font-serif text-2xl text-white">{name[0]}</span>
        )}
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-brass-600">{t.listedBy}</div>
          <h3 className="truncate text-lg font-semibold">{name}</h3>
          <p className="text-xs text-muted">
            {agent.propertiesSold} {t.sold}
            {agent.yearsExperience ? ` · ${agent.yearsExperience} ${t.years}` : ""}
          </p>
        </div>
      </div>

      <div className="space-y-2.5 p-6">
        {agent.whatsapp && (
          <a
            href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, "")}${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn w-full bg-[#25D366] text-white hover:bg-[#1fb658]"
          >
            <FaWhatsapp className="h-5 w-5" />
            {t.whatsapp}
          </a>
        )}
        <div className="grid grid-cols-2 gap-2.5">
          <a href={`tel:${agent.phone}`} className="btn-outline !px-3">
            <LuPhone className="h-4 w-4" />
            <span className="truncate" dir="ltr">Call</span>
          </a>
          <a href={`mailto:${agent.email}`} className="btn-outline !px-3">
            <LuMail className="h-4 w-4" />
            Email
          </a>
        </div>
        {agent.languages?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {agent.languages.map((lang: string) => (
              <span key={lang} className="chip bg-ivory text-ink-600">{lang.toUpperCase()}</span>
            ))}
          </div>
        )}
        {agent.slug && (
          <Link href={`/agent/${agent.slug}`} className="group flex items-center justify-center gap-1 pt-2 text-sm font-semibold text-ink hover:text-brass-600">
            {t.profile}
            <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default AgentCard;
