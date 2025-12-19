"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiStar } from "react-icons/fi";

const Testimonials = () => {
  const { language } = useLanguage();

  const testimonials = {
    en: [
      {
        name: "Sarah Johnson",
        role: "Property Buyer",
        text: "LuxEstate made finding our dream home effortless. Their expertise and attention to detail is unmatched.",
        rating: 5,
      },
      {
        name: "Michael Chen",
        role: "Investor",
        text: "The team's knowledge of the Lebanese market helped me make the perfect investment decision.",
        rating: 5,
      },
      {
        name: "Emma Williams",
        role: "Property Seller",
        text: "Professional service from start to finish. They sold my property within weeks at the best price.",
        rating: 5,
      },
    ],
    ar: [
      {
        name: "سارة جونسون",
        role: "مشترية عقار",
        text: "جعل LuxEstate العثور على منزل أحلامنا أمرًا سهلاً. خبرتهم والاهتمام بالتفاصيل لا مثيل له.",
        rating: 5,
      },
      {
        name: "مايكل تشن",
        role: "مستثمر",
        text: "ساعدت معرفة الفريق بسوق لبنان في اتخاذ قرار الاستثمار المثالي.",
        rating: 5,
      },
      {
        name: "إيما ويليامز",
        role: "بائعة عقار",
        text: "خدمة احترافية من البداية إلى النهاية. باعوا عقاري في غضون أسابيع بأفضل سعر.",
        rating: 5,
      },
    ],
    fr: [
      {
        name: "Sarah Johnson",
        role: "Acheteuse",
        text: "LuxEstate a rendu la recherche de notre maison de rêve sans effort. Leur expertise et leur attention aux détails sont inégalées.",
        rating: 5,
      },
      {
        name: "Michael Chen",
        role: "Investisseur",
        text: "La connaissance de l'équipe du marché libanais m'a aidé à prendre la décision d'investissement parfaite.",
        rating: 5,
      },
      {
        name: "Emma Williams",
        role: "Vendeuse",
        text: "Service professionnel du début à la fin. Ils ont vendu ma propriété en quelques semaines au meilleur prix.",
        rating: 5,
      },
    ],
  };

  const t = testimonials[language];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-estate-dark mb-4">
            {language === "en" ? "What Our Clients Say" : language === "ar" ? "ماذا يقول عملاؤنا" : "Ce Que Disent Nos Clients"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
              <div>
                <div className="font-semibold text-estate-dark">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

