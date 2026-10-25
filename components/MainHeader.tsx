"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuMenu, LuX, LuUser, LuLogOut, LuChevronDown } from "react-icons/lu";
import { motion, useScroll, useSpring } from "framer-motion";

type Labels = { en: string; ar: string; fr: string };

const navLinks: { href: string; label: Labels }[] = [
  { href: "/", label: { en: "Home", ar: "الرئيسية", fr: "Accueil" } },
  { href: "/properties", label: { en: "Properties", ar: "العقارات", fr: "Propriétés" } },
  { href: "/neighborhoods", label: { en: "Neighborhoods", ar: "الأحياء", fr: "Quartiers" } },
  { href: "/agents", label: { en: "Agents", ar: "الوكلاء", fr: "Agents" } },
  { href: "/insights", label: { en: "Insights", ar: "رؤى", fr: "Aperçus" } },
  { href: "/services", label: { en: "Services", ar: "الخدمات", fr: "Services" } },
  { href: "/contact", label: { en: "Contact", ar: "اتصل بنا", fr: "Contact" } },
];

export const Logo = ({ light = false }: { light?: boolean }) => (
  <Link href="/" className="group flex items-center gap-2.5" aria-label="LebEstate home">
    <span className="grid h-9 w-9 place-items-center rounded-full bg-brass text-white transition-transform group-hover:rotate-12">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 10v9.5h12V10" strokeLinejoin="round" />
        <path d="M10 19.5v-5h4v5" strokeLinejoin="round" />
      </svg>
    </span>
    <span className={`font-serif text-xl font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>
      Leb<span className="text-brass">Estate</span>
    </span>
  </Link>
);

const MainHeader = () => {
  const { language } = useLanguage();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const getLabel = (labels: Labels) => labels[language];
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled ? "border-line bg-ivory/90 shadow-soft backdrop-blur-lg" : "border-transparent bg-ivory"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(link.href) ? "text-ink" : "text-ink-500 hover:text-ink"
              }`}
            >
              {getLabel(link.label)}
              {isActive(link.href) && (
                <span className="absolute inset-x-3.5 -bottom-[1px] h-0.5 rounded-full bg-brass" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 whitespace-nowrap xl:flex">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pe-3 ps-1.5 text-sm font-medium text-ink transition hover:border-ink/30"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-xs font-semibold text-white">
                  {session.user?.name?.[0]?.toUpperCase() || <LuUser className="h-4 w-4" />}
                </span>
                <span className="max-w-[120px] truncate">{session.user?.name}</span>
                <LuChevronDown className="h-4 w-4 text-muted" />
              </button>
              {userMenuOpen && (
                <div className="card absolute end-0 z-50 mt-2 w-52 overflow-hidden p-1.5">
                  <div className="px-3 py-2 text-xs text-muted">{session.user?.email}</div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LuLogOut className="h-4 w-4" />
                    {getLabel({ en: "Sign Out", ar: "تسجيل الخروج", fr: "Déconnexion" })}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-sm font-medium text-ink-500 transition-colors hover:text-ink">
              {getLabel({ en: "Sign In", ar: "تسجيل الدخول", fr: "Connexion" })}
            </Link>
          )}
          <Link href="/contact" className="btn-primary !py-2.5">
            {getLabel({ en: "List Your Property", ar: "أضف عقارك", fr: "Listez votre propriété" })}
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink xl:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <LuX className="h-5 w-5" /> : <LuMenu className="h-5 w-5" />}
        </button>
      </div>

      {/* Reading progress */}
      <motion.div
        className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-gradient-to-r from-brass-400 via-brass to-brass-600 rtl:origin-right"
        style={{ scaleX: progress }}
      />

      {mobileMenuOpen && (
        <div className="border-t border-line bg-ivory xl:hidden">
          <nav className="container-x flex flex-col py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3 py-3 text-base font-medium ${
                  isActive(link.href) ? "bg-white text-ink shadow-soft" : "text-ink-500"
                }`}
              >
                {getLabel(link.label)}
              </Link>
            ))}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {session ? (
                <button onClick={() => signOut()} className="btn-outline">
                  {getLabel({ en: "Sign Out", ar: "تسجيل الخروج", fr: "Déconnexion" })}
                </button>
              ) : (
                <Link href="/login" className="btn-outline">
                  {getLabel({ en: "Sign In", ar: "تسجيل الدخول", fr: "Connexion" })}
                </Link>
              )}
              <Link href="/contact" className="btn-primary">
                {getLabel({ en: "List Property", ar: "أضف عقارك", fr: "Lister" })}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
