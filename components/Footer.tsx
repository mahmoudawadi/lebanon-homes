"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

const Footer = () => {
  const { language, isRTL } = useLanguage();
  const [email, setEmail] = useState("");

  const translations = {
    en: {
      company: "Company",
      clients: "Clients",
      resources: "Resources",
      contact: "Contact",
      about: "About Us",
      services: "Services",
      careers: "Careers",
      blog: "Blog",
      testimonials: "Testimonials",
      faq: "FAQ",
      buyingGuide: "Buying Guide",
      investmentGuide: "Investment Guide",
      legal: "Legal",
      office: "Office",
      phone: "Phone",
      email: "Email",
      newsletter: "Newsletter",
      newsletterPlaceholder: "Enter your email",
      subscribe: "Subscribe",
      rights: "All rights reserved.",
    },
    ar: {
      company: "الشركة",
      clients: "العملاء",
      resources: "الموارد",
      contact: "اتصل بنا",
      about: "من نحن",
      services: "الخدمات",
      careers: "الوظائف",
      blog: "المدونة",
      testimonials: "الشهادات",
      faq: "الأسئلة الشائعة",
      buyingGuide: "دليل الشراء",
      investmentGuide: "دليل الاستثمار",
      legal: "قانوني",
      office: "المكتب",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      newsletter: "النشرة الإخبارية",
      newsletterPlaceholder: "أدخل بريدك الإلكتروني",
      subscribe: "اشترك",
      rights: "جميع الحقوق محفوظة.",
    },
    fr: {
      company: "Entreprise",
      clients: "Clients",
      resources: "Ressources",
      contact: "Contact",
      about: "À Propos",
      services: "Services",
      careers: "Carrières",
      blog: "Blog",
      testimonials: "Témoignages",
      faq: "FAQ",
      buyingGuide: "Guide d'Achat",
      investmentGuide: "Guide d'Investissement",
      legal: "Légal",
      office: "Bureau",
      phone: "Téléphone",
      email: "Email",
      newsletter: "Newsletter",
      newsletterPlaceholder: "Entrez votre email",
      subscribe: "S'abonner",
      rights: "Tous droits réservés.",
    },
  };

  const t = translations[language];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-br from-estate-dark via-slate-800 to-estate-dark text-white mt-20 border-t border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-estate-primary">{t.company}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-luxury-gold transition-colors">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-luxury-gold transition-colors">
                  {t.services}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-luxury-gold transition-colors">
                  {t.careers}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-luxury-gold transition-colors">
                  {t.blog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Clients Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-luxury-gold">{t.clients}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/testimonials" className="text-gray-300 hover:text-luxury-gold transition-colors">
                  {t.testimonials}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-luxury-gold transition-colors">
                  {t.faq}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-luxury-gold">{t.resources}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/guides/buying" className="text-gray-300 hover:text-luxury-gold transition-colors">
                  {t.buyingGuide}
                </Link>
              </li>
              <li>
                <Link href="/guides/investment" className="text-gray-300 hover:text-luxury-gold transition-colors">
                  {t.investmentGuide}
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-gray-300 hover:text-luxury-gold transition-colors">
                  {t.legal}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-luxury-gold">{t.contact}</h3>
            <ul className="space-y-2 mb-6">
              <li className="text-gray-300">
                <strong>{t.office}:</strong> Beirut, Lebanon
              </li>
              <li className="text-gray-300">
                <strong>{t.phone}:</strong> +961 1 234 567
              </li>
              <li className="text-gray-300 flex items-center gap-2">
                <FiMail className="w-4 h-4" />
                <a href="mailto:info@luxestate.com" className="hover:text-luxury-gold transition-colors">
                  info@luxestate.com
                </a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-4 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-estate-primary transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-estate-primary transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-estate-primary transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-estate-primary transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-estate-primary transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-700 pt-8">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-center text-estate-primary">{t.newsletter}</h3>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletterPlaceholder}
                required
                className={`flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold text-white ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
              <button
                type="submit"
                className="bg-luxury-gold text-luxury-dark px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all"
              >
                {t.subscribe}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} LuxEstate. {t.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

