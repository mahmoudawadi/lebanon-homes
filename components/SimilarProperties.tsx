"use client";

import React, { useEffect, useState } from "react";
import PropertyGrid from "./PropertyGrid";

const SimilarProperties = ({ propertyId }: any) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/properties?limit=3")
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data.properties || []).filter(
          (p: any) => p.id !== propertyId
        );
        setProperties(filtered.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [propertyId]);

  if (properties.length === 0 && !loading) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif font-bold text-luxury-dark mb-8">
          Similar Properties
        </h2>
        <PropertyGrid properties={properties} loading={loading} />
      </div>
    </section>
  );
};

export default SimilarProperties;


