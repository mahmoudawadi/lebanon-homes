"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuMail, LuLock, LuArrowRight } from "react-icons/lu";
import toast from "react-hot-toast";
import AuthLayout from "@/components/AuthLayout";

const translations = {
  en: {
    title: "Welcome Back",
    subtitle: "Sign in to your account",
    quote: "Home is where your story begins.",
    email: "Email Address",
    password: "Password",
    login: "Sign In",
    loading: "Signing in…",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    success: "Login successful!",
    failed: "Failed to login",
  },
  ar: {
    title: "مرحباً بعودتك",
    subtitle: "سجل الدخول إلى حسابك",
    quote: "المنزل هو المكان الذي تبدأ فيه قصتك.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    login: "تسجيل الدخول",
    loading: "جارٍ تسجيل الدخول…",
    noAccount: "ليس لديك حساب؟",
    signUp: "إنشاء حساب",
    success: "تم تسجيل الدخول بنجاح!",
    failed: "فشل تسجيل الدخول",
  },
  fr: {
    title: "Bon Retour",
    subtitle: "Connectez-vous à votre compte",
    quote: "La maison est l'endroit où votre histoire commence.",
    email: "Adresse Email",
    password: "Mot de Passe",
    login: "Se Connecter",
    loading: "Connexion…",
    noAccount: "Vous n'avez pas de compte ?",
    signUp: "S'inscrire",
    success: "Connexion réussie !",
    failed: "Échec de la connexion",
  },
};

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success(t.success);
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || t.failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t.title} subtitle={t.subtitle} quote={t.quote}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label" htmlFor="email">{t.email}</label>
          <div className="relative">
            <LuMail className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input !ps-11"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="password">{t.password}</label>
          <div className="relative">
            <LuLock className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input !ps-11"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
          {loading ? t.loading : (
            <>
              {t.login}
              <LuArrowRight className="h-4 w-4 rtl:rotate-180" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        {t.noAccount}{" "}
        <Link href="/signup" className="font-semibold text-ink hover:text-brass-600">
          {t.signUp}
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
