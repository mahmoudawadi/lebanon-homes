"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiSearch, FiMapPin, FiHome, FiDollarSign } from "react-icons/fi";

const HeroSection = () => {
  const { language, isRTL } = useLanguage();
  const [searchLocation, setSearchLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState<"buy" | "rent">("buy");
  const [priceRange, setPriceRange] = useState([0, 10000000]);

  const translations = {
    en: {
      title: "Find Your Perfect Home",
      subtitle: "Buy & Rent Properties Across Lebanon",
      searchPlaceholder: "Search by location...",
      propertyType: "Property Type",
      listingType: "I want to",
      buy: "Buy",
      rent: "Rent",
      priceRange: "Price Range",
      searchButton: "Search Properties",
      allTypes: "All Types",
      apartment: "Apartment",
      villa: "Villa",
      penthouse: "Penthouse",
      commercial: "Commercial",
    },
    ar: {
      title: "ابحث عن عقارك المثالي",
      subtitle: "شراء وإيجار العقارات في لبنان",
      searchPlaceholder: "ابحث حسب الموقع...",
      propertyType: "نوع العقار",
      listingType: "أريد",
      buy: "شراء",
      rent: "إيجار",
      priceRange: "نطاق السعر",
      searchButton: "ابحث عن العقارات",
      allTypes: "جميع الأنواع",
      apartment: "شقة",
      villa: "فيلا",
      penthouse: "بنتهاوس",
      commercial: "تجاري",
    },
    fr: {
      title: "Trouvez Votre Propriété Parfaite",
      subtitle: "Acheter et Louer des Propriétés au Liban",
      searchPlaceholder: "Rechercher par emplacement...",
      propertyType: "Type de Propriété",
      listingType: "Je veux",
      buy: "Acheter",
      rent: "Louer",
      priceRange: "Gamme de Prix",
      searchButton: "Rechercher des Propriétés",
      allTypes: "Tous les Types",
      apartment: "Appartement",
      villa: "Villa",
      penthouse: "Penthouse",
      commercial: "Commercial",
    },
  };

  const t = translations[language];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
          onError={(e) => {
            // Fallback to background image if video fails to load
            const target = e.target as HTMLVideoElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.style.backgroundImage = 'url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)';
              parent.style.backgroundSize = 'cover';
              parent.style.backgroundPosition = 'center';
            }
          }}
        >
          <source src="/videos/luxury-skyline.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 w-full h-full flex items-center">
        <div className="max-w-4xl text-left">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-white mb-6 leading-tight">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white font-sans font-normal">
            {t.subtitle}
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-8 border border-white/20">
          {/* Buy/Rent Toggle */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-sm font-medium text-gray-700 mr-2">{t.listingType}:</span>
            <button
              onClick={() => setListingType("buy")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                listingType === "buy"
                  ? "bg-estate-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.buy}
            </button>
            <button
              onClick={() => setListingType("rent")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                listingType === "rent"
                  ? "bg-estate-secondary text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.rent}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Location Search */}
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            {/* Property Type */}
            <div className="relative">
              <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold appearance-none bg-white ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <option value="">{t.allTypes}</option>
                <option value="apartment">{t.apartment}</option>
                <option value="villa">{t.villa}</option>
                <option value="penthouse">{t.penthouse}</option>
                <option value="commercial">{t.commercial}</option>
              </select>
            </div>

            {/* Price Range Display */}
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <div className="pl-10 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50">
                <span className="text-sm text-gray-600">
                  {t.priceRange}: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Price Slider */}
          <div className="mb-6">
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-luxury-gold"
            />
          </div>

          {/* Search Button */}
          <button className={`w-full py-4 rounded-lg font-semibold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
            listingType === "buy" 
              ? "bg-estate-primary text-white hover:bg-blue-700" 
              : "bg-estate-secondary text-white hover:bg-green-600"
          }`}>
            <FiSearch className="w-5 h-5" />
            {t.searchButton}
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

