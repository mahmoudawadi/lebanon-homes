"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuSearchX } from "react-icons/lu";
import PropertyCard from "./PropertyCard";
import { Reveal } from "./Motion";

const emptyText = {
  en: { title: "No properties found", body: "Try adjusting your filters or searching a different area." },
  ar: { title: "لم يتم العثور على عقارات", body: "جرّب تعديل المرشحات أو البحث في منطقة أخرى." },
  fr: { title: "Aucune propriété trouvée", body: "Essayez d'ajuster vos filtres ou de chercher ailleurs." },
};

interface PropertyGridProps {
  properties: any[];
  loading: boolean;
  columns?: 2 | 3;
}

const PropertyGrid = ({ properties, loading, columns = 3 }: PropertyGridProps) => {
  const { language } = useLanguage();
  const gridClass =
    columns === 2
      ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
      : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

  if (loading) {
    return (
      <div className={gridClass}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="skeleton aspect-[4/3] !rounded-none" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-6 w-1/2" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    const t = emptyText[language];
    return (
      <div className="card flex flex-col items-center px-6 py-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-ivory text-brass">
          <LuSearchX className="h-6 w-6" />
        </span>
        <p className="mt-4 font-serif text-xl font-semibold">{t.title}</p>
        <p className="mt-1 text-sm text-muted">{t.body}</p>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {properties
        .filter((p) => p && p.id)
        .map((property, i) => (
          <Reveal key={property.id} delay={(i % 3) * 0.08} className="flex">
            <PropertyCard property={property} />
          </Reveal>
        ))}
    </div>
  );
};

export default PropertyGrid;
