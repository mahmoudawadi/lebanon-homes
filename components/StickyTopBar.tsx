"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { FiPhone } from "react-icons/fi";

const StickyTopBar = () => {
  const { language, setLanguage, isRTL } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  const languages = [
    { code: "en" as const, label: "EN" },
    { code: "ar" as const, label: "AR" },
    { code: "fr" as const, label: "FR" },
  ];

  return (
    <div className="sticky top-0 z-50 bg-black text-white border-b border-gray-900" id="sticky-top-bar">
      <div className="container mx-auto px-4">
        <div className="flex items-start py-4">
          {/* Left Side - Phone, Language, Currency stacked vertically */}
          <div className="flex flex-col gap-3">
            {/* Phone Number */}
            <a
              href="tel:+9611234567"
              className="text-white text-sm font-medium hover:opacity-80 transition-opacity"
              aria-label="Call us"
            >
              +961 1 234 567
            </a>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3.5 py-2 text-xs font-medium transition-colors ${
                    language === lang.code
                      ? "bg-gray-600 text-white"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Currency Toggle */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrency("USD")}
                className={`px-3.5 py-2 text-xs font-medium transition-colors ${
                  currency === "USD"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency("LBP")}
                className={`px-3.5 py-2 text-xs font-medium transition-colors ${
                  currency === "LBP"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                LBP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyTopBar;

