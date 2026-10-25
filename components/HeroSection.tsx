"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuSearch, LuMapPin, LuHouse, LuDollarSign } from "react-icons/lu";

const translations = {
  en: {
    eyebrow: "Lebanon's trusted property partner",
    title: "Find Your Perfect Home",
    subtitle: "Buy & Rent Properties Across Lebanon — from Beirut penthouses to mountain villas.",
    searchPlaceholder: "City or neighborhood",
    location: "Location",
    propertyType: "Property Type",
    buy: "Buy",
    rent: "Rent",
    maxPrice: "Max Price",
    any: "Any price",
    searchButton: "Search",
    allTypes: "All Types",
    apartment: "Apartment",
    villa: "Villa",
    penthouse: "Penthouse",
    commercial: "Commercial",
    popular: "Popular:",
  },
  ar: {
    eyebrow: "شريكك العقاري الموثوق في لبنان",
    title: "ابحث عن عقارك المثالي",
    subtitle: "شراء وإيجار العقارات في لبنان — من شقق بيروت الفاخرة إلى فيلات الجبل.",
    searchPlaceholder: "المدينة أو الحي",
    location: "الموقع",
    propertyType: "نوع العقار",
    buy: "شراء",
    rent: "إيجار",
    maxPrice: "السعر الأقصى",
    any: "أي سعر",
    searchButton: "بحث",
    allTypes: "جميع الأنواع",
    apartment: "شقة",
    villa: "فيلا",
    penthouse: "بنتهاوس",
    commercial: "تجاري",
    popular: "الأكثر بحثاً:",
  },
  fr: {
    eyebrow: "Votre partenaire immobilier au Liban",
    title: "Trouvez Votre Propriété Parfaite",
    subtitle: "Acheter et Louer des Propriétés au Liban — des penthouses de Beyrouth aux villas de montagne.",
    searchPlaceholder: "Ville ou quartier",
    location: "Emplacement",
    propertyType: "Type de Propriété",
    buy: "Acheter",
    rent: "Louer",
    maxPrice: "Prix Max",
    any: "Tout prix",
    searchButton: "Rechercher",
    allTypes: "Tous les Types",
    apartment: "Appartement",
    villa: "Villa",
    penthouse: "Penthouse",
    commercial: "Commercial",
    popular: "Populaire :",
  },
};

const priceOptions = {
  sale: [250000, 500000, 1000000, 2000000],
  rent: [1000, 2000, 3500, 5000],
};

const popularCities = ["Beirut", "Jounieh", "Dbayeh", "Metn"];

const HeroSection = () => {
  const { language } = useLanguage();
  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState<"sale" | "rent">("sale");
  const [maxPrice, setMaxPrice] = useState("");

  const t = translations[language];

  const search = (city = searchLocation) => {
    const params = new URLSearchParams({ listingType });
    if (city.trim()) params.set("city", city.trim());
    if (propertyType) params.set("type", propertyType);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/properties?${params}`);
  };

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=80"
          className="h-full w-full object-cover"
        >
          <source src="/videos/luxury-skyline.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/90 via-ink-900/60 to-ink-900/20 rtl:bg-gradient-to-l" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-900/60 to-transparent" />
      </div>

      <div className="container-x flex min-h-[calc(100svh-112px)] flex-col justify-center py-20 md:py-28">
        <div className="max-w-3xl animate-fade-up">
          <span className="eyebrow !text-brass-400">{t.eyebrow}</span>
          <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] !text-white sm:text-6xl lg:text-7xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 md:text-xl">{t.subtitle}</p>
        </div>

        {/* Search panel */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
          className="mt-12 max-w-5xl animate-fade-up [animation-delay:150ms]"
        >
          <div className="inline-flex rounded-t-2xl bg-white/95 p-1.5 pb-0 backdrop-blur">
            {(["sale", "rent"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setListingType(type);
                  setMaxPrice("");
                }}
                className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors ${
                  listingType === type ? "bg-ink text-white" : "text-ink-500 hover:text-ink"
                }`}
              >
                {type === "sale" ? t.buy : t.rent}
              </button>
            ))}
          </div>

          <div className="grid gap-2 rounded-2xl rounded-ss-none bg-white p-3 shadow-lift md:grid-cols-[1.4fr_1fr_1fr_auto] md:gap-0 md:divide-x md:divide-line rtl:md:divide-x-reverse">
            <label className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition hover:bg-ivory md:rounded-none">
              <LuMapPin className="h-5 w-5 shrink-0 text-brass" />
              <span className="flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted">{t.location}</span>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-ink placeholder:text-ink/40 focus:outline-none"
                />
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition hover:bg-ivory md:rounded-none">
              <LuHouse className="h-5 w-5 shrink-0 text-brass" />
              <span className="flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted">{t.propertyType}</span>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-ink focus:outline-none"
                >
                  <option value="">{t.allTypes}</option>
                  <option value="apartment">{t.apartment}</option>
                  <option value="villa">{t.villa}</option>
                  <option value="penthouse">{t.penthouse}</option>
                  <option value="commercial">{t.commercial}</option>
                </select>
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition hover:bg-ivory md:rounded-none">
              <LuDollarSign className="h-5 w-5 shrink-0 text-brass" />
              <span className="flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted">{t.maxPrice}</span>
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-ink focus:outline-none"
                >
                  <option value="">{t.any}</option>
                  {priceOptions[listingType].map((p) => (
                    <option key={p} value={p}>
                      ${p.toLocaleString("en-US")}
                      {listingType === "rent" ? " / mo" : ""}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            <div className="md:ps-3">
              <button type="submit" className="btn-accent h-full w-full !rounded-xl !px-8 !py-4">
                <LuSearch className="h-5 w-5" />
                {t.searchButton}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <span>{t.popular}</span>
            {popularCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => search(city)}
                className="rounded-full border border-white/20 px-3 py-1 text-white/85 transition hover:border-white/50 hover:text-white"
              >
                {city}
              </button>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;
