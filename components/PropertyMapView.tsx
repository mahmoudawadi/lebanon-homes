"use client";

import React from "react";

const PropertyMapView = ({ properties, loading }: any) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md h-[600px] animate-pulse" />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-[600px] flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Map view coming soon</p>
        <p className="text-sm text-gray-500">
          Google Maps integration will be added here
        </p>
      </div>
    </div>
  );
};

export default PropertyMapView;


