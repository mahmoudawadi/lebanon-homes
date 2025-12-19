"use client";

import React from "react";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { FiHome, FiBriefcase, FiShield } from "react-icons/fi";

const ServicesPage = () => {
  const services = [
    {
      icon: FiHome,
      title: "Property Sales",
      description: "Expert assistance in buying and selling luxury properties with full legal support.",
    },
    {
      icon: FiBriefcase,
      title: "Property Management",
      description: "Comprehensive property management services for landlords and investors.",
    },
    {
      icon: FiShield,
      title: "Legal Services",
      description: "Complete legal documentation and transaction support for all real estate deals.",
    },
  ];

  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-luxury-dark mb-8 text-center">
            Our Services
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition-all"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury-gold/10 rounded-full mb-6">
                  <service.icon className="w-8 h-8 text-luxury-gold" />
                </div>
                <h3 className="text-xl font-semibold text-luxury-dark mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServicesPage;


