import Link from "next/link";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { LuHouse, LuKeyRound, LuBriefcase, LuScale, LuTrendingUp, LuCamera, LuArrowRight } from "react-icons/lu";

const services = [
  { icon: LuHouse, title: "Property Sales", description: "Expert assistance in buying and selling properties with full legal support." },
  { icon: LuKeyRound, title: "Rentals & Leasing", description: "Find tenants or your next rental — vetted listings and clear, fair contracts." },
  { icon: LuBriefcase, title: "Property Management", description: "Comprehensive property management services for landlords and investors." },
  { icon: LuScale, title: "Legal Services", description: "Complete legal documentation and transaction support for all real estate deals." },
  { icon: LuTrendingUp, title: "Investment Advisory", description: "Data-driven guidance on yields, appreciation and the right time to buy or sell." },
  { icon: LuCamera, title: "Marketing & Staging", description: "Professional photography, staging and promotion to sell faster and for more." },
];

const steps = [
  { title: "Consultation", body: "We learn your goals, budget and timeline." },
  { title: "Curated search", body: "We shortlist properties — including off-market ones." },
  { title: "Viewings & negotiation", body: "We arrange visits and negotiate the best terms." },
  { title: "Closing", body: "Our legal team handles contracts and registration." },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />
      <PageHeader
        eyebrow="What we do"
        title="Our Services"
        subtitle="End-to-end real estate services — from your first viewing to the keys in your hand."
        crumb="Services"
      />

      <section className="section">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="card group p-8 transition hover:-translate-y-1 hover:shadow-lift">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brass-50 text-brass-600 transition group-hover:bg-brass group-hover:text-white">
                <service.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
              <p className="mt-2 text-muted">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-ink text-white">
        <div className="container-x">
          <span className="eyebrow !text-brass-400">How it works</span>
          <h2 className="section-title mt-4 !text-white">A simple, guided process</h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="border-t border-white/15 pt-6">
                <span className="font-serif text-4xl text-brass-400">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold !text-white">{step.title}</h3>
                <p className="mt-1 text-white/60">{step.body}</p>
              </li>
            ))}
          </ol>
          <Link href="/contact" className="btn-accent mt-12">
            Book a consultation
            <LuArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ServicesPage;
