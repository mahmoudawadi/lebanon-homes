"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { FiHome, FiDroplet, FiMaximize2, FiMapPin } from "react-icons/fi";

const PropertyGrid = ({ properties, loading }: any) => {
  const { language } = useLanguage();
  const { currency, convertPrice } = useCurrency();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md animate-pulse h-96" />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-600 text-lg">No properties found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property: any) => (
        <Link
          key={property.id}
          href={`/property/${property.slug}`}
          className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all card-hover border border-gray-100"
        >
          <div className="relative h-64 overflow-hidden">
            {(() => {
              let images = [];
              try {
                if (typeof property.images === 'string') {
                  images = JSON.parse(property.images);
                } else if (Array.isArray(property.images)) {
                  images = property.images;
                }
              } catch (e) {
                images = [];
              }
              const imageUrl = images && images.length > 0 ? images[0] : null;
              
              return imageUrl ? (
                <img
                  src={imageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FiMaximize2 className="w-12 h-12 text-gray-400" />
                </div>
              );
            })()}
            {property.listingType && (
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
                property.listingType === "rent" 
                  ? "bg-green-500 text-white" 
                  : property.listingType === "both"
                  ? "bg-purple-500 text-white"
                  : "bg-blue-500 text-white"
              }`}>
                {property.listingType === "rent" ? "For Rent" : property.listingType === "both" ? "Buy/Rent" : "For Sale"}
              </div>
            )}
            {property.seaView && (
              <div className={`absolute ${property.listingType ? 'top-16' : 'top-4'} left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                Sea View
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <FiMapPin className="w-4 h-4" />
              <span>{property.city}</span>
            </div>
            <h3 className="text-xl font-semibold text-luxury-dark mb-2 group-hover:text-luxury-gold transition-colors">
              {property[`title${language === "ar" ? "Ar" : language === "fr" ? "Fr" : ""}`] || property.title}
            </h3>
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <FiHome className="w-4 h-4" />
                {property.bedrooms}
              </span>
              <span className="flex items-center gap-1">
                <FiDroplet className="w-4 h-4" />
                {property.bathrooms}
              </span>
              <span className="flex items-center gap-1">
                <FiMaximize2 className="w-4 h-4" />
                {property.areaSqm}m²
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
      ))}
    </div>
  );
};

export default PropertyGrid;

