"use client";

import React from "react";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";

const NeighborhoodsPage = () => {
  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-luxury-dark mb-8 text-center">
            Neighborhoods
          </h1>
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600 leading-relaxed">
              Explore the best neighborhoods in Lebanon. Detailed guides coming soon.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NeighborhoodsPage;


