"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PropertyGrid from "./PropertyGrid";
import SectionHeading from "./SectionHeading";

const translations = {
  en: { eyebrow: "You may also like", title: "Similar Properties" },
  ar: { eyebrow: "قد يعجبك أيضاً", title: "عقارات مشابهة" },
  fr: { eyebrow: "Vous aimerez aussi", title: "Propriétés Similaires" },
};

// Similar listings (same city or type) come from the property detail API
const SimilarProperties = ({ properties }: { properties: any[] }) => {
  const { language } = useLanguage();
  if (!properties || properties.length === 0) return null;

  const t = translations[language];

  return (
    <section className="section border-t border-line bg-white">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />
        <PropertyGrid properties={properties.slice(0, 3)} loading={false} />
      </div>
    </section>
  );
};

export default SimilarProperties;
