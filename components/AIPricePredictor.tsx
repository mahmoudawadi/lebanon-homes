"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiTrendingUp, FiCalculator } from "react-icons/fi";

const AIPricePredictor = ({ property }: { property: any }) => {
  const { language } = useLanguage();
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      title: "AI Price Prediction",
      subtitle: "Estimated market value based on similar properties",
      predict: "Predict Price",
      estimated: "Estimated Value",
      confidence: "Confidence",
      basedOn: "Based on",
      similar: "similar properties",
    },
    ar: {
      title: "توقع سعر بالذكاء الاصطناعي",
      subtitle: "القيمة السوقية المقدرة بناءً على عقارات مماثلة",
      predict: "توقع السعر",
      estimated: "القيمة المقدرة",
      confidence: "الثقة",
      basedOn: "بناءً على",
      similar: "عقارات مماثلة",
    },
    fr: {
      title: "Prédiction de Prix IA",
      subtitle: "Valeur marchande estimée basée sur des propriétés similaires",
      predict: "Prédire le Prix",
      estimated: "Valeur Estimée",
      confidence: "Confiance",
      basedOn: "Basé sur",
      similar: "propriétés similaires",
    },
  };

  const t = translations[language];

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/predict-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: property.city,
          propertyType: property.propertyType,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          areaSqm: property.areaSqm,
          listingType: property.listingType,
        }),
      });

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!property) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center gap-2 mb-4">
        <FiTrendingUp className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold text-luxury-dark">{t.title}</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">{t.subtitle}</p>

      {!prediction ? (
        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <FiCalculator className="w-5 h-5" />
          {loading ? "Calculating..." : t.predict}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">{t.estimated}</div>
            <div className="text-3xl font-bold text-purple-600">
              ${prediction.estimatedPrice?.toLocaleString()}
            </div>
            {prediction.confidence && (
              <div className="text-sm text-gray-500 mt-2">
                {t.confidence}: {prediction.confidence}%
              </div>
            )}
          </div>
          {prediction.comparisonCount && (
            <div className="text-sm text-gray-600">
              {t.basedOn} {prediction.comparisonCount} {t.similar}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIPricePredictor;


