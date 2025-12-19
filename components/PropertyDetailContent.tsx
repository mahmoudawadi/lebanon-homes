"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiHome, FiDroplet, FiMaximize2, FiSun, FiZap, FiWind } from "react-icons/fi";

const PropertyDetailContent = ({ property }: any) => {
  const { language } = useLanguage();

  const description =
    property[`description${language === "ar" ? "Ar" : language === "fr" ? "Fr" : ""}`] ||
    property.description;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-luxury-dark mb-4">
          Description
        </h2>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>

      <div>
        <h2 className="text-3xl font-serif font-bold text-luxury-dark mb-4">
          Property Details
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <FiHome className="w-6 h-6 text-luxury-gold mb-2" />
            <div className="text-sm text-gray-600">Bedrooms</div>
            <div className="text-xl font-semibold">{property.bedrooms}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <FiDroplet className="w-6 h-6 text-luxury-gold mb-2" />
            <div className="text-sm text-gray-600">Bathrooms</div>
            <div className="text-xl font-semibold">{property.bathrooms}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <FiMaximize2 className="w-6 h-6 text-luxury-gold mb-2" />
            <div className="text-sm text-gray-600">Area</div>
            <div className="text-xl font-semibold">{property.areaSqm} m²</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <FiHome className="w-6 h-6 text-luxury-gold mb-2" />
            <div className="text-sm text-gray-600">Type</div>
            <div className="text-xl font-semibold capitalize">{property.propertyType}</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-serif font-bold text-luxury-dark mb-4">
          Features
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {property.seaView && (
            <div className="flex items-center gap-2 text-gray-700">
              <FiSun className="w-5 h-5 text-luxury-gold" />
              <span>Sea View</span>
            </div>
          )}
          {property.hasSolar && (
            <div className="flex items-center gap-2 text-gray-700">
              <FiSun className="w-5 h-5 text-luxury-gold" />
              <span>Solar</span>
            </div>
          )}
          {property.hasGenerator && (
            <div className="flex items-center gap-2 text-gray-700">
              <FiZap className="w-5 h-5 text-luxury-gold" />
              <span>Generator</span>
            </div>
          )}
          {property.hasAC && (
            <div className="flex items-center gap-2 text-gray-700">
              <FiWind className="w-5 h-5 text-luxury-gold" />
              <span>Air Conditioning</span>
            </div>
          )}
          {property.hasParking && (
            <div className="flex items-center gap-2 text-gray-700">
              <FiHome className="w-5 h-5 text-luxury-gold" />
              <span>Parking</span>
            </div>
          )}
          {property.furnished && (
            <div className="flex items-center gap-2 text-gray-700">
              <FiHome className="w-5 h-5 text-luxury-gold" />
              <span>Furnished</span>
            </div>
          )}
        </div>
      </div>

      {property.rentalYield && (
        <div className="bg-luxury-gold/10 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-luxury-dark mb-2">
            Investment Data
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Rental Yield</div>
              <div className="text-2xl font-bold text-luxury-gold">
                {property.rentalYield}%
              </div>
            </div>
            {property.capitalAppreciation && (
              <div>
                <div className="text-sm text-gray-600">Capital Appreciation</div>
                <div className="text-2xl font-bold text-luxury-gold">
                  {property.capitalAppreciation}%
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailContent;


