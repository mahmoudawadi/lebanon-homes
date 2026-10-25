"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCurrency } from "@/contexts/CurrencyContext";
import { LuMapPin } from "react-icons/lu";
import { FALLBACK_IMAGE, displayPriceUSD, formatMoney, parseImages } from "@/lib/format";

// Bounding box around Lebanon, used when a property has no coordinates
const LEBANON_BBOX = "35.10,33.05,36.62,34.69";

const mapUrl = (property?: any) => {
  if (property?.latitude && property?.longitude) {
    const { latitude: lat, longitude: lng } = property;
    const bbox = [lng - 0.02, lat - 0.015, lng + 0.02, lat + 0.015].join(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  }
  return `https://www.openstreetmap.org/export/embed.html?bbox=${LEBANON_BBOX}&layer=mapnik`;
};

const PropertyMapView = ({ properties, loading }: { properties: any[]; loading: boolean }) => {
  const { currency, convertPrice } = useCurrency();
  const [selected, setSelected] = useState<any>(null);

  if (loading) {
    return <div className="skeleton h-[600px]" />;
  }

  return (
    <div className="card grid overflow-hidden md:h-[600px] md:grid-cols-[280px_1fr]">
      <ul className="max-h-72 divide-y divide-line overflow-y-auto md:max-h-none">
        {properties.map((property) => (
          <li key={property.id}>
            <button
              onClick={() => setSelected(property)}
              className={`flex w-full gap-3 p-3 text-start transition ${
                selected?.id === property.id ? "bg-brass-50" : "hover:bg-ivory"
              }`}
            >
              <img
                src={parseImages(property.images)[0] || FALLBACK_IMAGE}
                alt=""
                className="h-16 w-20 shrink-0 rounded-lg object-cover"
              />
              <span className="min-w-0">
                <span className="block font-serif font-semibold">
                  {formatMoney(convertPrice(displayPriceUSD(property)), currency)}
                </span>
                <span className="block truncate text-sm text-ink-600">{property.title}</span>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <LuMapPin className="h-3 w-3" /> {property.city}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="relative min-h-[360px] bg-ivory-200">
        <iframe
          key={selected?.id || "all"}
          title="Property map"
          src={mapUrl(selected)}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
        />
        {selected && (
          <Link
            href={`/property/${selected.slug}`}
            className="btn-primary absolute bottom-4 start-4 shadow-lift"
          >
            {selected.title}
          </Link>
        )}
      </div>
    </div>
  );
};

export default PropertyMapView;
