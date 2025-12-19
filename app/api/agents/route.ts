import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const specialty = searchParams.get('specialty');
    const language = searchParams.get('language');

    const where: any = {};

    if (city || specialty || language) {
      where.properties = {
        some: {},
      };
      
      if (city) {
        where.properties.some.city = { contains: city, mode: 'insensitive' };
      }
    }

    if (specialty) {
      where.specialties = { has: specialty };
    }

    if (language) {
      where.languages = { has: language };
    }

    const agents = await prisma.agent.findMany({
      where,
      include: {
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
      orderBy: {
        propertiesSold: 'desc',
      },
    });

    // Parse JSON strings
    const parsedAgents = agents.map((agent: any) => ({
      ...agent,
      languages: agent.languages ? JSON.parse(agent.languages) : [],
      specialties: agent.specialties ? JSON.parse(agent.specialties) : [],
    }));

    return NextResponse.json({ agents: parsedAgents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const requiredFields = ['name', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const agent = await prisma.agent.create({
      data: {
        ...body,
        slug,
      },
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error: any) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create agent' },
      { status: 500 }
    );
  }
}

