// Tools the AI assistant can call. Each one runs against the site's own database.
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { buildPropertyWhere } from '@/lib/property-search';
import { parseImages } from '@/lib/format';
import type { Send } from './prompt';

// Compact listing shape: sent to the model and rendered as cards in the chat
export interface PropertySummary {
  id: string;
  slug: string;
  url: string;
  title: string;
  city: string;
  neighborhood: string | null;
  propertyType: string;
  listingType: string;
  priceUSD: number;
  rentPriceUSD: number | null;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  seaView: boolean;
  featured: boolean;
  image: string | null;
}

const summarize = (p: any): PropertySummary => ({
  id: p.id,
  slug: p.slug,
  url: `/property/${p.slug}`,
  title: p.title,
  city: p.city,
  neighborhood: p.neighborhood,
  propertyType: p.propertyType,
  listingType: p.listingType,
  priceUSD: p.priceUSD,
  rentPriceUSD: p.rentPriceUSD,
  bedrooms: p.bedrooms,
  bathrooms: p.bathrooms,
  areaSqm: p.areaSqm,
  seaView: p.seaView,
  featured: p.featured,
  image: parseImages(p.images)[0] || null,
});

const searchInput = z.object({
  city: z.string().max(80).optional(),
  listingType: z.enum(['sale', 'rent']).optional(),
  propertyType: z.enum(['apartment', 'villa', 'penthouse', 'commercial']).optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),
  minSize: z.number().nonnegative().optional(),
  seaView: z.boolean().optional(),
  hasSolar: z.boolean().optional(),
  hasGenerator: z.boolean().optional(),
  limit: z.number().int().min(1).max(8).optional(),
});

const detailsInput = z.object({ slug: z.string().min(1).max(200) });

const viewingInput = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().max(40).optional(),
  email: z.string().email().max(200).optional(),
  propertySlug: z.string().max(200).optional(),
  preferredTime: z.string().max(200).optional(),
  message: z.string().min(2).max(2000),
});

// Provider-neutral tool definitions (JSON Schema parameters)
export interface ToolSpec {
  name: string;
  description: string;
  parameters: { type: 'object'; properties: Record<string, unknown>; required?: string[] };
}

export const toolSpecs: ToolSpec[] = [
  {
    name: 'search_properties',
    description:
      'Search the live LebEstate listings. Use this whenever the visitor asks what is available, wants options, or describes what they are looking for. All filters are optional; combine them. Prices are in USD (monthly rent when listingType is "rent"). Returns up to `limit` listings with their page URL.',
    parameters: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City or area name, e.g. "Beirut", "Jounieh", "Metn".' },
        listingType: { type: 'string', enum: ['sale', 'rent'] },
        propertyType: { type: 'string', enum: ['apartment', 'villa', 'penthouse', 'commercial'] },
        minPrice: { type: 'number', description: 'Minimum price in USD.' },
        maxPrice: { type: 'number', description: 'Maximum price in USD (monthly for rentals).' },
        bedrooms: { type: 'integer', description: 'Exact number of bedrooms; 4 means 4 or more.' },
        minSize: { type: 'number', description: 'Minimum area in square metres.' },
        seaView: { type: 'boolean' },
        hasSolar: { type: 'boolean' },
        hasGenerator: { type: 'boolean' },
        limit: { type: 'integer', description: 'How many results to return (1-8, default 4).' },
      },
    },
  },
  {
    name: 'get_property_details',
    description:
      'Get the full details of one listing (description, amenities, investment data, listing agent) by its slug. Use it before answering specific questions about a property.',
    parameters: {
      type: 'object',
      properties: { slug: { type: 'string', description: 'The listing slug, e.g. "3br-villa-rent-jounieh".' } },
      required: ['slug'],
    },
  },
  {
    name: 'list_agents',
    description: 'List the LebEstate agents with their specialties, languages, experience and contact details.',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'get_market_stats',
    description:
      'Get current market figures computed from live listings: average sale price, average monthly rent, listing counts by city and property type.',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'request_viewing',
    description:
      'Send a viewing or callback request to the LebEstate team. Only call this after the visitor has given their name and a phone number or email, and has confirmed they want you to send the request.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        propertySlug: { type: 'string', description: 'Slug of the listing the request is about, if any.' },
        preferredTime: { type: 'string', description: 'When the visitor would like the viewing or call.' },
        message: { type: 'string', description: 'Short summary of what the visitor wants.' },
      },
      required: ['name', 'message'],
    },
  },
];

export interface ToolOutcome {
  content: string;
  isError?: boolean;
  properties?: PropertySummary[];
  viewingRequested?: boolean;
}

const json = (value: unknown) => JSON.stringify(value);

