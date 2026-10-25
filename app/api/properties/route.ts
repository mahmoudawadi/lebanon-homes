import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildPropertyWhere } from '@/lib/property-search';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const num = (key: string) => {
      const value = searchParams.get(key);
      return value ? parseFloat(value) : null;
    };
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where = buildPropertyWhere({
      city: searchParams.get('city'),
      propertyType: searchParams.get('type'),
      listingType: searchParams.get('listingType'),
      minPrice: num('minPrice'),
      maxPrice: num('maxPrice'),
      minSize: num('minSize'),
      maxSize: num('maxSize'),
      bedrooms: num('bedrooms'),
      seaView: searchParams.get('seaView') === 'true',
      hasSolar: searchParams.get('hasSolar') === 'true',
      hasGenerator: searchParams.get('hasGenerator') === 'true',
      featured: searchParams.get('featured') === 'true',
      status: searchParams.get('status'),
    });

    // Fetch properties with agent relation
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              photo: true,
              phone: true,
              whatsapp: true,
              languages: true,
            },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    // Parse JSON strings to arrays
    const parsedProperties = properties.map((property: any) => ({
      ...property,
      images: property.images ? JSON.parse(property.images) : [],
      agent: property.agent ? {
        ...property.agent,
        languages: property.agent.languages ? JSON.parse(property.agent.languages) : [],
      } : null,
    }));

    return NextResponse.json({
      properties: parsedProperties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'priceUSD', 'city', 'propertyType', 'bedrooms', 'bathrooms', 'areaSqm', 'agentId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate listing type
    if (!['sale', 'rent', 'both'].includes(body.listingType || 'sale')) {
      return NextResponse.json(
        { error: 'Invalid listing type. Must be: sale, rent, or both' },
        { status: 400 }
      );
    }

    // If rent, require rent price
    if ((body.listingType === 'rent' || body.listingType === 'both') && !body.rentPriceUSD) {
      return NextResponse.json(
        { error: 'Rent price is required for rental properties' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Ensure images is JSON string
    const images = typeof body.images === 'string' 
      ? body.images 
      : JSON.stringify(body.images || []);

    const property = await prisma.property.create({
      data: {
        ...body,
        slug,
        images,
        listingType: body.listingType || 'sale',
        status: body.status || 'available',
      },
      include: {
        agent: true,
      },
    });

    // Parse images for response
    const responseProperty = {
      ...property,
      images: property.images ? JSON.parse(property.images) : [],
    };

    return NextResponse.json(responseProperty, { status: 201 });
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create property' },
      { status: 500 }
    );
  }
}

