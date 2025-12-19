"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { FiX } from "react-icons/fi";

const PropertyFilters = ({ filters, setFilters }: any) => {
  const { language } = useLanguage();
  const { currency, convertPrice } = useCurrency();

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const translations = {
    en: {
      filters: "Filters",
      location: "Location",
      type: "Property Type",
      price: "Price Range",
      size: "Size (sqm)",
      features: "Features",
      clear: "Clear All",
      all: "All",
    },
    ar: { filters: "المرشحات", location: "الموقع", type: "نوع العقار", price: "نطاق السعر", size: "الحجم (م²)", features: "الميزات", clear: "مسح الكل", all: "الكل" },
    fr: { filters: "Filtres", location: "Emplacement", type: "Type de Propriété", price: "Gamme de Prix", size: "Taille (m²)", features: "Caractéristiques", clear: "Tout Effacer", all: "Tout" },
  };

  const t = translations[language];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-luxury-dark">{t.filters}</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-luxury-gold hover:underline"
        >
          {t.clear}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.listingType || "Listing Type"}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleFilterChange("listingType", filters.listingType === "sale" ? "" : "sale")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.listingType === "sale"
                  ? "bg-estate-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.buy || "Buy"}
            </button>
            <button
              onClick={() => handleFilterChange("listingType", filters.listingType === "rent" ? "" : "rent")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.listingType === "rent"
                  ? "bg-estate-secondary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.rent || "Rent"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.location}
          </label>
          <input
            type="text"
            value={filters.city || ""}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            placeholder="City..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.type}
          </label>
          <select
            value={filters.type || ""}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">{t.all}</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="penthouse">Penthouse</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.price}
          </label>
          <div className="space-y-2">
            <input
              type="number"
              value={filters.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              placeholder="Min"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            />
            <input
              type="number"
              value={filters.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              placeholder="Max"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.size}
          </label>
          <div className="space-y-2">
            <input
              type="number"
              value={filters.minSize || ""}
              onChange={(e) => handleFilterChange("minSize", e.target.value)}
              placeholder="Min sqm"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            />
            <input
              type="number"
              value={filters.maxSize || ""}
              onChange={(e) => handleFilterChange("maxSize", e.target.value)}
              placeholder="Max sqm"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.features}
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.seaView === "true"}
                onChange={(e) =>
                  handleFilterChange("seaView", e.target.checked ? "true" : "")
                }
                className="mr-2"
              />
              <span className="text-sm">Sea View</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasSolar === "true"}
                onChange={(e) =>
                  handleFilterChange("hasSolar", e.target.checked ? "true" : "")
                }
                className="mr-2"
              />
              <span className="text-sm">Solar</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasGenerator === "true"}
                onChange={(e) =>
                  handleFilterChange(
                    "hasGenerator",
                    e.target.checked ? "true" : ""
                  )
                }
                className="mr-2"
              />
              <span className="text-sm">Generator</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;

