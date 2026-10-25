"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuSlidersHorizontal } from "react-icons/lu";

const translations = {
  en: {
    filters: "Filters",
    listingType: "Listing Type",
    buy: "Buy",
    rent: "Rent",
    location: "Location",
    cityPlaceholder: "City...",
    type: "Property Type",
    price: "Price Range (USD)",
    size: "Size (sqm)",
    bedrooms: "Bedrooms",
    any: "Any",
    features: "Features",
    seaView: "Sea View",
    solar: "Solar",
    generator: "Generator",
    clear: "Clear All",
    all: "All",
    min: "Min",
    max: "Max",
    apartment: "Apartment",
    villa: "Villa",
    penthouse: "Penthouse",
    commercial: "Commercial",
  },
  ar: {
    filters: "المرشحات",
    listingType: "نوع العرض",
    buy: "شراء",
    rent: "إيجار",
    location: "الموقع",
    cityPlaceholder: "المدينة...",
    type: "نوع العقار",
    price: "نطاق السعر (دولار)",
    size: "الحجم (م²)",
    bedrooms: "غرف النوم",
    any: "أي",
    features: "الميزات",
    seaView: "إطلالة بحرية",
    solar: "طاقة شمسية",
    generator: "مولد",
    clear: "مسح الكل",
    all: "الكل",
    min: "الأدنى",
    max: "الأقصى",
    apartment: "شقة",
    villa: "فيلا",
    penthouse: "بنتهاوس",
    commercial: "تجاري",
  },
  fr: {
    filters: "Filtres",
    listingType: "Type d'annonce",
    buy: "Acheter",
    rent: "Louer",
    location: "Emplacement",
    cityPlaceholder: "Ville...",
    type: "Type de Propriété",
    price: "Gamme de Prix (USD)",
    size: "Taille (m²)",
    bedrooms: "Chambres",
    any: "Tous",
    features: "Caractéristiques",
    seaView: "Vue Mer",
    solar: "Solaire",
    generator: "Générateur",
    clear: "Tout Effacer",
    all: "Tout",
    min: "Min",
    max: "Max",
    apartment: "Appartement",
    villa: "Villa",
    penthouse: "Penthouse",
    commercial: "Commercial",
  },
};

interface PropertyFiltersProps {
  filters: Record<string, string>;
  setFilters: (filters: Record<string, string>) => void;
}

const PropertyFilters = ({ filters, setFilters }: PropertyFiltersProps) => {
  const { language } = useLanguage();
  const t = translations[language];

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  const features = [
    { key: "seaView", label: t.seaView },
    { key: "hasSolar", label: t.solar },
    { key: "hasGenerator", label: t.generator },
  ];

  return (
    <aside className="card p-6 lg:sticky lg:top-24">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <LuSlidersHorizontal className="h-4 w-4 text-brass" />
          {t.filters}
          {activeCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1.5 text-[11px] text-white">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button onClick={() => setFilters({})} className="text-sm font-medium text-brass-600 hover:underline">
            {t.clear}
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <span className="label">{t.listingType}</span>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-ivory p-1">
            {(["sale", "rent"] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange("listingType", filters.listingType === type ? "" : type)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  filters.listingType === type ? "bg-white text-ink shadow-soft" : "text-muted hover:text-ink"
                }`}
              >
                {type === "sale" ? t.buy : t.rent}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="filter-city">{t.location}</label>
          <input
            id="filter-city"
            type="text"
            value={filters.city || ""}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            placeholder={t.cityPlaceholder}
            className="input"
          />
        </div>

        <div>
          <label className="label" htmlFor="filter-type">{t.type}</label>
          <select
            id="filter-type"
            value={filters.type || ""}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="input cursor-pointer"
          >
            <option value="">{t.all}</option>
            <option value="apartment">{t.apartment}</option>
            <option value="villa">{t.villa}</option>
            <option value="penthouse">{t.penthouse}</option>
            <option value="commercial">{t.commercial}</option>
          </select>
        </div>

        <div>
          <span className="label">{t.bedrooms}</span>
          <div className="grid grid-cols-5 gap-1.5">
            {["", "1", "2", "3", "4"].map((beds) => (
              <button
                key={beds || "any"}
                onClick={() => handleFilterChange("bedrooms", beds)}
                className={`rounded-lg border py-2 text-sm font-medium transition ${
                  (filters.bedrooms || "") === beds
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink-600 hover:border-ink/30"
                }`}
              >
                {beds === "" ? t.any : beds === "4" ? "4+" : beds}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="label">{t.price}</span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              value={filters.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              placeholder={t.min}
              className="input"
            />
            <input
              type="number"
              min={0}
              value={filters.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              placeholder={t.max}
              className="input"
            />
          </div>
        </div>

        <div>
          <span className="label">{t.size}</span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              value={filters.minSize || ""}
              onChange={(e) => handleFilterChange("minSize", e.target.value)}
              placeholder={t.min}
              className="input"
            />
            <input
              type="number"
              min={0}
              value={filters.maxSize || ""}
              onChange={(e) => handleFilterChange("maxSize", e.target.value)}
              placeholder={t.max}
              className="input"
            />
          </div>
        </div>

        <div>
          <span className="label">{t.features}</span>
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => {
              const active = filters[feature.key] === "true";
              return (
                <button
                  key={feature.key}
                  onClick={() => handleFilterChange(feature.key, active ? "" : "true")}
                  aria-pressed={active}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                    active ? "border-brass bg-brass-50 text-brass-700" : "border-line bg-white text-ink-600 hover:border-ink/30"
                  }`}
                >
                  {feature.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PropertyFilters;
