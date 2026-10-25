import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import AIMarketInsights from "@/components/AIMarketInsights";
import MarketPulse from "@/components/MarketPulse";

const notes = [
  {
    tag: "Buying",
    title: "Sea-view apartments keep their premium",
    body: "Coastal units in Beirut and Jounieh continue to command higher prices per m², with solar and generator backup now expected by most buyers.",
  },
  {
    tag: "Renting",
    title: "Furnished rentals in demand",
    body: "Short- and mid-term furnished rentals near Beirut's business districts see strong occupancy from returning expats and professionals.",
  },
  {
    tag: "Investing",
    title: "Mountain villas as second homes",
    body: "Metn and Kesrouan villas attract buyers looking for space and cooler summers, with rental yields peaking in the summer season.",
  },
];

const InsightsPage = () => {
  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />
      <PageHeader
        eyebrow="Research"
        title="Market Insights"
        subtitle="The latest market insights, trends, and analysis of the Lebanese real estate market."
        crumb="Insights"
      />
      <MarketPulse />
      <AIMarketInsights />

      <section className="section">
        <div className="container-x">
          <span className="eyebrow">Market notes</span>
          <h2 className="section-title mt-4">What we&apos;re seeing</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {notes.map((note) => (
              <article key={note.title} className="card p-8">
                <span className="chip bg-brass-50 text-brass-700">{note.tag}</span>
                <h3 className="mt-5 font-serif text-2xl font-semibold leading-snug">{note.title}</h3>
                <p className="mt-3 text-muted">{note.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default InsightsPage;
