"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuMail, LuLock, LuUser, LuPhone, LuArrowRight } from "react-icons/lu";
import toast from "react-hot-toast";
import AuthLayout from "@/components/AuthLayout";

const translations = {
  en: {
    title: "Create Account",
    subtitle: "Join us and start your real estate journey",
    quote: "The right home changes everything.",
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    role: "I am a",
    buyer: "Buyer",
    seller: "Seller",
    signUp: "Create Account",
    creating: "Creating account…",
    haveAccount: "Already have an account?",
    signIn: "Sign In",
    mismatch: "Passwords do not match",
    tooShort: "Password must be at least 6 characters",
    success: "Account created successfully! Please login.",
    failed: "Failed to create account",
  },
  ar: {
    title: "إنشاء حساب",
    subtitle: "انضم إلينا وابدأ رحلتك العقارية",
    quote: "المنزل المناسب يغير كل شيء.",
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    role: "أنا",
    buyer: "مشترٍ",
    seller: "بائع",
    signUp: "إنشاء حساب",
    creating: "جارٍ إنشاء الحساب…",
    haveAccount: "لديك حساب بالفعل؟",
    signIn: "تسجيل الدخول",
    mismatch: "كلمتا المرور غير متطابقتين",
    tooShort: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
    success: "تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.",
    failed: "فشل إنشاء الحساب",
  },
  fr: {
    title: "Créer un Compte",
    subtitle: "Rejoignez-nous et commencez votre parcours immobilier",
    quote: "La bonne maison change tout.",
    name: "Nom Complet",
    email: "Adresse Email",
    phone: "Numéro de Téléphone",
    password: "Mot de Passe",
    confirmPassword: "Confirmer le Mot de Passe",
    role: "Je suis",
    buyer: "Acheteur",
    seller: "Vendeur",
    signUp: "Créer un Compte",
    creating: "Création…",
    haveAccount: "Vous avez déjà un compte ?",
    signIn: "Se Connecter",
    mismatch: "Les mots de passe ne correspondent pas",
    tooShort: "Le mot de passe doit contenir au moins 6 caractères",
    success: "Compte créé ! Veuillez vous connecter.",
    failed: "Échec de la création du compte",
  },
};

const SignupPage = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "buyer" as "buyer" | "seller",
  });

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error(t.mismatch);
      return;
    }

    if (formData.password.length < 6) {
      toast.error(t.tooShort);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.failed);
      }

      toast.success(t.success);
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || t.failed);
    } finally {
      setLoading(false);
    }
  };

  const field = (
    key: "name" | "email" | "phone" | "password" | "confirmPassword",
    label: string,
    Icon: React.ElementType,
    props: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <div>
      <label className="label" htmlFor={key}>{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          id={key}
          value={formData[key]}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
          className="input !ps-11"
          {...props}
        />
      </div>
    </div>
  );

  return (
    <AuthLayout title={t.title} subtitle={t.subtitle} quote={t.quote}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <span className="label">{t.role}</span>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-white p-1 ring-1 ring-line">
            {(["buyer", "seller"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setFormData({ ...formData, role })}
                className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                  formData.role === role ? "bg-ink text-white" : "text-muted hover:text-ink"
                }`}
              >
                {role === "buyer" ? t.buyer : t.seller}
              </button>
            ))}
          </div>
        </div>

        {field("name", t.name, LuUser, { type: "text", required: true, autoComplete: "name", placeholder: "John Doe" })}
        {field("email", t.email, LuMail, { type: "email", required: true, autoComplete: "email", placeholder: "your@email.com" })}
        {field("phone", t.phone, LuPhone, { type: "tel", autoComplete: "tel", placeholder: "+961 1 234 567" })}
        <div className="grid gap-5 sm:grid-cols-2">
          {field("password", t.password, LuLock, { type: "password", required: true, autoComplete: "new-password", placeholder: "••••••••" })}
          {field("confirmPassword", t.confirmPassword, LuLock, { type: "password", required: true, autoComplete: "new-password", placeholder: "••••••••" })}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
          {loading ? t.creating : (
            <>
              {t.signUp}
              <LuArrowRight className="h-4 w-4 rtl:rotate-180" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        {t.haveAccount}{" "}
        <Link href="/login" className="font-semibold text-ink hover:text-brass-600">
          {t.signIn}
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;
