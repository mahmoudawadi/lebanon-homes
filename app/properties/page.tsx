"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PropertyFilters from "@/components/PropertyFilters";
import PropertyGrid from "@/components/PropertyGrid";
import PropertyMapView from "@/components/PropertyMapView";
import AISmartSearch from "@/components/AISmartSearch";
import AIPropertyMatcher from "@/components/AIPropertyMatcher";
import { LuLayoutGrid, LuMap, LuSlidersHorizontal } from "react-icons/lu";
import { useLanguage } from "@/contexts/LanguageContext";

const FILTER_KEYS = ["listingType", "city", "type", "bedrooms", "minPrice", "maxPrice", "minSize", "maxSize", "seaView", "hasSolar", "hasGenerator"];

const KNOWN_CITIES = ["Beirut", "Jounieh", "Dbayeh", "Metn", "Byblos", "Batroun", "Broummana", "Achrafieh", "Tripoli", "Saida"];

const translations = {
  en: { eyebrow: "Browse listings", title: "Properties for Sale & Rent", subtitle: "Find your perfect property", grid: "Grid", map: "Map", results: "properties found", crumb: "Properties", filters: "Filters" },
  ar: { eyebrow: "تصفح العقارات", title: "عقارات للبيع والإيجار", subtitle: "ابحث عن عقارك المثالي", grid: "شبكة", map: "خريطة", results: "عقار", crumb: "العقارات", filters: "المرشحات" },
  fr: { eyebrow: "Annonces", title: "Propriétés à Vendre et à Louer", subtitle: "Trouvez votre propriété parfaite", grid: "Grille", map: "Carte", results: "propriétés trouvées", crumb: "Propriétés", filters: "Filtres" },
};

// Turn a free-text query into filters, e.g. "3 bedroom villa in Jounieh under 500k with sea view"
function parseSmartQuery(query: string): Record<string, string> {
  const q = query.toLowerCase();
  const filters: Record<string, string> = {};

  const city = KNOWN_CITIES.find((c) => q.includes(c.toLowerCase()));
  if (city) filters.city = city;
  else if (q.includes("بيروت") || q.includes("beyrouth")) filters.city = "Beirut";

  if (/\b(rent|rental|louer|location)\b/.test(q) || q.includes("إيجار")) filters.listingType = "rent";
  else if (/\b(buy|sale|acheter|vendre)\b/.test(q) || q.includes("بيع") || q.includes("شراء")) filters.listingType = "sale";

  for (const type of ["apartment", "villa", "penthouse", "commercial"]) {
    if (q.includes(type)) filters.type = type;
  }

  const beds = q.match(/(\d+)\s*(?:-|\s)?(?:bed|bedroom|br|chambre|غرف)/);
  if (beds) filters.bedrooms = beds[1];

  if (q.includes("sea view") || q.includes("vue mer") || q.includes("إطلالة")) filters.seaView = "true";

  // A price is a number after "under"/"max"/…, or one written with $, k or m
  const price =
    q.match(/(?:under|below|less than|max|sous|moins de|تحت)\s*\$?\s*(\d[\d,]*(?:\.\d+)?)\s*(k|m|ألف)?/) ||
    q.match(/\$\s*(\d[\d,]*(?:\.\d+)?)\s*(k|m)?/) ||
    q.match(/(\d+(?:\.\d+)?)\s*(k|m|ألف)(?![a-z])/);
  if (price) {
    const [, amount, unit] = price;
    const multiplier = unit === "m" ? 1_000_000 : unit === "k" || unit === "ألف" ? 1_000 : 1;
    filters.maxPrice = String(Math.round(parseFloat(amount.replace(/,/g, "")) * multiplier));
  }

  return filters;
}

const PropertiesContent = () => {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    FILTER_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) initial[key] = value;
    });
    return initial;
  });

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    // Keep the URL shareable, and debounce so typing doesn't spam the API
    router.replace(`/properties${params.toString() ? `?${params}` : ""}`, { scroll: false });

    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        params.set("limit", "24");
        const res = await fetch(`/api/properties?${params}`, { signal: controller.signal });
        const data = await res.json();
        setProperties(data.properties || []);
        setTotal(data.pagination?.total ?? (data.properties || []).length);
        setLoading(false);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching properties:", error);
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters, router]);

  const t = translations[language] || translations.en;

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} crumb={t.crumb}>
        <div className="mt-8 max-w-3xl">
          <AISmartSearch onSearch={(query) => setFilters(parseSmartQuery(query))} />
        </div>
      </PageHeader>

      <div className="container-x py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
          {/* On small screens the filters are collapsed behind a toggle */}
          <div className={`${showFilters ? "" : "hidden"} lg:block`}>
            <PropertyFilters filters={filters} setFilters={setFilters} />
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between gap-3">
              <button onClick={() => setShowFilters(!showFilters)} className="btn-outline !px-4 !py-2 lg:hidden" aria-expanded={showFilters}>
                <LuSlidersHorizontal className="h-4 w-4" />
                {t.filters}
              </button>
              <p className="hidden text-sm text-muted sm:block">
                {loading ? "…" : <><span className="font-semibold text-ink">{total}</span> {t.results}</>}
              </p>
              <div className="flex rounded-full border border-line bg-white p-1">
                {([
                  { mode: "grid", icon: LuLayoutGrid, label: t.grid },
                  { mode: "map", icon: LuMap, label: t.map },
                ] as const).map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    aria-pressed={viewMode === mode}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      viewMode === mode ? "bg-ink text-white" : "text-muted hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {viewMode === "grid" ? (
              <PropertyGrid properties={properties} loading={loading} columns={2} />
            ) : (
              <PropertyMapView properties={properties} loading={loading} />
            )}
          </div>
        </div>
      </div>

      <AIPropertyMatcher />
    </>
  );
};

const PropertiesPage = () => (
  <div className="min-h-screen">
    <StickyTopBar />
    <MainHeader />
    {/* useSearchParams needs a Suspense boundary for static rendering */}
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <PropertiesContent />
    </Suspense>
    <Footer />
  </div>
);

export default PropertiesPage;
