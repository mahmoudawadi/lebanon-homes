"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiTarget, FiCheckCircle } from "react-icons/fi";
import PropertyGrid from "./PropertyGrid";

const AIPropertyMatcher = () => {
  const { language } = useLanguage();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    budget: "",
    bedrooms: "",
    city: "",
    listingType: "buy",
    features: [] as string[],
  });

  const translations = {
    en: {
      title: "AI Property Matcher",
      subtitle: "Find your perfect match in seconds",
      budget: "Budget",
      bedrooms: "Bedrooms",
      city: "City",
      features: "Must Have Features",
      find: "Find My Match",
      results: "Properties Matched for You",
    },
    ar: {
      title: "مطابق العقارات بالذكاء الاصطناعي",
      subtitle: "ابحث عن مطابقتك المثالية في ثوانٍ",
      budget: "الميزانية",
      bedrooms: "غرف النوم",
      city: "المدينة",
      features: "الميزات المطلوبة",
      find: "ابحث عن مطابقي",
      results: "العقارات المطابقة لك",
    },
    fr: {
      title: "Appariement de Propriétés IA",
      subtitle: "Trouvez votre correspondance parfaite en quelques secondes",
      budget: "Budget",
      bedrooms: "Chambres",
      city: "Ville",
      features: "Caractéristiques Requises",
      find: "Trouver Ma Correspondance",
      results: "Propriétés Correspondant à Vos Critères",
    },
  };

  const t = translations[language];

  const handleFind = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (formData.budget) params.append("maxPrice", formData.budget);
      if (formData.bedrooms) params.append("bedrooms", formData.bedrooms);
      if (formData.city) params.append("city", formData.city);
      params.append("listingType", formData.listingType);

      const response = await fetch(`/api/properties?${params}`);
      const data = await response.json();
      setMatches(data.properties || []);
    } catch (error) {
      console.error("Match error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <FiTarget className="w-8 h-8 text-purple-600" />
            <h2 className="text-4xl font-serif font-bold text-luxury-dark">
              {t.title}
            </h2>
          </div>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 shadow-lg mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.budget} ({formData.listingType === "rent" ? "per month" : "total"})
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder={formData.listingType === "rent" ? "$800" : "$300,000"}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.bedrooms}
              </label>
              <select
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.city}
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Beirut, Dbayeh, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormData({ ...formData, listingType: "buy" })}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    formData.listingType === "buy"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setFormData({ ...formData, listingType: "rent" })}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    formData.listingType === "rent"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  Rent
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleFind}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FiTarget className="w-5 h-5" />
            {loading ? "Matching..." : t.find}
          </button>
        </div>

        {matches.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-luxury-dark mb-6 flex items-center gap-2">
              <FiCheckCircle className="w-6 h-6 text-green-500" />
              {t.results} ({matches.length})
            </h3>
            <PropertyGrid properties={matches} loading={false} />
          </div>
        )}
      </div>
    </section>
  );
};

export default AIPropertyMatcher;


