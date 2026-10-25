// Property search filters shared by the listings API and the AI assistant

export interface PropertyFilters {
  city?: string | null;
  propertyType?: string | null;
  listingType?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minSize?: number | null;
  maxSize?: number | null;
  bedrooms?: number | null;
  seaView?: boolean | null;
  hasSolar?: boolean | null;
  hasGenerator?: boolean | null;
  featured?: boolean | null;
  status?: string | null;
}

export function buildPropertyWhere(filters: PropertyFilters) {
  const where: any = {
    status: filters.status || 'available',
  };

  if (filters.city) {
    where.city = { contains: filters.city };
  }

  if (filters.propertyType) {
    where.propertyType = filters.propertyType;
  }

  if (filters.minPrice || filters.maxPrice) {
    // Rentals are priced per month, so filter on the rent price instead
    const priceField = filters.listingType === 'rent' ? 'rentPriceUSD' : 'priceUSD';
    where[priceField] = {};
    if (filters.minPrice) where[priceField].gte = filters.minPrice;
    if (filters.maxPrice) where[priceField].lte = filters.maxPrice;
  }

  if (filters.bedrooms) {
    // 4 means 4 or more
    where.bedrooms = filters.bedrooms >= 4 ? { gte: filters.bedrooms } : filters.bedrooms;
  }

  if (filters.minSize || filters.maxSize) {
    where.areaSqm = {};
    if (filters.minSize) where.areaSqm.gte = filters.minSize;
    if (filters.maxSize) where.areaSqm.lte = filters.maxSize;
  }

  if (filters.seaView) where.seaView = true;
  if (filters.hasSolar) where.hasSolar = true;
  if (filters.hasGenerator) where.hasGenerator = true;
  if (filters.featured) where.featured = true;

  if (filters.listingType) {
    // Listings marked "both" are available for sale and for rent
    where.listingType =
      filters.listingType === 'both' ? 'both' : { in: [filters.listingType, 'both'] };
  }

  return where;
}
