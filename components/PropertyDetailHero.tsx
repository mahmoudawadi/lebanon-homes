"use client";

import React, { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { FiChevronLeft, FiChevronRight, FiHeart } from "react-icons/fi";

const PropertyDetailHero = ({ property }: any) => {
  const { currency, convertPrice } = useCurrency();
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const images = property.images || [];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <div className="relative h-[600px] overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[currentImage]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full transition-all"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full transition-all"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl font-serif font-bold mb-2">{property.title}</h1>
            <p className="text-xl mb-4">{property.city}, {property.country}</p>
            <div className="text-3xl font-bold text-luxury-gold">
              {currency === "USD" ? "$" : ""}
              {convertPrice(property.priceUSD).toLocaleString()}
              {currency === "LBP" ? " LBP" : ""}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full transition-all"
        >
          <FiHeart
            className={`w-6 h-6 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-700"}`}
          />
        </button>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImage ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyDetailHero;


