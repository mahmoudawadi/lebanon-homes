import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const propertyType = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minSize = searchParams.get('minSize');
    const maxSize = searchParams.get('maxSize');
    const seaView = searchParams.get('seaView');
    const hasSolar = searchParams.get('hasSolar');
    const hasGenerator = searchParams.get('hasGenerator');
    const featured = searchParams.get('featured');
    const listingType = searchParams.get('listingType');
    const bedrooms = searchParams.get('bedrooms');
    const status = searchParams.get('status') || 'available';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build filter object
    const where: any = {
      status,
    };

    if (city) {
      where.city = { contains: city };
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      // Rentals are priced per month, so filter on the rent price instead
      const priceField = listingType === 'rent' ? 'rentPriceUSD' : 'priceUSD';
      where[priceField] = {};
      if (minPrice) where[priceField].gte = parseFloat(minPrice);
      if (maxPrice) where[priceField].lte = parseFloat(maxPrice);
    }

    if (bedrooms) {
      const beds = parseInt(bedrooms);
      // "4" means 4 or more
      where.bedrooms = beds >= 4 ? { gte: beds } : beds;
    }

    if (minSize || maxSize) {
      where.areaSqm = {};
      if (minSize) where.areaSqm.gte = parseFloat(minSize);
      if (maxSize) where.areaSqm.lte = parseFloat(maxSize);
    }

    if (seaView === 'true') {
      where.seaView = true;
    }

    if (hasSolar === 'true') {
      where.hasSolar = true;
    }

    if (hasGenerator === 'true') {
      where.hasGenerator = true;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (listingType) {
      // Listings marked "both" are available for sale and for rent
      where.listingType = listingType === 'both' ? 'both' : { in: [listingType, 'both'] };
    }

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

