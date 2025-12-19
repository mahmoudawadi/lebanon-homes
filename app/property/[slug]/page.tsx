"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PropertyDetailHero from "@/components/PropertyDetailHero";
import PropertyDetailContent from "@/components/PropertyDetailContent";
import AgentCard from "@/components/AgentCard";
import SimilarProperties from "@/components/SimilarProperties";
import AIPricePredictor from "@/components/AIPricePredictor";

const PropertyDetailPage = () => {
  const params = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetch(`/api/properties/${params.slug}`)
        .then((res) => res.json())
        .then((data) => {
          setProperty(data.property);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <StickyTopBar />
        <MainHeader />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-200 rounded-lg" />
            <div className="h-64 bg-gray-200 rounded-lg" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen">
        <StickyTopBar />
        <MainHeader />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-luxury-dark mb-4">
            Property Not Found
          </h1>
          <p className="text-gray-600">The property you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />
      <PropertyDetailHero property={property} />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyDetailContent property={property} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <AgentCard agent={property.agent} />
            <AIPricePredictor property={property} />
          </div>
        </div>
      </div>
      <SimilarProperties propertyId={property.id} />
      <Footer />
    </div>
  );
};

export default PropertyDetailPage;

