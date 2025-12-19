import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // AI-powered market insights
    const allProperties = await prisma.property.findMany({
      where: { status: 'available' },
    });

    // Calculate average price
    const saleProperties = allProperties.filter((p) => p.listingType === 'sale' || p.listingType === 'both');
    const avgPrice = saleProperties.length > 0
      ? saleProperties.reduce((sum, p) => sum + (p.priceUSD || 0), 0) / saleProperties.length
      : 0;

    // Calculate price trend (simplified - in production, use historical data)
    const priceChange = Math.random() * 10 - 5; // -5% to +5% (simulated)

    // Find hot areas (cities with most listings)
    const cityCounts: Record<string, number> = {};
    allProperties.forEach((p) => {
      cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
    });
    const hotAreas = Object.entries(cityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([city]) => city);

    // Count new listings this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newThisMonth = allProperties.filter(
      (p) => new Date(p.createdAt) >= thisMonth
    ).length;

    // Find best deals (properties below average price)
    const bestDealsCount = saleProperties.filter(
      (p) => p.priceUSD < avgPrice * 0.9
    ).length;

    return NextResponse.json({
      avgPrice: Math.round(avgPrice),
      priceChange: parseFloat(priceChange.toFixed(1)),
      hotAreas,
      totalListings: allProperties.length,
      newThisMonth,
      bestDealsCount,
    });
  } catch (error) {
    console.error('Market insights error:', error);
    return NextResponse.json(
      { error: 'Failed to get market insights' },
      { status: 500 }
    );
  }
}


