"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { LuPhone, LuMail } from "react-icons/lu";

const languages = [
  { code: "en" as const, label: "EN" },
  { code: "ar" as const, label: "AR" },
  { code: "fr" as const, label: "FR" },
];

const currencies = ["USD", "LBP"] as const;

const Segmented = ({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) => (
  <div className="flex items-center rounded-full bg-white/5 p-0.5 ring-1 ring-white/10" role="group" aria-label={label}>
    {options.map((option) => (
      <button
        key={option.value}
        onClick={() => onChange(option.value)}
        aria-pressed={value === option.value}
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-colors ${
          value === option.value ? "bg-brass text-white" : "text-white/60 hover:text-white"
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const StickyTopBar = () => {
  const { language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="bg-ink-900 text-white/80" id="sticky-top-bar">
      <div className="container-x flex h-10 items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-5">
          <a href="tel:+9611234567" className="flex items-center gap-1.5 transition-colors hover:text-white" aria-label="Call us">
            <LuPhone className="h-3.5 w-3.5 text-brass-400" />
            <span dir="ltr">+961 1 234 567</span>
          </a>
          <a href="mailto:info@lebestate.com" className="hidden items-center gap-1.5 transition-colors hover:text-white sm:flex">
            <LuMail className="h-3.5 w-3.5 text-brass-400" />
            info@lebestate.com
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Segmented
            label="Language"
            options={languages.map((l) => ({ value: l.code, label: l.label }))}
            value={language}
            onChange={(v) => setLanguage(v as (typeof languages)[number]["code"])}
          />
          <Segmented
            label="Currency"
            options={currencies.map((c) => ({ value: c, label: c }))}
            value={currency}
            onChange={(v) => setCurrency(v as (typeof currencies)[number])}
          />
        </div>
      </div>
    </div>
  );
};

export default StickyTopBar;
