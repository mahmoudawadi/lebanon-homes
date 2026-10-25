"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuStar, LuQuote } from "react-icons/lu";
import SectionHeading from "./SectionHeading";
import { Reveal } from "./Motion";

const testimonials = {
  en: [
    { name: "Sarah Johnson", role: "Property Buyer", text: "LebEstate made finding our dream home effortless. Their expertise and attention to detail is unmatched.", rating: 5 },
    { name: "Michael Chen", role: "Investor", text: "The team's knowledge of the Lebanese market helped me make the perfect investment decision.", rating: 5 },
    { name: "Emma Williams", role: "Property Seller", text: "Professional service from start to finish. They sold my property within weeks at the best price.", rating: 5 },
  ],
  ar: [
    { name: "سارة جونسون", role: "مشترية عقار", text: "جعل LebEstate العثور على منزل أحلامنا أمرًا سهلاً. خبرتهم والاهتمام بالتفاصيل لا مثيل له.", rating: 5 },
    { name: "مايكل تشن", role: "مستثمر", text: "ساعدت معرفة الفريق بسوق لبنان في اتخاذ قرار الاستثمار المثالي.", rating: 5 },
    { name: "إيما ويليامز", role: "بائعة عقار", text: "خدمة احترافية من البداية إلى النهاية. باعوا عقاري في غضون أسابيع بأفضل سعر.", rating: 5 },
  ],
  fr: [
    { name: "Sarah Johnson", role: "Acheteuse", text: "LebEstate a rendu la recherche de notre maison de rêve sans effort. Leur expertise et leur attention aux détails sont inégalées.", rating: 5 },
    { name: "Michael Chen", role: "Investisseur", text: "La connaissance de l'équipe du marché libanais m'a aidé à prendre la décision d'investissement parfaite.", rating: 5 },
    { name: "Emma Williams", role: "Vendeuse", text: "Service professionnel du début à la fin. Ils ont vendu ma propriété en quelques semaines au meilleur prix.", rating: 5 },
  ],
};

const headings = {
  en: { eyebrow: "Testimonials", title: "What Our Clients Say" },
  ar: { eyebrow: "آراء العملاء", title: "ماذا يقول عملاؤنا" },
  fr: { eyebrow: "Témoignages", title: "Ce Que Disent Nos Clients" },
};

const Testimonials = () => {
  const { language } = useLanguage();
  const items = testimonials[language];
  const h = headings[language];

  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading eyebrow={h.eyebrow} title={h.title} align="center" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((testimonial, i) => (
            <Reveal key={testimonial.name} delay={i * 0.1} className="flex">
            <figure className="card relative flex w-full flex-col rounded-3xl p-8 transition duration-500 hover:-translate-y-1.5 hover:shadow-lift">
              <LuQuote className="absolute end-8 top-8 h-10 w-10 text-brass-100" />
              <div className="flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <LuStar key={i} className="h-4 w-4 fill-brass text-brass" />
                ))}
              </div>
              <blockquote className="mt-6 flex-1 font-serif text-lg leading-relaxed text-ink">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-ink font-serif text-lg text-white">
                  {testimonial.name[0]}
                </span>
                <span>
                  <span className="block font-semibold">{testimonial.name}</span>
                  <span className="block text-sm text-muted">{testimonial.role}</span>
                </span>
              </figcaption>
            </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
