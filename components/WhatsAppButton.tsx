"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";

const WhatsAppButton = () => {
  const { language } = useLanguage();
  
  const phoneNumber = "9611234567"; // Replace with actual WhatsApp number
  const messages = {
    en: "Hello, I'm interested in your properties.",
    ar: "مرحبا، أنا مهتم بعقاراتكم.",
    fr: "Bonjour, je suis intéressé par vos propriétés.",
  };

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messages[language])}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 end-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-[#1fb658]"
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton;


