"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PropertyGrid from "@/components/PropertyGrid";

const AgentProfilePage = () => {
  const params = useParams();
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetch(`/api/agents/${params.slug}`)
        .then((res) => res.json())
        .then((data) => {
          setAgent(data.agent);
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
            <div className="h-64 bg-gray-200 rounded-lg" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen">
        <StickyTopBar />
        <MainHeader />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-luxury-dark mb-4">
            Agent Not Found
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {agent.photo ? (
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">{agent.name[0]}</span>
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-serif font-bold text-luxury-dark mb-2">
                  {agent.name}
                </h1>
                <p className="text-gray-600 mb-4">{agent.bio || "Experienced real estate professional"}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>{agent.propertiesSold} Properties Sold</span>
                  <span>{agent.yearsExperience} Years Experience</span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-serif font-bold text-luxury-dark mb-6">
            Properties ({agent._count?.properties || agent.properties?.length || 0})
          </h2>
          <PropertyGrid
            properties={agent.properties || []}
            loading={false}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AgentProfilePage;


