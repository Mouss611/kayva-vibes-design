import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

const CTA = () => {
  return (
    <div className="py-20 gradient-bg text-white">
      <div className="container mx-auto px-4 text-center">
        <Award size={48} className="mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Prêt à commencer l'aventure ?
        </h2>
        <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
          Rejoins kayva aujourd'hui et bénéficie de nos offres de lancement exclusives.
          Ton permis n'attend que toi !
        </p>
        <Button size="lg" variant="secondary" className="text-primary hover:text-primary-dark transition-colors">
          Je m'inscris maintenant
        </Button>
      </div>
    </div>
  );
};

export default CTA;