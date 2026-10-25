import Link from "next/link";
import StickyTopBar from "@/components/StickyTopBar";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { LuArrowRight } from "react-icons/lu";

const stats = [
  { value: "500+", label: "Properties Sold" },
  { value: "15+", label: "Years Experience" },
  { value: "1000+", label: "Happy Clients" },
];

const values = [
  { title: "Transparency", body: "Clear pricing, honest advice and full documentation at every step." },
  { title: "Local expertise", body: "Agents who live and work in the neighborhoods they represent." },
  { title: "International standards", body: "Service and legal rigor that meet the expectations of global clients." },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <StickyTopBar />
      <MainHeader />
      <PageHeader
        eyebrow="Our story"
        title="About Us"
        subtitle="Helping families and investors find their place in Lebanon for over fifteen years."
        crumb="About"
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="section">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Who we are</span>
            <h2 className="section-title mt-4">A modern agency rooted in Lebanon</h2>
            <p className="mt-6 leading-relaxed text-ink-600">
              LebEstate is a Lebanese real estate agency specializing in residential and commercial properties
              across Beirut, the coast and the mountains. With over 15 years of experience, we have helped
              thousands of clients find their dream homes and make profitable investments.
            </p>
            <p className="mt-4 leading-relaxed text-ink-600">
              Our team of expert agents combines deep local market knowledge with international standards of
              service, ensuring every transaction is smooth, transparent, and successful.
            </p>
            <Link href="/agents" className="btn-primary group mt-8">
              Meet the team
              <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
              alt=""
              className="aspect-[3/4] w-full rounded-2xl object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80"
              alt=""
              className="mt-12 aspect-[3/4] w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="container-x grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="py-12 text-center">
              <div className="font-serif text-5xl font-semibold text-brass">{stat.value}</div>
              <div className="mt-2 text-sm uppercase tracking-wider text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <span className="eyebrow">What guides us</span>
          <h2 className="section-title mt-4">Our values</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <div key={v.title} className="card p-8">
                <span className="font-serif text-3xl text-brass">0{i + 1}</span>
                <h3 className="mt-4 text-xl font-semibold">{v.title}</h3>
                <p className="mt-2 text-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutPage;
