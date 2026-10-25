"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuTarget, LuCircleCheck } from "react-icons/lu";
import PropertyGrid from "./PropertyGrid";
import SectionHeading from "./SectionHeading";

const translations = {
  en: {
    eyebrow: "Smart matching",
    title: "AI Property Matcher",
    subtitle: "Find your perfect match in seconds",
    budget: "Budget",
    perMonth: "per month",
    total: "total",
    bedrooms: "Bedrooms",
    any: "Any",
    city: "City",
    cityPlaceholder: "Beirut, Dbayeh, etc.",
    iWant: "I want to",
    buy: "Buy",
    rent: "Rent",
    find: "Find My Match",
    matching: "Matching…",
    results: "Properties Matched for You",
    noResults: "No exact matches yet — try a higher budget or a different city.",
  },
  ar: {
    eyebrow: "مطابقة ذكية",
    title: "مطابق العقارات بالذكاء الاصطناعي",
    subtitle: "ابحث عن مطابقتك المثالية في ثوانٍ",
    budget: "الميزانية",
    perMonth: "شهرياً",
    total: "إجمالي",
    bedrooms: "غرف النوم",
    any: "أي",
    city: "المدينة",
    cityPlaceholder: "بيروت، ضبية، إلخ.",
    iWant: "أريد",
    buy: "شراء",
    rent: "إيجار",
    find: "ابحث عن مطابقي",
    matching: "جارٍ المطابقة…",
    results: "العقارات المطابقة لك",
    noResults: "لا توجد نتائج مطابقة — جرّب ميزانية أعلى أو مدينة أخرى.",
  },
  fr: {
    eyebrow: "Correspondance intelligente",
    title: "Appariement de Propriétés IA",
    subtitle: "Trouvez votre correspondance parfaite en quelques secondes",
    budget: "Budget",
    perMonth: "par mois",
    total: "total",
    bedrooms: "Chambres",
    any: "Tous",
    city: "Ville",
    cityPlaceholder: "Beyrouth, Dbayeh, etc.",
    iWant: "Je veux",
    buy: "Acheter",
    rent: "Louer",
    find: "Trouver Ma Correspondance",
    matching: "Recherche…",
    results: "Propriétés Correspondant à Vos Critères",
    noResults: "Aucune correspondance — essayez un budget plus élevé ou une autre ville.",
  },
};

const AIPropertyMatcher = () => {
  const { language } = useLanguage();
  const [matches, setMatches] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    budget: "",
    bedrooms: "",
    city: "",
    listingType: "sale" as "sale" | "rent",
  });

  const t = translations[language];

  const handleFind = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams({ listingType: formData.listingType });
      if (formData.budget) params.append("maxPrice", formData.budget);
      if (formData.bedrooms) params.append("bedrooms", formData.bedrooms);
      if (formData.city) params.append("city", formData.city);

      const response = await fetch(`/api/properties?${params}`);
      const data = await response.json();
      setMatches(data.properties || []);
    } catch (error) {
      console.error("Match error:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section border-t border-line bg-white">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} lead={t.subtitle} align="center" />

        <form onSubmit={handleFind} className="card mx-auto mb-12 max-w-4xl bg-ivory-50 p-6 md:p-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <span className="label">{t.iWant}</span>
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-white p-1 ring-1 ring-line">
                {(["sale", "rent"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, listingType: type })}
                    className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                      formData.listingType === type ? "bg-ink text-white" : "text-muted hover:text-ink"
                    }`}
                  >
                    {type === "sale" ? t.buy : t.rent}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label" htmlFor="match-budget">
                {t.budget} ({formData.listingType === "rent" ? t.perMonth : t.total})
              </label>
              <input
                id="match-budget"
                type="number"
                min={0}
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder={formData.listingType === "rent" ? "800" : "300000"}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="match-beds">{t.bedrooms}</label>
              <select
                id="match-beds"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="input cursor-pointer"
              >
                <option value="">{t.any}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="match-city">{t.city}</label>
              <input
                id="match-city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder={t.cityPlaceholder}
                className="input"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-accent mt-6 w-full !py-4">
            <LuTarget className="h-5 w-5" />
            {loading ? t.matching : t.find}
          </button>
        </form>

        {matches && (
          matches.length > 0 ? (
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                <LuCircleCheck className="h-6 w-6 text-emerald-600" />
                {t.results} ({matches.length})
              </h3>
              <PropertyGrid properties={matches} loading={false} />
            </div>
          ) : (
            <p className="text-center text-muted">{t.noResults}</p>
          )
        )}
      </div>
    </section>
  );
};

export default AIPropertyMatcher;
