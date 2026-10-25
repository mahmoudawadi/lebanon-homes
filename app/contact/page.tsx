"use client";

import React, { useState } from "react";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { LuMail, LuPhone, LuMapPin, LuClock, LuSend } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";

const contactDetails = [
  { icon: LuMapPin, label: "Office", value: "Beirut, Lebanon" },
  { icon: LuPhone, label: "Phone", value: "+961 1 234 567", href: "tel:+9611234567" },
  { icon: LuMail, label: "Email", value: "info@lebestate.com", href: "mailto:info@lebestate.com" },
  { icon: LuClock, label: "Hours", value: "Mon – Sat, 9:00 – 18:00" },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [key]: e.target.value });

  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />
      <PageHeader
        eyebrow="Get in touch"
        title="Contact Us"
        subtitle="Buying, selling, renting or listing — tell us what you need and an advisor will reply within one business day."
        crumb="Contact"
      />

      <div className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="font-serif text-3xl font-semibold">We&apos;d love to hear from you</h2>
          <p className="mt-3 text-muted">Visit our Beirut office, call us, or send a message using the form.</p>

          <ul className="mt-8 space-y-4">
            {contactDetails.map((item) => (
              <li key={item.label} className="card flex items-center gap-4 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brass-50 text-brass-600">
                  <item.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-muted">{item.label}</span>
                  {item.href ? (
                    <a href={item.href} className="font-semibold hover:text-brass-600" dir="ltr">{item.value}</a>
                  ) : (
                    <span className="font-semibold">{item.value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <a
            href="https://wa.me/9611234567"
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-6 w-full bg-[#25D366] text-white hover:bg-[#1fb658]"
          >
            <FaWhatsapp className="h-5 w-5" />
            Chat with us on WhatsApp
          </a>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 md:p-10">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">Name</label>
              <input id="name" type="text" required value={formData.name} onChange={update("name")} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" required value={formData.email} onChange={update("email")} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" type="tel" value={formData.phone} onChange={update("phone")} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="subject">Subject</label>
              <input id="subject" type="text" value={formData.subject} onChange={update("subject")} className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="message">Message</label>
              <textarea id="message" required rows={6} value={formData.message} onChange={update("message")} className="input resize-none" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full !py-3.5 sm:w-auto">
            <LuSend className="h-4 w-4" />
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
