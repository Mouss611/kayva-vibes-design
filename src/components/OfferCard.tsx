import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface OfferCardProps {
  price: number;
  oldPrice: number;
  months: number;
  hours: number;
}

const OfferCard = ({ price, oldPrice, months, hours }: OfferCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOfferSelection = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          price, 
          months, 
          hours,
          includeCombinedPayment: true // Activer le paiement combiné
        }
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de la session de paiement.",
        });
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la session de paiement.",
      });
    }
  };

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
        <div className="text-sm text-dark/60 mt-2">+ Frais d'inscription uniques de 30€</div>
      </div>
      <Button 
        className="w-full gradient-bg text-white hover:opacity-90 transition-opacity"
        onClick={handleOfferSelection}
      >
        Souscrire maintenant
      </Button>
    </div>
  );
};

export default OfferCard;