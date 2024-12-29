import OfferCard from "./OfferCard";
import { Calendar } from "lucide-react";

const Offers = () => {
  return (
    <div className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nos offres de lancement
          </h2>
          <p className="text-dark/60 flex items-center justify-center gap-2">
            <Calendar size={18} />
            Offres valables jusqu'au 6 juin 2025
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <OfferCard price={79.99} oldPrice={99.99} months={6} hours={24} />
          <OfferCard price={129.99} oldPrice={149.99} months={3} hours={24} />
          <OfferCard price={179.99} oldPrice={199.99} months={3} hours={36} />
        </div>
      </div>
    </div>
  );
};

export default Offers;