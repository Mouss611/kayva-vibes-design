import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LocationStepProps {
  onNext: (data: { preferred_location: string }) => void;
  data: { preferred_location: string };
}

const LocationStep = ({ onNext, data }: LocationStepProps) => {
  const [location, setLocation] = useState(data.preferred_location);
  const { toast } = useToast();

  const handleNext = () => {
    if (!location) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une zone d'activité",
      });
      return;
    }
    onNext({ preferred_location: location });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Zone d'activité</h2>
        </div>
        <p className="text-gray-600">
          Sélectionne les zones où tu souhaites enseigner. Plus tu es flexible, plus tu pourras accueillir d'élèves. 📈
        </p>
      </div>

      <Select
        value={location}
        onValueChange={setLocation}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionne ta zone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ile-de-france">Île-de-France</SelectItem>
          <SelectItem value="auvergne-rhone-alpes">Auvergne-Rhône-Alpes</SelectItem>
          <SelectItem value="provence-alpes-cote-azur">Provence-Alpes-Côte d'Azur</SelectItem>
          <SelectItem value="occitanie">Occitanie</SelectItem>
          <SelectItem value="nouvelle-aquitaine">Nouvelle-Aquitaine</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={!location}
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default LocationStep;