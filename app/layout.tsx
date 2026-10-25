import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import SessionProvider from "@/components/SessionProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import AIChatbot from "@/components/AIChatbot";
import { Toaster } from "react-hot-toast";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LebEstate | Buy & Rent Properties in Lebanon",
  description: "Find your perfect property in Lebanon. Browse apartments, villas, and commercial spaces for sale and rent. Your trusted real estate partner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <SessionProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <AuthProvider>
                {children}
                <WhatsAppButton />
                <AIChatbot />
                <Toaster
                  position="top-right"
                  toastOptions={{ style: { borderRadius: "12px", background: "#0f1b2d", color: "#fff", fontSize: "14px" } }}
                />
              </AuthProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

