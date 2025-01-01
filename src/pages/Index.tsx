import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Offers from "@/components/Offers";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Map from "@/components/Map";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <div className="container mx-auto px-4 py-8">
          <Map />
        </div>
        <Offers />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
};

export default Index;