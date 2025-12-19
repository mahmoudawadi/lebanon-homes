"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HiMenu, HiX } from "react-icons/hi";
import { FiUser, FiLogOut } from "react-icons/fi";

const MainHeader = () => {
  const { language, isRTL } = useLanguage();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { href: "/properties", label: { en: "Buy & Rent", ar: "شراء وإيجار", fr: "Acheter et Louer" } },
    { href: "/", label: { en: "Home", ar: "الرئيسية", fr: "Accueil" } },
    { href: "/properties", label: { en: "Properties", ar: "العقارات", fr: "Propriétés" } },
    { href: "/agents", label: { en: "Agents", ar: "الوكلاء", fr: "Agents" } },
    { href: "/services", label: { en: "Services", ar: "الخدمات", fr: "Services" } },
    { href: "/insights", label: { en: "Insights", ar: "رؤى", fr: "Aperçus" } },
    { href: "/neighborhoods", label: { en: "Neighborhoods", ar: "الأحياء", fr: "Quartiers" } },
    { href: "/contact", label: { en: "Contact", ar: "اتصل بنا", fr: "Contact" } },
  ];

  const getLabel = (labels: { en: string; ar: string; fr: string }) => {
    return labels[language];
  };

  return (
    <header className="bg-black text-white sticky top-[140px] z-40 border-b border-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 py-4">
          {/* Top Row: Logo and Actions */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-serif font-bold text-white">
                LebEstate
              </div>
            </Link>

            {/* CTA Button & Auth */}
            <div className="hidden lg:flex items-center gap-4">
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-indigo-500 hover:text-indigo-400 transition-colors"
                  >
                    <FiUser className="w-5 h-5" />
                    <span className="font-medium">{session.user?.name}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-2 z-50 border border-gray-800">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {getLabel({ en: "Dashboard", ar: "لوحة التحكم", fr: "Tableau de bord" })}
                      </Link>
                      <Link
                        href="/favorites"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {getLabel({ en: "Favorites", ar: "المفضلة", fr: "Favoris" })}
                      </Link>
                      {session.user?.role === "seller" && (
                        <Link
                          href="/dashboard/properties"
                          className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {getLabel({ en: "My Properties", ar: "عقاراتي", fr: "Mes Propriétés" })}
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2"
                      >
                        <FiLogOut className="w-4 h-4" />
                        {getLabel({ en: "Sign Out", ar: "تسجيل الخروج", fr: "Déconnexion" })}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-indigo-500 hover:text-indigo-400 transition-colors font-medium text-sm"
                  >
                    {getLabel({ en: "Sign In", ar: "تسجيل الدخول", fr: "Connexion" })}
                  </Link>
                  <Link
                    href="/signup"
                    className="text-indigo-500 hover:text-indigo-400 transition-colors font-medium text-sm"
                  >
                    {getLabel({ en: "Sign Up", ar: "إنشاء حساب", fr: "S'inscrire" })}
                  </Link>
                </>
              )}
              <button className="bg-gray-200 text-gray-900 px-5 py-2 text-sm font-semibold hover:bg-gray-300 transition-all">
                {getLabel({ en: "List Your Property", ar: "أضف عقارك", fr: "Listez votre propriété" })}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden bg-gray-200 text-gray-900 p-2.5 hover:bg-gray-300 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <HiX className="w-5 h-5" />
              ) : (
                <HiMenu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-indigo-500 hover:text-indigo-400 transition-colors font-medium text-sm"
              >
                {getLabel(link.label)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-900">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-indigo-500 hover:text-indigo-400 transition-colors font-medium text-sm"
                >
                  {getLabel(link.label)}
                </Link>
              ))}
              <button className="bg-gray-200 text-gray-900 px-6 py-2 text-sm font-semibold hover:bg-gray-300 transition-all mt-2">
                {getLabel({ en: "List Your Property", ar: "أضف عقارك", fr: "Listez votre propriété" })}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default MainHeader;

