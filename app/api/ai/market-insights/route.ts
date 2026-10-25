import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Always compute from live data instead of caching the result at build time
export const dynamic = 'force-dynamic';

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

    // Price trend: average price per m² of the last 30 days' listings vs. older ones
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const avgPerSqm = (list: typeof saleProperties) =>
      list.length > 0
        ? list.reduce((sum, p) => sum + p.priceUSD / (p.areaSqm || 1), 0) / list.length
        : 0;
    const recentAvg = avgPerSqm(saleProperties.filter((p) => new Date(p.createdAt) >= cutoff));
    const olderAvg = avgPerSqm(saleProperties.filter((p) => new Date(p.createdAt) < cutoff));
    const priceChange = recentAvg && olderAvg ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

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


