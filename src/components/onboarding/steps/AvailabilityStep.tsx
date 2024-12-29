import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Sun, Sunrise, Moon, Calendar } from "lucide-react";

type Availability = "morning" | "afternoon" | "evening" | "weekend";

interface AvailabilityStepProps {
  onNext: (data: { availability: Availability[] }) => void;
  data: { availability: Availability[] };
}

const AvailabilityStep = ({ onNext, data }: AvailabilityStepProps) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>(
    data.availability || []
  );

  const toggleAvailability = (value: Availability) => {
    if (availabilities.includes(value)) {
      setAvailabilities(availabilities.filter((a) => a !== value));
    } else {
      setAvailabilities([...availabilities, value]);
    }
  };

  const handleNext = () => {
    onNext({ availability: availabilities });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">
          Quand es-tu le plus disponible ?
        </h2>
        <p className="text-gray-500">
          Sélectionne tous les créneaux qui te conviennent
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="relative p-4 cursor-pointer hover:border-primary transition-colors">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="morning"
              checked={availabilities.includes("morning")}
              onCheckedChange={() => toggleAvailability("morning")}
            />
            <Label htmlFor="morning" className="flex items-center space-x-2 cursor-pointer">
              <Sunrise className="h-4 w-4 text-primary" />
              <span>Matin</span>
            </Label>
          </div>
        </Card>

        <Card className="relative p-4 cursor-pointer hover:border-primary transition-colors">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="afternoon"
              checked={availabilities.includes("afternoon")}
              onCheckedChange={() => toggleAvailability("afternoon")}
            />
            <Label htmlFor="afternoon" className="flex items-center space-x-2 cursor-pointer">
              <Sun className="h-4 w-4 text-primary" />
              <span>Après-midi</span>
            </Label>
          </div>
        </Card>

        <Card className="relative p-4 cursor-pointer hover:border-primary transition-colors">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="evening"
              checked={availabilities.includes("evening")}
              onCheckedChange={() => toggleAvailability("evening")}
            />
            <Label htmlFor="evening" className="flex items-center space-x-2 cursor-pointer">
              <Moon className="h-4 w-4 text-primary" />
              <span>Soirée</span>
            </Label>
          </div>
        </Card>

        <Card className="relative p-4 cursor-pointer hover:border-primary transition-colors">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="weekend"
              checked={availabilities.includes("weekend")}
              onCheckedChange={() => toggleAvailability("weekend")}
            />
            <Label htmlFor="weekend" className="flex items-center space-x-2 cursor-pointer">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Week-end</span>
            </Label>
          </div>
        </Card>
      </div>

      <p className="text-sm text-gray-500 text-center">
        On fera tout pour respecter tes disponibilités. Si jamais ce n'est pas possible,
        ton moniteur te proposera un créneau adapté. Merci pour ta compréhension ! 🙏
      </p>

      <Button
        onClick={handleNext}
        className="w-full gradient-bg"
        disabled={availabilities.length === 0}
      >
        Continuer
      </Button>
    </div>
  );
};

export default AvailabilityStep;