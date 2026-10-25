"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuSearch, LuSparkles } from "react-icons/lu";

const translations = {
  en: {
    placeholder: "Describe what you're looking for… e.g. '3 bedroom apartment with sea view in Beirut under $300k'",
    button: "AI Search",
  },
  ar: {
    placeholder: "اوصف ما تبحث عنه... (مثال: 'شقة 3 غرف نوم بإطلالة على البحر في بيروت تحت 300 ألف')",
    button: "بحث ذكي",
  },
  fr: {
    placeholder: "Décrivez ce que vous cherchez… ex : 'appartement 3 chambres avec vue mer à Beyrouth sous 300k'",
    button: "Recherche IA",
  },
};

const AISmartSearch = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");

  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lift ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-brass"
    >
      <LuSparkles className="ms-3 h-5 w-5 shrink-0 text-brass" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.placeholder}
        className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-ink placeholder:text-muted/80 focus:outline-none"
      />
      <button type="submit" className="btn-primary shrink-0 !rounded-xl">
        <LuSearch className="h-4 w-4" />
        <span className="hidden sm:inline">{t.button}</span>
      </button>
    </form>
  );
};

export default AISmartSearch;
