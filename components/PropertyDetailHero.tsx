"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuChevronLeft, LuChevronRight, LuHeart, LuMapPin, LuShare2, LuImages } from "react-icons/lu";
import { FALLBACK_IMAGE, displayPriceUSD, formatMoney, localizedField, parseImages } from "@/lib/format";

const labels = {
  en: { sale: "For Sale", rent: "For Rent", both: "Sale / Rent", month: "/ month", back: "All properties", photos: "photos", copied: "Link copied" },
  ar: { sale: "للبيع", rent: "للإيجار", both: "بيع / إيجار", month: "/ شهر", back: "كل العقارات", photos: "صور", copied: "تم نسخ الرابط" },
  fr: { sale: "À Vendre", rent: "À Louer", both: "Vente / Location", month: "/ mois", back: "Toutes les propriétés", photos: "photos", copied: "Lien copié" },
};

const PropertyDetailHero = ({ property }: { property: any }) => {
  const { currency, convertPrice } = useCurrency();
  const { language } = useLanguage();
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = labels[language];
  const images = parseImages(property.images);
  const gallery = images.length > 0 ? images : [FALLBACK_IMAGE];
  const listingType: "sale" | "rent" | "both" = property.listingType || "sale";
  const title = localizedField(property, "title", language);

  const go = (delta: number) => setCurrentImage((prev) => (prev + delta + gallery.length) % gallery.length);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (e.g. insecure context); ignore
    }
  };

  return (
    <section className="container-x pt-8">
      <Link href="/properties" className="inline-flex items-center gap-1 text-sm text-muted transition hover:text-ink">
        <LuChevronLeft className="h-4 w-4 rtl:rotate-180" />
        {t.back}
      </Link>

      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`chip ${listingType === "rent" ? "bg-emerald-700 text-white" : "bg-ink text-white"}`}>{t[listingType]}</span>
            <span className="chip bg-white capitalize text-ink-600 ring-1 ring-line">{property.propertyType}</span>
          </div>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl font-semibold leading-tight md:text-5xl">{title}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-muted">
            <LuMapPin className="h-4 w-4 text-brass" />
            {[property.neighborhood, property.city, property.country].filter(Boolean).join(", ")}
          </p>
        </div>
        <div className="md:text-end">
          <div className="font-serif text-4xl font-semibold text-ink">
            {formatMoney(convertPrice(displayPriceUSD(property)), currency)}
            {listingType === "rent" && <span className="ms-1 font-sans text-base font-normal text-muted">{t.month}</span>}
          </div>
          <div className="mt-3 flex gap-2 md:justify-end">
            <button onClick={share} className="btn-outline !px-4 !py-2" aria-label="Share">
              <LuShare2 className="h-4 w-4" />
              {copied ? t.copied : null}
            </button>
            <button onClick={() => setIsFavorite(!isFavorite)} className="btn-outline !px-4 !py-2" aria-label="Save" aria-pressed={isFavorite}>
              <LuHeart className={`h-4 w-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-4 md:grid-rows-2">
        <div
          className={`group relative aspect-[16/10] overflow-hidden rounded-2xl bg-ivory-200 md:row-span-2 md:aspect-auto md:h-[520px] ${
            gallery.length > 1 ? "md:col-span-3" : "md:col-span-4"
          }`}
        >
          <img src={gallery[currentImage]} alt={title} className="h-full w-full object-cover" />
          {gallery.length > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="absolute start-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-soft transition group-hover:opacity-100"
              >
                <LuChevronLeft className="h-5 w-5 rtl:rotate-180" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next image"
                className="absolute end-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-soft transition group-hover:opacity-100"
              >
                <LuChevronRight className="h-5 w-5 rtl:rotate-180" />
              </button>
            </>
          )}
          <span className="chip absolute bottom-4 end-4 bg-ink/70 text-white backdrop-blur">
            <LuImages className="h-3.5 w-3.5" />
            {currentImage + 1} / {gallery.length} {t.photos}
          </span>
        </div>

        {[0, 1].map((i) => {
          // Thumbnails show the next images after the current one
          const index = (currentImage + i + 1) % gallery.length;
          return gallery.length > 1 ? (
            <button
              key={i}
              onClick={() => setCurrentImage(index)}
              className="hidden overflow-hidden rounded-2xl bg-ivory-200 md:block"
            >
              <img src={gallery[index]} alt="" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
            </button>
          ) : null;
        })}
      </div>
    </section>
  );
};

export default PropertyDetailHero;
