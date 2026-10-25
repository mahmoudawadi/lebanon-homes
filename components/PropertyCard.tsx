"use client";

import React from "react";
import Link from "next/link";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuMapPin, LuBedDouble, LuBath, LuRuler, LuWaves, LuStar, LuArrowUpRight } from "react-icons/lu";
import { FALLBACK_IMAGE, displayPriceUSD, formatMoney, localizedField, parseImages } from "@/lib/format";

const labels = {
  en: { sale: "For Sale", rent: "For Rent", both: "Sale / Rent", featured: "Featured", seaView: "Sea View", month: "/mo", beds: "Beds", baths: "Baths" },
  ar: { sale: "للبيع", rent: "للإيجار", both: "بيع / إيجار", featured: "مميز", seaView: "إطلالة بحرية", month: "/شهر", beds: "غرف", baths: "حمامات" },
  fr: { sale: "À Vendre", rent: "À Louer", both: "Vente / Location", featured: "En Vedette", seaView: "Vue Mer", month: "/mois", beds: "Ch.", baths: "SdB" },
};

interface PropertyCardProps {
  property: any;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { currency, convertPrice } = useCurrency();
  const { language } = useLanguage();
  const t = labels[language];

  const images = parseImages(property.images);
  const title = localizedField(property, "title", language) || "Property";
  const listingType: "sale" | "rent" | "both" = property.listingType || "sale";
  const price = formatMoney(convertPrice(displayPriceUSD(property)), currency);

  return (
    <Link
      href={`/property/${property.slug || property.id}`}
      className="group flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-brass/40 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ivory-200">
        <img
          src={images[0] || FALLBACK_IMAGE}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent opacity-80" />

        <div className="absolute start-4 top-4 flex flex-wrap gap-2">
          <span className={`chip ${listingType === "rent" ? "bg-emerald-700 text-white" : "bg-white text-ink"}`}>
            {t[listingType]}
          </span>
          {property.featured && (
            <span className="chip bg-brass text-white">
              <LuStar className="h-3 w-3 fill-current" />
              {t.featured}
            </span>
          )}
        </div>

        <span className="absolute end-4 top-4 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white text-ink opacity-0 shadow-soft transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <LuArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
        </span>

        {property.seaView && (
          <span className="chip absolute bottom-4 start-4 bg-white/15 text-white ring-1 ring-white/30 backdrop-blur">
            <LuWaves className="h-3.5 w-3.5" />
            {t.seaView}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline gap-1">
          <span className="font-serif text-2xl font-semibold text-ink">{price}</span>
          {listingType === "rent" && <span className="text-sm text-muted">{t.month}</span>}
        </div>

        <h3 className="mt-1.5 line-clamp-1 text-base font-semibold text-ink transition-colors group-hover:text-brass-600">
          {title}
        </h3>

        <p className="mb-4 mt-1 flex items-center gap-1.5 text-sm text-muted">
          <LuMapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {property.city}
            {property.neighborhood ? `, ${property.neighborhood}` : ""}
          </span>
        </p>

        <div className="mt-auto flex items-center gap-4 border-t border-line pt-4 text-sm text-ink-600">
          <span className="flex items-center gap-1.5">
            <LuBedDouble className="h-4 w-4 text-brass" />
            {property.bedrooms ?? 0} <span className="text-muted">{t.beds}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <LuBath className="h-4 w-4 text-brass" />
            {property.bathrooms ?? 0} <span className="text-muted">{t.baths}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <LuRuler className="h-4 w-4 text-brass" />
            {property.areaSqm ?? 0} m²
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
