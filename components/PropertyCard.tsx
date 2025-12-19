"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiMapPin, FiHome, FiMaximize2, FiDroplet } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

interface PropertyCardProps {
  property: any;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { currency, convertPrice } = useCurrency();
  const { language } = useLanguage();

  const price = convertPrice(property.priceUSD);
  const formattedPrice = currency === "USD" 
    ? `$${price.toLocaleString()}`
    : `${price.toLocaleString()} LBP`;

  const title = language === "ar" ? property.titleAr || property.title 
    : language === "fr" ? property.titleFr || property.title 
    : property.title;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/property/${property.slug}`}>
        <div className="relative h-64">
          <Image
            src={property.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"}
            alt={title}
            fill
            className="object-cover"
          />
          {property.featured && (
            <div className="absolute top-4 left-4 bg-luxury-gold text-white px-3 py-1 rounded-md text-sm font-semibold">
              Featured
            </div>
          )}
          {property.seaView && (
            <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-semibold flex items-center gap-1">
              <FiDroplet className="w-4 h-4" />
              Sea View
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/property/${property.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-luxury-gold transition-colors">
            {title}
          </h3>
        </Link>

        <div className="flex items-center text-gray-600 mb-4">
          <FiMapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{property.city}{property.neighborhood ? `, ${property.neighborhood}` : ""}</span>
        </div>

        <div className="flex items-center gap-4 mb-4 text-gray-600">
          <div className="flex items-center gap-1">
            <FiHome className="w-4 h-4" />
            <span className="text-sm">{property.bedrooms} {language === "ar" ? "غرف" : language === "fr" ? "chambres" : "beds"}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiMaximize2 className="w-4 h-4" />
            <span className="text-sm">{property.bathrooms} {language === "ar" ? "حمامات" : language === "fr" ? "salles de bain" : "baths"}</span>
          </div>
          <div className="text-sm">
            {property.areaSqm} m²
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-2xl font-bold text-luxury-gold">{formattedPrice}</p>
          </div>
          {property.agent?.whatsapp && (
            <a
              href={`https://wa.me/${property.agent.whatsapp}?text=Hello, I'm interested in ${title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

