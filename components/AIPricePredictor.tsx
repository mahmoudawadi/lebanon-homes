"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { LuSparkles, LuCalculator } from "react-icons/lu";
import { formatMoney } from "@/lib/format";

const translations = {
  en: {
    title: "AI Price Prediction",
    subtitle: "Estimated market value based on similar properties",
    predict: "Predict Price",
    calculating: "Calculating…",
    estimated: "Estimated Value",
    range: "Likely range",
    confidence: "Confidence",
    basedOn: "Based on",
    similar: "similar properties",
    notEnough: "Not enough comparable listings yet to estimate this property.",
  },
  ar: {
    title: "توقع سعر بالذكاء الاصطناعي",
    subtitle: "القيمة السوقية المقدرة بناءً على عقارات مماثلة",
    predict: "توقع السعر",
    calculating: "جارٍ الحساب…",
    estimated: "القيمة المقدرة",
    range: "النطاق المرجح",
    confidence: "الثقة",
    basedOn: "بناءً على",
    similar: "عقارات مماثلة",
    notEnough: "لا توجد عقارات مماثلة كافية لتقدير هذا العقار بعد.",
  },
  fr: {
    title: "Prédiction de Prix IA",
    subtitle: "Valeur marchande estimée basée sur des propriétés similaires",
    predict: "Prédire le Prix",
    calculating: "Calcul…",
    estimated: "Valeur Estimée",
    range: "Fourchette probable",
    confidence: "Confiance",
    basedOn: "Basé sur",
    similar: "propriétés similaires",
    notEnough: "Pas assez de biens comparables pour estimer cette propriété.",
  },
};

const AIPricePredictor = ({ property }: { property: any }) => {
  const { language } = useLanguage();
  const { currency, convertPrice } = useCurrency();
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
          excludeId: property.id,
        }),
      });
      setPrediction(await response.json());
    } catch (error) {
      console.error("Prediction error:", error);
      setPrediction({ estimatedPrice: null });
    } finally {
      setLoading(false);
    }
  };

  if (!property) return null;

  const money = (usd: number) => formatMoney(convertPrice(usd), currency);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brass-50 text-brass-600">
          <LuSparkles className="h-4 w-4" />
        </span>
        <h3 className="text-lg font-semibold">{t.title}</h3>
      </div>
      <p className="mt-2 text-sm text-muted">{t.subtitle}</p>

      {!prediction ? (
        <button onClick={handlePredict} disabled={loading} className="btn-primary mt-5 w-full">
          <LuCalculator className="h-4 w-4" />
          {loading ? t.calculating : t.predict}
        </button>
      ) : prediction.estimatedPrice ? (
        <div className="mt-5 rounded-xl bg-ivory p-5">
          <div className="text-xs uppercase tracking-wider text-muted">{t.estimated}</div>
          <div className="mt-1 font-serif text-3xl font-semibold">{money(prediction.estimatedPrice)}</div>
          {prediction.priceRange && (
            <div className="mt-1 text-sm text-ink-600">
              {t.range}: {money(prediction.priceRange.min)} – {money(prediction.priceRange.max)}
            </div>
          )}
          {prediction.confidence > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted">
                <span>{t.confidence}</span>
                <span>{prediction.confidence}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-brass" style={{ width: `${prediction.confidence}%` }} />
              </div>
            </div>
          )}
          {prediction.comparisonCount && (
            <div className="mt-3 text-xs text-muted">
              {t.basedOn} {prediction.comparisonCount} {t.similar}
            </div>
          )}
        </div>
      ) : (
        <p className="mt-5 rounded-xl bg-ivory p-4 text-sm text-ink-600">{t.notEnough}</p>
      )}
    </div>
  );
};

export default AIPricePredictor;
