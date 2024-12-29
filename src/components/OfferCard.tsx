import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

interface OfferCardProps {
  price: number;
  oldPrice: number;
  months: number;
  hours: number;
}

const OfferCard = ({ price, oldPrice, months, hours }: OfferCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 card-shadow hover:scale-105 transition-transform">
      <div className="flex justify-center mb-4">
        <Car size={40} className="text-primary" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{hours}h de conduite</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold text-primary">{price}€</span>
        <span className="text-dark/60">/mois</span>
        <div className="text-sm text-dark/60">pendant {months} mois</div>
        <div className="text-sm line-through text-dark/40">au lieu de {oldPrice}€/mois</div>
      </div>
      <Button className="w-full gradient-bg text-white hover:opacity-90 transition-opacity">
        Choisir cette offre
      </Button>
    </div>
  );
};

export default OfferCard;