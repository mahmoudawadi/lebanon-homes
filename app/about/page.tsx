"use client";

import React from "react";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-luxury-dark mb-8 text-center">
            About Us
          </h1>
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600 leading-relaxed mb-6">
              LuxEstate is Lebanon's premier luxury real estate agency, specializing
              in high-end properties across Beirut and the coastal regions. With over
              15 years of experience, we have helped thousands of clients find their
              dream homes and make profitable investments.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our team of expert agents combines deep local market knowledge with
              international standards of service, ensuring every transaction is
              smooth, transparent, and successful.
            </p>
            <div className="grid grid-cols-3 gap-8 mt-8 text-center">
              <div>
                <div className="text-4xl font-bold text-luxury-gold mb-2">500+</div>
                <div className="text-gray-600">Properties Sold</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-luxury-gold mb-2">15+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-luxury-gold mb-2">1000+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;


