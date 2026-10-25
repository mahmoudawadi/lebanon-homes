import Link from "next/link";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { LuArrowUpRight } from "react-icons/lu";
import { Reveal } from "@/components/Motion";

const neighborhoods = [
  {
    name: "Beirut",
    tagline: "The vibrant capital — sea views, culture and city living.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Jounieh",
    tagline: "Bay-side apartments with marina and mountain views.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Dbayeh",
    tagline: "Modern waterfront living minutes from Beirut.",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Metn",
    tagline: "Mountain villas, pine forests and cooler summers.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Byblos",
    tagline: "Historic charm and a relaxed coastal lifestyle.",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Batroun",
    tagline: "Beaches, vineyards and weekend homes by the sea.",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
  },
];

const NeighborhoodsPage = () => {
  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />
      <PageHeader
        eyebrow="Explore Lebanon"
        title="Neighborhoods"
        subtitle="Explore the best neighborhoods in Lebanon and browse the homes available in each."
        crumb="Neighborhoods"
      />

      <section className="section">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {neighborhoods.map((n, i) => (
            <Reveal key={n.name} delay={(i % 3) * 0.08} className={`flex ${i === 0 ? "lg:col-span-2" : ""}`}>
            <Link
              href={`/properties?city=${encodeURIComponent(n.name)}`}
              className="group relative isolate flex min-h-[340px] w-full flex-col justify-end overflow-hidden rounded-3xl p-7 text-white shadow-soft"
            >
              <img
                src={n.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-transparent" />
              <span className="absolute end-6 top-6 grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-white group-hover:text-ink">
                <LuArrowUpRight className="h-5 w-5" />
              </span>
              <h2 className="font-serif text-3xl font-semibold !text-white">{n.name}</h2>
              <p className="mt-1 max-w-sm text-white/75">{n.tagline}</p>
            </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default NeighborhoodsPage;
