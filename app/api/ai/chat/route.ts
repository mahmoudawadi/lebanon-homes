import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { message, language } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const lowerMessage = message.toLowerCase();

    // AI-powered property search and recommendations
    let response = '';
    let properties: any[] = [];

    // Detect intent and search properties
    if (lowerMessage.includes('rent') || lowerMessage.includes('إيجار') || lowerMessage.includes('louer')) {
      const rentProperties = await prisma.property.findMany({
        where: {
          listingType: { in: ['rent', 'both'] },
          status: 'available',
        },
        take: 5,
        include: {
          agent: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
      });

      properties = rentProperties.map((p: any) => ({
        ...p,
        images: p.images ? JSON.parse(p.images) : [],
      }));

      response = language === 'en'
        ? `I found ${rentProperties.length} properties for rent. Here are some options:\n\n${rentProperties.slice(0, 3).map((p: any, i: number) => `${i + 1}. ${p.title} in ${p.city} - $${p.rentPriceUSD || p.priceUSD}/month`).join('\n')}\n\nWould you like more details about any of these?`
        : language === 'ar'
        ? `وجدت ${rentProperties.length} عقاراً للإيجار. إليك بعض الخيارات:\n\n${rentProperties.slice(0, 3).map((p: any, i: number) => `${i + 1}. ${p.titleAr || p.title} في ${p.city} - $${p.rentPriceUSD || p.priceUSD}/شهر`).join('\n')}\n\nهل تريد المزيد من التفاصيل عن أي من هذه؟`
        : `J'ai trouvé ${rentProperties.length} propriétés à louer. Voici quelques options:\n\n${rentProperties.slice(0, 3).map((p: any, i: number) => `${i + 1}. ${p.titleFr || p.title} à ${p.city} - $${p.rentPriceUSD || p.priceUSD}/mois`).join('\n')}\n\nSouhaitez-vous plus de détails sur l'une d'entre elles?`;

    } else if (lowerMessage.includes('buy') || lowerMessage.includes('شراء') || lowerMessage.includes('acheter') || lowerMessage.includes('sale') || lowerMessage.includes('بيع')) {
      const saleProperties = await prisma.property.findMany({
        where: {
          listingType: { in: ['sale', 'both'] },
          status: 'available',
        },
        take: 5,
        include: {
          agent: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
      });

      properties = saleProperties.map((p: any) => ({
        ...p,
        images: p.images ? JSON.parse(p.images) : [],
      }));

      response = language === 'en'
        ? `I found ${saleProperties.length} properties for sale. Here are some options:\n\n${saleProperties.slice(0, 3).map((p: any, i: number) => `${i + 1}. ${p.title} in ${p.city} - $${p.priceUSD.toLocaleString()}`).join('\n')}\n\nWould you like more details?`
        : language === 'ar'
        ? `وجدت ${saleProperties.length} عقاراً للبيع. إليك بعض الخيارات:\n\n${saleProperties.slice(0, 3).map((p: any, i: number) => `${i + 1}. ${p.titleAr || p.title} في ${p.city} - $${p.priceUSD.toLocaleString()}`).join('\n')}\n\nهل تريد المزيد من التفاصيل؟`
        : `J'ai trouvé ${saleProperties.length} propriétés à vendre. Voici quelques options:\n\n${saleProperties.slice(0, 3).map((p: any, i: number) => `${i + 1}. ${p.titleFr || p.title} à ${p.city} - $${p.priceUSD.toLocaleString()}`).join('\n')}\n\nSouhaitez-vous plus de détails?`;

    } else if (lowerMessage.includes('beirut') || lowerMessage.includes('بيروت') || lowerMessage.includes('beyrouth')) {
      const beirutProperties = await prisma.property.findMany({
        where: {
          city: { contains: 'Beirut', mode: 'insensitive' },
          status: 'available',
        },
        take: 5,
      });

      properties = beirutProperties.map((p: any) => ({
        ...p,
        images: p.images ? JSON.parse(p.images) : [],
      }));

      response = language === 'en'
        ? `I found ${beirutProperties.length} properties in Beirut. Would you like to see apartments, villas, or commercial spaces?`
        : language === 'ar'
        ? `وجدت ${beirutProperties.length} عقاراً في بيروت. هل تريد رؤية شقق أو فيلات أو مساحات تجارية؟`
        : `J'ai trouvé ${beirutProperties.length} propriétés à Beyrouth. Souhaitez-vous voir des appartements, des villas ou des espaces commerciaux?`;

    } else if (lowerMessage.includes('price') || lowerMessage.includes('سعر') || lowerMessage.includes('prix') || lowerMessage.includes('average') || lowerMessage.includes('متوسط')) {
      const allProperties = await prisma.property.findMany({
        where: { status: 'available' },
      });

      const avgPrice = allProperties.reduce((sum, p) => sum + (p.priceUSD || 0), 0) / allProperties.length;
      const avgRent = allProperties
        .filter((p) => p.listingType === 'rent' || p.listingType === 'both')
        .reduce((sum, p) => sum + (p.rentPriceUSD || p.priceUSD || 0), 0) / allProperties.filter((p) => p.listingType === 'rent' || p.listingType === 'both').length;

      response = language === 'en'
        ? `Based on our current listings:\n• Average sale price: $${Math.round(avgPrice).toLocaleString()}\n• Average rent: $${Math.round(avgRent).toLocaleString()}/month\n\nPrices vary by location, size, and features. Would you like to see properties in a specific price range?`
        : language === 'ar'
        ? `بناءً على قوائمنا الحالية:\n• متوسط سعر البيع: $${Math.round(avgPrice).toLocaleString()}\n• متوسط الإيجار: $${Math.round(avgRent).toLocaleString()}/شهر\n\nتختلف الأسعار حسب الموقع والحجم والميزات. هل تريد رؤية عقارات في نطاق سعر محدد؟`
        : `Basé sur nos listes actuelles:\n• Prix de vente moyen: $${Math.round(avgPrice).toLocaleString()}\n• Loyer moyen: $${Math.round(avgRent).toLocaleString()}/mois\n\nLes prix varient selon l'emplacement, la taille et les caractéristiques. Souhaitez-vous voir des propriétés dans une fourchette de prix spécifique?`;

    } else if (lowerMessage.includes('sea view') || lowerMessage.includes('إطلالة') || lowerMessage.includes('vue mer')) {
      const seaViewProperties = await prisma.property.findMany({
        where: {
          seaView: true,
          status: 'available',
        },
        take: 5,
      });

      properties = seaViewProperties.map((p: any) => ({
        ...p,
        images: p.images ? JSON.parse(p.images) : [],
      }));

      response = language === 'en'
        ? `I found ${seaViewProperties.length} properties with sea views. These are premium listings with beautiful Mediterranean views. Would you like details on any of them?`
        : language === 'ar'
        ? `وجدت ${seaViewProperties.length} عقاراً بإطلالة على البحر. هذه قوائم مميزة بإطلالات جميلة على البحر الأبيض المتوسط. هل تريد التفاصيل عن أي منها؟`
        : `J'ai trouvé ${seaViewProperties.length} propriétés avec vue sur la mer. Ce sont des listes premium avec de belles vues sur la Méditerranée. Souhaitez-vous des détails sur l'une d'entre elles?`;

    } else {
      // General help response
      response = language === 'en'
        ? "I can help you find properties! Try asking:\n• 'Show me apartments for rent'\n• 'Properties for sale in Beirut'\n• 'What's the average price?'\n• 'Properties with sea view'\n\nWhat are you looking for?"
        : language === 'ar'
        ? "يمكنني مساعدتك في العثور على العقارات! جرب أن تسأل:\n• 'أرني شقق للإيجار'\n• 'عقارات للبيع في بيروت'\n• 'ما هو متوسط السعر؟'\n• 'عقارات بإطلالة على البحر'\n\nماذا تبحث عنه؟"
        : "Je peux vous aider à trouver des propriétés! Essayez de demander:\n• 'Montrez-moi des appartements à louer'\n• 'Propriétés à vendre à Beyrouth'\n• 'Quel est le prix moyen?'\n• 'Propriétés avec vue sur la mer'\n\nQue cherchez-vous?";
    }

    return NextResponse.json({
      response,
      properties: properties.length > 0 ? properties : undefined,
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}


