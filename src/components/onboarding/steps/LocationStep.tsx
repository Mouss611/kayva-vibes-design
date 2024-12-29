import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { MapPin } from "lucide-react";

interface LocationStepProps {
  onNext: (data: { city: string; postal_code: string; max_distance: number }) => void;
  data: { city: string; postal_code: string; max_distance: number };
}

const LocationStep = ({ onNext, data }: LocationStepProps) => {
  const [city, setCity] = useState(data.city);
  const [postalCode, setPostalCode] = useState(data.postal_code);
  const [maxDistance, setMaxDistance] = useState(data.max_distance || 5);

  const handleNext = () => {
    onNext({
      city,
      postal_code: postalCode,
      max_distance: maxDistance,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Où souhaites-tu conduire ?</h2>
        <p className="text-gray-500">Pour te trouver le moniteur le plus proche</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="city">Dans quelle ville ?</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="pl-10"
              placeholder="Ta ville"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal_code">Code postal</Label>
          <Input
            id="postal_code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Code postal"
          />
        </div>

        <div className="space-y-4">
          <Label>Distance maximale</Label>
          <Slider
            value={[maxDistance]}
            onValueChange={(value) => setMaxDistance(value[0])}
            max={15}
            step={5}
            className="my-4"
          />
          <p className="text-sm text-gray-500 text-center">
            Distance maximale : {maxDistance} km
          </p>
          <p className="text-sm text-gray-500 text-center">
            Pas de souci si les moniteurs de ta ville sont overbookés ! On te proposera
            des créneaux avec des moniteurs disponibles dans un rayon proche. 😊
          </p>
        </div>
      </div>

      <Button
        onClick={handleNext}
        className="w-full gradient-bg"
        disabled={!city || !postalCode}
      >
        Continuer
      </Button>
    </div>
  );
};

export default LocationStep;