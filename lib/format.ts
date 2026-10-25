// Shared helpers for displaying property data on the client

export type Currency = "USD" | "LBP";

// Images are stored as a JSON string in the database; the API usually parses
// them, but be defensive in case a raw value slips through.
export function parseImages(images: unknown): string[] {
  if (Array.isArray(images)) return images as string[];
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

// Rentals show the monthly rent; everything else shows the sale price
export function displayPriceUSD(property: any): number {
  if (property?.listingType === "rent") {
    return property.rentPriceUSD || property.priceUSD || 0;
  }
  return property?.priceUSD || property?.rentPriceUSD || 0;
}

export function formatMoney(amount: number, currency: Currency): string {
  const rounded = Math.round(amount).toLocaleString("en-US");
  return currency === "USD" ? `$${rounded}` : `${rounded} LBP`;
}

export function localizedField(item: any, field: string, language: string): string {
  const suffix = language === "ar" ? "Ar" : language === "fr" ? "Fr" : "";
  return (suffix && item?.[`${field}${suffix}`]) || item?.[field] || "";
}

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80";
