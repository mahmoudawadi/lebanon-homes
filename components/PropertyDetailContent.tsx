"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LuBedDouble,
  LuBath,
  LuRuler,
  LuBuilding2,
  LuWaves,
  LuSun,
  LuZap,
  LuWind,
  LuCar,
  LuSofa,
  LuTrees,
  LuArrowUp,
  LuCalendar,
  LuLayers,
  LuTrendingUp,
} from "react-icons/lu";
import { localizedField } from "@/lib/format";

const translations = {
  en: {
    overview: "Overview",
    description: "Description",
    features: "Features & Amenities",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    area: "Area",
    type: "Type",
    yearBuilt: "Year Built",
    floor: "Floor",
    investment: "Investment Data",
    rentalYield: "Rental Yield",
    appreciation: "Capital Appreciation",
    seaView: "Sea View",
    solar: "Solar Power",
    generator: "Generator",
    ac: "Air Conditioning",
    elevator: "Elevator",
    parking: "Parking",
    garden: "Garden",
    pool: "Swimming Pool",
    furnished: "Furnished",
  },
  ar: {
    overview: "نظرة عامة",
    description: "الوصف",
    features: "الميزات والمرافق",
    bedrooms: "غرف النوم",
    bathrooms: "الحمامات",
    area: "المساحة",
    type: "النوع",
    yearBuilt: "سنة البناء",
    floor: "الطابق",
    investment: "بيانات الاستثمار",
    rentalYield: "العائد الإيجاري",
    appreciation: "ارتفاع رأس المال",
    seaView: "إطلالة بحرية",
    solar: "طاقة شمسية",
    generator: "مولد كهرباء",
    ac: "تكييف",
    elevator: "مصعد",
    parking: "موقف سيارات",
    garden: "حديقة",
    pool: "مسبح",
    furnished: "مفروش",
  },
  fr: {
    overview: "Aperçu",
    description: "Description",
    features: "Caractéristiques",
    bedrooms: "Chambres",
    bathrooms: "Salles de bain",
    area: "Surface",
    type: "Type",
    yearBuilt: "Année",
    floor: "Étage",
    investment: "Données d'Investissement",
    rentalYield: "Rendement Locatif",
    appreciation: "Plus-value",
    seaView: "Vue Mer",
    solar: "Énergie Solaire",
    generator: "Générateur",
    ac: "Climatisation",
    elevator: "Ascenseur",
    parking: "Parking",
    garden: "Jardin",
    pool: "Piscine",
    furnished: "Meublé",
  },
};

const PropertyDetailContent = ({ property }: { property: any }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const description = localizedField(property, "description", language);

  const facts = [
    { icon: LuBedDouble, label: t.bedrooms, value: property.bedrooms },
    { icon: LuBath, label: t.bathrooms, value: property.bathrooms },
    { icon: LuRuler, label: t.area, value: `${property.areaSqm} m²` },
    { icon: LuBuilding2, label: t.type, value: <span className="capitalize">{property.propertyType}</span> },
    property.yearBuilt && { icon: LuCalendar, label: t.yearBuilt, value: property.yearBuilt },
    property.floor != null && {
      icon: LuLayers,
      label: t.floor,
      value: property.totalFloors ? `${property.floor} / ${property.totalFloors}` : property.floor,
    },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: React.ReactNode }[];

  const amenities = [
    { key: "seaView", icon: LuWaves, label: t.seaView },
    { key: "hasSolar", icon: LuSun, label: t.solar },
    { key: "hasGenerator", icon: LuZap, label: t.generator },
    { key: "hasAC", icon: LuWind, label: t.ac },
    { key: "hasElevator", icon: LuArrowUp, label: t.elevator },
    { key: "hasParking", icon: LuCar, label: t.parking },
    { key: "hasGarden", icon: LuTrees, label: t.garden },
    { key: "hasPool", icon: LuWaves, label: t.pool },
    { key: "furnished", icon: LuSofa, label: t.furnished },
  ].filter((a) => property[a.key]);

  return (
    <div className="space-y-12">
      <section>
        <h2 className="font-serif text-2xl font-semibold">{t.overview}</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="card flex items-center gap-4 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brass-50 text-brass-600">
                <fact.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-wider text-muted">{fact.label}</span>
                <span className="block text-lg font-semibold">{fact.value}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-semibold">{t.description}</h2>
        <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-ink-600">{description}</p>
      </section>

      {amenities.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl font-semibold">{t.features}</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {amenities.map((a) => (
              <li key={a.key} className="flex items-center gap-3 text-ink-600">
                <a.icon className="h-5 w-5 text-brass" />
                {a.label}
              </li>
            ))}
          </ul>
        </section>
      )}

      {property.rentalYield && (
        <section className="rounded-2xl bg-ink p-6 text-white md:p-8">
          <h3 className="flex items-center gap-2 text-lg font-semibold !text-white">
            <LuTrendingUp className="h-5 w-5 text-brass-400" />
            {t.investment}
          </h3>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/50">{t.rentalYield}</div>
              <div className="mt-1 font-serif text-4xl font-semibold text-brass-400">{property.rentalYield}%</div>
            </div>
            {property.capitalAppreciation && (
              <div>
                <div className="text-xs uppercase tracking-wider text-white/50">{t.appreciation}</div>
                <div className="mt-1 font-serif text-4xl font-semibold text-brass-400">{property.capitalAppreciation}%</div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default PropertyDetailContent;
