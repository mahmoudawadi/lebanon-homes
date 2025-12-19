"use client";

import React, { useState, useEffect, useCallback } from "react";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PropertyFilters from "@/components/PropertyFilters";
import PropertyGrid from "@/components/PropertyGrid";
import PropertyMapView from "@/components/PropertyMapView";
import AISmartSearch from "@/components/AISmartSearch";
import AIPropertyMatcher from "@/components/AIPropertyMatcher";
import { FiGrid, FiMap } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";

const PropertiesPage = () => {
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.append(key, filters[key]);
    });

    try {
      const res = await fetch(`/api/properties?${params}`);
      const data = await res.json();
      setProperties(data.properties || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const translations: Record<string, { title: string; grid: string; map: string; subtitle: string }> = {
    en: { title: "Properties for Sale & Rent", grid: "Grid", map: "Map", subtitle: "Find your perfect property" },
    ar: { title: "عقارات للبيع والإيجار", grid: "شبكة", map: "خريطة", subtitle: "ابحث عن عقارك المثالي" },
    fr: { title: "Propriétés à Vendre et à Louer", grid: "Grille", map: "Carte", subtitle: "Trouvez votre propriété parfaite" },
  };

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />
      
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-serif font-bold text-luxury-dark mb-2">
                  {t.title}
                </h1>
                <p className="text-gray-600">{t.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-luxury-gold text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "map"
                      ? "bg-luxury-gold text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiMap className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* AI Smart Search */}
          <div className="mb-8">
            <AISmartSearch onSearch={(query) => {
              // Parse AI search query and update filters
              const lowerQuery = query.toLowerCase();
              if (lowerQuery.includes("beirut")) setFilters({ ...filters, city: "Beirut" });
              if (lowerQuery.includes("rent") || lowerQuery.includes("إيجار")) setFilters({ ...filters, listingType: "rent" });
              if (lowerQuery.includes("sale") || lowerQuery.includes("بيع")) setFilters({ ...filters, listingType: "sale" });
              // Extract price if mentioned
              const priceMatch = query.match(/\$?(\d+)[kK]?/);
              if (priceMatch) {
                const price = parseInt(priceMatch[1]) * (priceMatch[0].includes('k') || priceMatch[0].includes('K') ? 1000 : 1);
                setFilters({ ...filters, maxPrice: price.toString() });
              }
            }} />
          </div>

          {/* AI Property Matcher */}
          <div className="mb-8">
            <AIPropertyMatcher />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
            <div className="lg:col-span-1">
              <PropertyFilters filters={filters} setFilters={setFilters} />
            </div>
            <div className="lg:col-span-3">
              {viewMode === "grid" ? (
                <PropertyGrid properties={properties} loading={loading} />
              ) : (
                <PropertyMapView properties={properties} loading={loading} />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertiesPage;