export async function runAssistantTool(name: string, rawInput: unknown): Promise<ToolOutcome> {
  switch (name) {
    case 'search_properties': {
      const parsed = searchInput.safeParse(rawInput);
      if (!parsed.success) return { content: `Invalid input: ${parsed.error.message}`, isError: true };
      const { limit = 4, ...filters } = parsed.data;
      const rows = await prisma.property.findMany({
        where: buildPropertyWhere(filters),
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        take: limit,
      });
      const properties = rows.map(summarize);
      return {
        content: json({ count: properties.length, properties }),
        properties,
      };
    }

    case 'get_property_details': {
      const parsed = detailsInput.safeParse(rawInput);
      if (!parsed.success) return { content: `Invalid input: ${parsed.error.message}`, isError: true };
      const p = await prisma.property.findUnique({
        where: { slug: parsed.data.slug },
        include: { agent: { select: { name: true, phone: true, whatsapp: true, email: true, slug: true } } },
      });
      if (!p) return { content: `No listing found with slug "${parsed.data.slug}".`, isError: true };
      const summary = summarize(p);
      return {
        content: json({
          ...summary,
          description: p.description,
          yearBuilt: p.yearBuilt,
          floor: p.floor,
          amenities: {
            seaView: p.seaView,
            solar: p.hasSolar,
            generator: p.hasGenerator,
            airConditioning: p.hasAC,
            elevator: p.hasElevator,
            parking: p.hasParking,
            garden: p.hasGarden,
            pool: p.hasPool,
            furnished: p.furnished,
          },
          rentalYieldPercent: p.rentalYield,
          capitalAppreciationPercent: p.capitalAppreciation,
          agent: p.agent ? { ...p.agent, profileUrl: `/agent/${p.agent.slug}` } : null,
        }),
        properties: [summary],
      };
    }

    case 'list_agents': {
      const agents = await prisma.agent.findMany({ orderBy: { propertiesSold: 'desc' } });
      return {
        content: json(
          agents.map((a) => ({
            name: a.name,
            profileUrl: `/agent/${a.slug}`,
            phone: a.phone,
            whatsapp: a.whatsapp,
            email: a.email,
            languages: JSON.parse(a.languages || '[]'),
            specialties: JSON.parse(a.specialties || '[]'),
            yearsExperience: a.yearsExperience,
            propertiesSold: a.propertiesSold,
          }))
        ),
      };
    }

    case 'get_market_stats': {
      const all = await prisma.property.findMany({ where: { status: 'available' } });
      const average = (values: number[]) =>
        values.length ? Math.round(values.reduce((s, v) => s + v, 0) / values.length) : null;
      const countBy = (key: 'city' | 'propertyType') =>
        all.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p[key]]: (acc[p[key]] || 0) + 1 }), {});
      return {
        content: json({
          activeListings: all.length,
          averageSalePriceUSD: average(all.filter((p) => p.listingType !== 'rent').map((p) => p.priceUSD)),
          averageMonthlyRentUSD: average(
            all.filter((p) => p.listingType !== 'sale').map((p) => p.rentPriceUSD || p.priceUSD)
          ),
          listingsByCity: countBy('city'),
          listingsByType: countBy('propertyType'),
        }),
      };
    }

    case 'request_viewing': {
      const parsed = viewingInput.safeParse(rawInput);
      if (!parsed.success) return { content: `Invalid input: ${parsed.error.message}`, isError: true };
      const { name, phone, email, propertySlug, preferredTime, message } = parsed.data;
      if (!phone && !email) {
        return { content: 'Ask the visitor for a phone number or email before sending the request.', isError: true };
      }
      const property = propertySlug
        ? await prisma.property.findUnique({ where: { slug: propertySlug }, select: { id: true, agentId: true, title: true } })
        : null;
      await prisma.contact.create({
        data: {
          name,
          email: email || '',
          phone: phone || null,
          subject: property ? `Viewing request (AI assistant): ${property.title}` : 'Request via AI assistant',
          message: preferredTime ? `${message}\n\nPreferred time: ${preferredTime}` : message,
          propertyId: property?.id || null,
          agentId: property?.agentId || null,
        },
      });
      return { content: 'Request saved. The LebEstate team will contact the visitor shortly.', viewingRequested: true };
    }

    default:
      return { content: `Unknown tool: ${name}`, isError: true };
  }
}

// Runs a tool for the chat: shows progress, forwards listing cards, never throws
export async function runToolForChat(name: string, input: unknown, send: Send) {
  send({ type: 'status', tool: name });
  try {
    const outcome = await runAssistantTool(name, input);
    if (outcome.properties?.length) send({ type: 'properties', properties: outcome.properties });
    if (outcome.viewingRequested) send({ type: 'viewing_requested' });
    return { content: outcome.content, isError: !!outcome.isError };
  } catch (err) {
    console.error(`Assistant tool ${name} failed:`, err);
    return {
      content: 'The tool failed unexpectedly. Apologise and suggest contacting the team.',
      isError: true,
    };
  }
}
