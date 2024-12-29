import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

const Hero = () => {
  return (
    <div className="pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Passe ton permis en toute sérénité avec{" "}
            <span className="text-primary">kayva</span>
          </h1>
          <p className="text-xl text-dark/70 mb-8">
            Une formation moderne et adaptée à ton rythme, avec des moniteurs expérimentés
            et une méthode qui a fait ses preuves.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button className="gradient-bg text-white hover:opacity-90 transition-opacity text-lg px-8 py-6">
              Découvrir nos offres
            </Button>
            <Button variant="outline" className="text-lg px-8 py-6 border-2">
              <GraduationCap className="mr-2" />
              En savoir plus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;