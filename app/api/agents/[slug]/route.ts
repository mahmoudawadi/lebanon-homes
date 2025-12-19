import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const agent = await prisma.agent.findUnique({
      where: { slug: params.slug },
      include: {
        properties: {
          where: {
            status: 'available',
          },
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
            featured: true,
          },
          orderBy: {
            featured: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            properties: {
              where: {
                status: 'available',
              },
            },
          },
        },
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Parse JSON strings
    const parsedAgent = {
      ...agent,
      languages: agent.languages ? JSON.parse(agent.languages) : [],
      specialties: agent.specialties ? JSON.parse(agent.specialties) : [],
      properties: agent.properties.map((p: any) => ({
        ...p,
        images: p.images ? JSON.parse(p.images) : [],
      })),
    };

    return NextResponse.json({ agent: parsedAgent });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

