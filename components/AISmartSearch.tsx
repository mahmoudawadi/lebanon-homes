"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiSearch, FiStar } from "react-icons/fi";

const AISmartSearch = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");

  const translations = {
    en: {
      placeholder: "Describe what you're looking for... (e.g., '3 bedroom apartment with sea view in Beirut under $300k')",
      button: "AI Search",
    },
    ar: {
      placeholder: "اوصف ما تبحث عنه... (مثال: 'شقة 3 غرف نوم بإطلالة على البحر في بيروت تحت 300 ألف')",
      button: "بحث ذكي",
    },
    fr: {
      placeholder: "Décrivez ce que vous cherchez... (ex: 'appartement 3 chambres avec vue mer à Beyrouth sous 300k')",
      button: "Recherche IA",
    },
  };

  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2">
        <FiSparkles className="absolute left-4 text-purple-500 w-5 h-5 z-10" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.placeholder}
          className="w-full pl-12 pr-32 py-4 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2"
        >
          <FiSearch className="w-4 h-4" />
          {t.button}
        </button>
      </div>
    </form>
  );
};

export default AISmartSearch;

