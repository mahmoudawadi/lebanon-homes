"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { FiHome, FiDroplet, FiMaximize2, FiMapPin, FiStar } from "react-icons/fi";

const FeaturedListings = () => {
  const { language } = useLanguage();
  const { currency, convertPrice } = useCurrency();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/properties?featured=true&limit=5")
      .then((res) => res.json())
      .then((data) => {
        // Parse JSON strings for images safely
        const parsedProperties = (data.properties || []).map((p: any) => {
          let images = [];
          try {
            if (typeof p.images === 'string') {
              images = JSON.parse(p.images);
            } else if (Array.isArray(p.images)) {
              images = p.images;
            }
          } catch (e) {
            images = [];
          }
          return {
            ...p,
            images: images || [],
          };
        });
        setProperties(parsedProperties);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setLoading(false);
      });
  }, []);

  const translations = {
    en: { title: "Featured Properties", subtitle: "Handpicked properties for sale and rent", viewAll: "View All Properties" },
    ar: { title: "العقارات المميزة", subtitle: "عقارات مختارة للبيع والإيجار", viewAll: "عرض جميع العقارات" },
    fr: { title: "Propriétés en Vedette", subtitle: "Propriétés sélectionnées à vendre et à louer", viewAll: "Voir Toutes les Propriétés" },
  };

  const t = translations[language] || translations.en;

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center mb-12">
            {t.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md animate-pulse h-96" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const validProperties = properties.filter((property) => property && property.id).slice(0, 3);

  if (validProperties.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-luxury-dark mb-4">
              {t.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>
          <div className="text-center text-gray-500">
            No featured properties available at the moment.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-luxury-dark mb-4">
            {t.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {validProperties.map((property) => {
            const imageUrl = Array.isArray(property.images) && property.images.length > 0 
              ? property.images[0] 
              : null;
            
            return (
              <Link
                key={property.id}
                href={`/property/${property.slug || property.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={property.title || "Property"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FiMaximize2 className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {property.featured && (
                    <div className="absolute top-4 left-4 bg-luxury-gold text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <FiStar className="w-4 h-4" />
                      Featured
                    </div>
                  )}
                  {property.listingType && property.listingType !== "sale" && (
                    <div className={`absolute top-4 ${property.seaView ? 'right-16' : 'right-4'} px-3 py-1 rounded-full text-sm font-semibold ${
                      property.listingType === "rent" 
                        ? "bg-green-500 text-white" 
                        : "bg-purple-500 text-white"
                    }`}>
                      {property.listingType === "rent" ? "For Rent" : "Buy/Rent"}
                    </div>
                  )}
                  {property.listingType === "sale" && (
                    <div className={`absolute top-4 ${property.seaView ? 'right-16' : 'right-4'} px-3 py-1 rounded-full text-sm font-semibold bg-blue-500 text-white`}>
                      For Sale
                    </div>
                  )}
                  {property.seaView && (
                    <div className={`absolute ${property.listingType && property.listingType !== "sale" ? 'top-16' : 'top-4'} right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                      Sea View
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <FiMapPin className="w-4 h-4" />
                    <span>{property.city || "Unknown"}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-luxury-dark mb-2 group-hover:text-estate-primary transition-colors">
                    {property[`title${language === "ar" ? "Ar" : language === "fr" ? "Fr" : ""}`] || property.title || "Property"}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <FiHome className="w-4 h-4" />
                      {property.bedrooms || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiDroplet className="w-4 h-4" />
                      {property.bathrooms || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMaximize2 className="w-4 h-4" />
                      {property.areaSqm || 0}m²
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-luxury-gold">
                    {currency === "USD" ? "$" : ""}
                    {convertPrice(property.priceUSD || property.rentPriceUSD || 0).toLocaleString()}
                    {currency === "LBP" ? " LBP" : ""}
                    {property.listingType === "rent" && (
                      <span className="text-sm text-gray-500 font-normal">/month</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/properties"
            className="inline-block bg-luxury-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-md"
          >
            {t.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
