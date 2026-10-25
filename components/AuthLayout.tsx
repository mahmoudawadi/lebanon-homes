import React from "react";
import { Logo } from "./MainHeader";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  quote: string;
  children: React.ReactNode;
}

// Split-screen layout shared by the sign-in and sign-up pages
const AuthLayout = ({ title, subtitle, quote, children }: AuthLayoutProps) => (
  <div className="grid min-h-screen lg:grid-cols-2">
    <div className="relative hidden overflow-hidden bg-ink lg:block">
      <img
        src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-ink-900/20" />
      <div className="relative flex h-full flex-col justify-between p-12">
        <Logo light />
        <blockquote className="max-w-md font-serif text-3xl leading-snug text-white">&ldquo;{quote}&rdquo;</blockquote>
      </div>
    </div>

    <div className="flex items-center justify-center px-5 py-12 sm:px-8">
      <div className="w-full max-w-md">
        <div className="mb-10 lg:hidden">
          <Logo />
        </div>
        <h1 className="font-serif text-4xl font-semibold">{title}</h1>
        <p className="mt-2 text-muted">{subtitle}</p>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
