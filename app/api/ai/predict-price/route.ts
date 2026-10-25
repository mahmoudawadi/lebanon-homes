import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, propertyType, bedrooms, areaSqm, listingType, excludeId } = body;

    // AI-powered price prediction based on similar properties
    // This uses a simple algorithm - in production, you'd use ML models
    
    const similarProperties = await prisma.property.findMany({
      where: {
        AND: [
          { status: 'available' },
          // Don't compare a property against itself
          ...(excludeId ? [{ id: { not: excludeId } }] : []),
          { city: { contains: city } },
          { propertyType },
          { listingType },
          { bedrooms: { gte: bedrooms - 1, lte: bedrooms + 1 } },
          { areaSqm: { gte: areaSqm * 0.8, lte: areaSqm * 1.2 } },
        ],
      },
      take: 20,
    });

    if (similarProperties.length === 0) {
      return NextResponse.json({
        estimatedPrice: null,
        confidence: 0,
        message: 'Not enough similar properties to make a prediction',
      });
    }

    // Average price per square metre across comparable properties
    const pricesPerSqm = similarProperties.map((p) => {
      const price = listingType === 'rent' ? (p.rentPriceUSD || p.priceUSD || 0) : (p.priceUSD || 0);
      return price / (p.areaSqm || areaSqm);
    });
    const avgPricePerSqm = pricesPerSqm.reduce((sum, v) => sum + v, 0) / pricesPerSqm.length;

    // Calculate confidence based on number of similar properties
    const confidence = Math.min(95, 50 + (similarProperties.length * 3));

    // Scale to the size of this property
    const adjustedPrice = avgPricePerSqm * areaSqm;

    return NextResponse.json({
      estimatedPrice: Math.round(adjustedPrice),
      confidence: Math.round(confidence),
      comparisonCount: similarProperties.length,
      priceRange: {
        min: Math.round(adjustedPrice * 0.85),
        max: Math.round(adjustedPrice * 1.15),
      },
    });
  } catch (error) {
    console.error('Price prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to predict price' },
      { status: 500 }
    );
  }
}


