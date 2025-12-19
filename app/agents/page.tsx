"use client";

import React, { useEffect, useState } from "react";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import Link from "next/link";

const AgentsPage = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => {
        setAgents(data.agents || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-luxury-dark mb-8">
            Our Agents
          </h1>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md animate-pulse h-64" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Link
                  key={agent.id}
                  href={`/agent/${agent.slug}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all"
                >
                  {agent.photo ? (
                    <img
                      src={agent.photo}
                      alt={agent.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl text-gray-400">{agent.name[0]}</span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-center text-luxury-dark mb-2">
                    {agent.name}
                  </h3>
                  <p className="text-gray-600 text-center text-sm mb-4">
                    {agent.propertiesSold} Properties Sold
                  </p>
                  {agent.specialties && agent.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {agent.specialties.slice(0, 3).map((spec: string) => (
                        <span
                          key={spec}
                          className="px-2 py-1 bg-luxury-gold/10 text-luxury-gold text-xs rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AgentsPage;


