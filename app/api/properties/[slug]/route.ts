import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { slug: params.slug },
      include: {
        agent: {
          select: {
            id: true,
            slug: true,
            name: true,
            nameAr: true,
            nameFr: true,
            email: true,
            phone: true,
            whatsapp: true,
            photo: true,
            bio: true,
            bioAr: true,
            bioFr: true,
            languages: true,
            specialties: true,
            propertiesSold: true,
            yearsExperience: true,
            linkedin: true,
            instagram: true,
            facebook: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Get similar properties (same city or type)
    const similarProperties = await prisma.property.findMany({
      where: {
        AND: [
          { id: { not: property.id } },
          { status: 'available' },
          {
            OR: [
              { city: property.city },
              { propertyType: property.propertyType },
            ],
          },
        ],
      },
      take: 4,
      select: {
        id: true,
        slug: true,
        title: true,
        titleAr: true,
        titleFr: true,
        priceUSD: true,
        city: true,
        propertyType: true,
        bedrooms: true,
        bathrooms: true,
        areaSqm: true,
        images: true,
        seaView: true,
        featured: true,
      },
    });

    // Parse JSON strings
    const parsedProperty = {
      ...property,
      images: property.images ? JSON.parse(property.images) : [],
      agent: property.agent ? {
        ...property.agent,
        languages: property.agent.languages ? JSON.parse(property.agent.languages) : [],
        specialties: property.agent.specialties ? JSON.parse(property.agent.specialties) : [],
      } : null,
    };

    const parsedSimilar = similarProperties.map((p: any) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
    }));

    return NextResponse.json({
      property: parsedProperty,
      similarProperties: parsedSimilar,
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

