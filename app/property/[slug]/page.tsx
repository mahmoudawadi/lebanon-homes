"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PropertyDetailHero from "@/components/PropertyDetailHero";
import PropertyDetailContent from "@/components/PropertyDetailContent";
import AgentCard from "@/components/AgentCard";
import SimilarProperties from "@/components/SimilarProperties";
import AIPricePredictor from "@/components/AIPricePredictor";
import { LuSearchX } from "react-icons/lu";

const PropertyDetailPage = () => {
  const params = useParams();
  const [property, setProperty] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetch(`/api/properties/${params.slug}`)
        .then((res) => res.json())
        .then((data) => {
          setProperty(data.property || null);
          setSimilar(data.similarProperties || []);
        })
        .catch(() => setProperty(null))
        .finally(() => setLoading(false));
    }
  }, [params.slug]);

  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />

      {loading ? (
        <div className="container-x space-y-8 py-10">
          <div className="skeleton h-[480px]" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="skeleton h-72 lg:col-span-2" />
            <div className="skeleton h-72" />
          </div>
        </div>
      ) : !property ? (
        <div className="container-x flex flex-col items-center py-28 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-brass shadow-soft">
            <LuSearchX className="h-7 w-7" />
          </span>
          <h1 className="mt-6 font-serif text-4xl font-semibold">Property Not Found</h1>
          <p className="mt-2 text-muted">The property you&apos;re looking for doesn&apos;t exist or is no longer available.</p>
          <Link href="/properties" className="btn-primary mt-8">Browse properties</Link>
        </div>
      ) : (
        <>
          <PropertyDetailHero property={property} />
          <div className="container-x py-12">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <PropertyDetailContent property={property} />
              </div>
              <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                <AgentCard agent={property.agent} propertyTitle={property.title} />
                <AIPricePredictor property={property} />
              </div>
            </div>
          </div>
          <SimilarProperties properties={similar} />
        </>
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetailPage;
