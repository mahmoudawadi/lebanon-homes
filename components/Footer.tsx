"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { LuMail, LuPhone, LuMapPin, LuArrowRight } from "react-icons/lu";
import { Logo } from "./MainHeader";

const translations = {
  en: {
    ctaTitle: "Ready to find your next home?",
    ctaBody: "Talk to an advisor today — we'll match you with properties that fit your life and budget.",
    ctaButton: "Browse properties",
    ctaSecondary: "Contact an advisor",
    about: "Lebanon's trusted real estate partner for buying, renting and investing — from Beirut to the coast and the mountains.",
    explore: "Explore",
    company: "Company",
    contact: "Contact",
    properties: "Properties",
    neighborhoods: "Neighborhoods",
    insights: "Market Insights",
    agents: "Our Agents",
    aboutUs: "About Us",
    services: "Services",
    contactUs: "Contact Us",
    newsletter: "Newsletter",
    newsletterBody: "Monthly market notes and new listings, straight to your inbox.",
    newsletterPlaceholder: "Enter your email",
    subscribe: "Subscribe",
    subscribed: "Thanks for subscribing!",
    subscribeError: "Could not subscribe. Please try again.",
    rights: "All rights reserved.",
  },
  ar: {
    ctaTitle: "هل أنت مستعد للعثور على منزلك القادم؟",
    ctaBody: "تحدث إلى مستشار اليوم — سنجد لك عقارات تناسب حياتك وميزانيتك.",
    ctaButton: "تصفح العقارات",
    ctaSecondary: "تواصل مع مستشار",
    about: "شريكك العقاري الموثوق في لبنان للشراء والإيجار والاستثمار — من بيروت إلى الساحل والجبل.",
    explore: "استكشف",
    company: "الشركة",
    contact: "اتصل بنا",
    properties: "العقارات",
    neighborhoods: "الأحياء",
    insights: "رؤى السوق",
    agents: "وكلاؤنا",
    aboutUs: "من نحن",
    services: "الخدمات",
    contactUs: "اتصل بنا",
    newsletter: "النشرة الإخبارية",
    newsletterBody: "ملاحظات شهرية عن السوق وأحدث العقارات في بريدك.",
    newsletterPlaceholder: "أدخل بريدك الإلكتروني",
    subscribe: "اشترك",
    subscribed: "شكراً لاشتراكك!",
    subscribeError: "تعذر الاشتراك. حاول مرة أخرى.",
    rights: "جميع الحقوق محفوظة.",
  },
  fr: {
    ctaTitle: "Prêt à trouver votre prochaine maison ?",
    ctaBody: "Parlez à un conseiller aujourd'hui — nous trouverons les biens adaptés à votre vie et votre budget.",
    ctaButton: "Voir les propriétés",
    ctaSecondary: "Contacter un conseiller",
    about: "Votre partenaire immobilier de confiance au Liban pour acheter, louer et investir — de Beyrouth à la côte et la montagne.",
    explore: "Explorer",
    company: "Entreprise",
    contact: "Contact",
    properties: "Propriétés",
    neighborhoods: "Quartiers",
    insights: "Aperçus du Marché",
    agents: "Nos Agents",
    aboutUs: "À Propos",
    services: "Services",
    contactUs: "Nous Contacter",
    newsletter: "Newsletter",
    newsletterBody: "Notes de marché mensuelles et nouvelles annonces dans votre boîte mail.",
    newsletterPlaceholder: "Entrez votre email",
    subscribe: "S'abonner",
    subscribed: "Merci pour votre inscription !",
    subscribeError: "Inscription impossible. Réessayez.",
    rights: "Tous droits réservés.",
  },
};

const socials = [
  { href: "https://facebook.com", label: "Facebook", icon: FaFacebookF },
  { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedinIn },
  { href: "https://x.com", label: "X", icon: FaXTwitter },
  { href: "https://youtube.com", label: "YouTube", icon: FaYoutube },
];

const Footer = () => {
  const { language, isRTL } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const t = translations[language];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      toast.success(t.subscribed);
      setEmail("");
    } catch {
      toast.error(t.subscribeError);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: t.explore,
      links: [
        { href: "/properties", label: t.properties },
        { href: "/neighborhoods", label: t.neighborhoods },
        { href: "/insights", label: t.insights },
      ],
    },
    {
      title: t.company,
      links: [
        { href: "/about", label: t.aboutUs },
        { href: "/agents", label: t.agents },
        { href: "/services", label: t.services },
        { href: "/contact", label: t.contactUs },
      ],
    },
  ];

  return (
    <footer className="bg-ink-900 text-white/70">
      {/* Call to action */}
      <div className="container-x pt-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brass-600 to-brass-700 px-8 py-12 md:px-14 md:py-16">
          <div className="pointer-events-none absolute -end-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-serif text-3xl font-semibold !text-white md:text-4xl">{t.ctaTitle}</h2>
              <p className="mt-3 text-white/80">{t.ctaBody}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/properties" className="btn bg-white text-ink hover:bg-ivory">
                {t.ctaButton}
                <LuArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link href="/contact" className="btn-ghost-light">
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.3fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{t.about}</p>
          <div className="mt-6 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/70 transition hover:border-brass hover:bg-brass hover:text-white"
              >
                <s.icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] !text-white">{col.title}</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-brass-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] !text-white">{t.newsletter}</h3>
          <p className="mt-5 text-sm">{t.newsletterBody}</p>
          <form onSubmit={handleNewsletterSubmit} className="mt-4 flex rounded-full bg-white/5 p-1 ring-1 ring-white/10 focus-within:ring-brass">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.newsletterPlaceholder}
              required
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/40 focus:outline-none"
              dir={isRTL ? "rtl" : "ltr"}
            />
            <button type="submit" disabled={submitting} className="btn-accent !px-5 !py-2.5">
              {t.subscribe}
            </button>
          </form>

          <ul className="mt-8 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <LuMapPin className="h-4 w-4 text-brass-400" /> Beirut, Lebanon
            </li>
            <li className="flex items-center gap-3">
              <LuPhone className="h-4 w-4 text-brass-400" />
              <a href="tel:+9611234567" dir="ltr" className="hover:text-white">+961 1 234 567</a>
            </li>
            <li className="flex items-center gap-3">
              <LuMail className="h-4 w-4 text-brass-400" />
              <a href="mailto:info@lebestate.com" className="hover:text-white">info@lebestate.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} LebEstate. {t.rights}</p>
          <p>Beirut · Jounieh · Byblos · Batroun</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
