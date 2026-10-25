"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuArrowRight } from "react-icons/lu";
import PropertyGrid from "./PropertyGrid";
import SectionHeading from "./SectionHeading";

const translations = {
  en: { eyebrow: "Curated selection", title: "Featured Properties", subtitle: "Handpicked properties for sale and rent", viewAll: "View All Properties" },
  ar: { eyebrow: "مختارات", title: "العقارات المميزة", subtitle: "عقارات مختارة للبيع والإيجار", viewAll: "عرض جميع العقارات" },
  fr: { eyebrow: "Sélection", title: "Propriétés en Vedette", subtitle: "Propriétés sélectionnées à vendre et à louer", viewAll: "Voir Toutes les Propriétés" },
};

const FeaturedListings = () => {
  const { language } = useLanguage();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Featured listings come first in the default sort order
    fetch("/api/properties?limit=6")
      .then((res) => res.json())
      .then((data) => setProperties(data.properties || []))
      .catch((err) => console.error("Error fetching properties:", err))
      .finally(() => setLoading(false));
  }, []);

  const t = translations[language] || translations.en;

  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          lead={t.subtitle}
          action={
            <Link href="/properties" className="btn-outline group">
              {t.viewAll}
              <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          }
        />
        <PropertyGrid properties={properties} loading={loading} />
      </div>
    </section>
  );
};

export default FeaturedListings;
