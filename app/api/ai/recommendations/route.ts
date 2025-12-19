import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // AI-powered recommendations based on user preferences
    // For now, return featured properties as recommendations
    // In production, this would use ML models to personalize
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        favorites: {
          include: {
            property: true,
          },
        },
      },
    });

    // Get properties similar to user's favorites
    let recommendedProperties: any[] = [];

    if (user?.favorites && user.favorites.length > 0) {
      const favoriteProperty = user.favorites[0].property;
      
      recommendedProperties = await prisma.property.findMany({
        where: {
          AND: [
            { id: { not: favoriteProperty.id } },
            { status: 'available' },
            {
              OR: [
                { city: favoriteProperty.city },
                { propertyType: favoriteProperty.propertyType },
                { listingType: favoriteProperty.listingType },
              ],
            },
          ],
        },
        take: 6,
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              photo: true,
              phone: true,
            },
          },
        },
      });
    } else {
      // If no favorites, show featured properties
      recommendedProperties = await prisma.property.findMany({
        where: {
          featured: true,
          status: 'available',
        },
        take: 6,
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              photo: true,
              phone: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // Parse JSON strings
    const parsedProperties = recommendedProperties.map((property: any) => ({
      ...property,
      images: property.images ? JSON.parse(property.images) : [],
      agent: property.agent ? {
        ...property.agent,
        languages: property.agent.languages ? JSON.parse(property.agent.languages) : [],
      } : null,
    }));

    return NextResponse.json({
      properties: parsedProperties,
    });
  } catch (error) {
    console.error('AI Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}


