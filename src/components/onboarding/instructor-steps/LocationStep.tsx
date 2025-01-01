import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import LocationAutocomplete from "@/components/LocationAutocomplete";

interface LocationStepProps {
  onNext: (data: { 
    preferred_location: string;
    city: string;
    postal_code: string;
    coordinates: { lat: number; lng: number; }
  }) => void;
  data: { 
    preferred_location: string;
    city?: string;
    postal_code?: string;
    coordinates?: { lat: number; lng: number; }
  };
}

const LocationStep = ({ onNext, data }: LocationStepProps) => {
  const [location, setLocation] = useState(data.preferred_location);
  const [cityData, setCityData] = useState({
    city: data.city || "",
    postal_code: data.postal_code || "",
    coordinates: data.coordinates || { lat: 0, lng: 0 }
  });
  const { toast } = useToast();

  const handleNext = () => {
    if (!location || !cityData.city) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une zone d'activité et une ville",
      });
      return;
    }
    onNext({ 
      preferred_location: location,
      city: cityData.city,
      postal_code: cityData.postal_code,
      coordinates: cityData.coordinates
    });
  };

  const handleLocationSelect = (locationData: {
    city: string;
    postal_code: string;
    lat: number;
    lng: number;
  }) => {
    setCityData({
      city: locationData.city,
      postal_code: locationData.postal_code,
      coordinates: { lat: locationData.lat, lng: locationData.lng }
    });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
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

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Ville principale</label>
        <LocationAutocomplete
          onLocationSelect={handleLocationSelect}
          defaultValue={cityData.city}
          className="w-full"
        />
        {cityData.city && (
          <p className="text-sm text-green-600">
            Ville sélectionnée : {cityData.city}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={!location || !cityData.city}
          className="gradient-bg"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default LocationStep;