import React from "react";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumb?: string;
  image?: string;
  children?: React.ReactNode;
}

// Title band used at the top of inner pages
const PageHeader = ({ eyebrow, title, subtitle, crumb, image, children }: PageHeaderProps) => (
  <section className="relative isolate overflow-hidden bg-ink text-white">
    {image && (
      <>
        <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-900 via-ink-900/80 to-ink-900/40" />
      </>
    )}
    <div className="pointer-events-none absolute -end-32 -top-32 -z-10 h-80 w-80 rounded-full bg-brass/20 blur-3xl" />
    <div className="container-x py-14 md:py-20">
      {crumb && (
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/50" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white">Home</Link>
          <LuChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
          <span className="text-white/80">{crumb}</span>
        </nav>
      )}
      {eyebrow && <span className="eyebrow !text-brass-400">{eyebrow}</span>}
      <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight !text-white md:text-5xl">{title}</h1>
      {subtitle && <p className="mt-4 max-w-2xl text-base text-white/65 md:text-lg">{subtitle}</p>}
      {children}
    </div>
  </section>
);

export default PageHeader;
