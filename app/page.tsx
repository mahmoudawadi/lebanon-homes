import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import HeroSection from "@/components/HeroSection";
import FeaturedListings from "@/components/FeaturedListings";
import WhyChooseUs from "@/components/WhyChooseUs";
import MarketPulse from "@/components/MarketPulse";
import AIMarketInsights from "@/components/AIMarketInsights";
import Testimonials from "@/components/Testimonials";
import AIPropertyRecommendations from "@/components/AIPropertyRecommendations";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <StickyTopBar />
      <MainHeader />
      <HeroSection />
      <MarketPulse />
      <FeaturedListings />
      <AIPropertyRecommendations />
      <WhyChooseUs />
      <AIMarketInsights />
      <Testimonials />
      <Footer />
    </main>
  );
}
