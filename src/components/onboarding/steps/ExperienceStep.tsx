import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Check, X } from "lucide-react";

interface ExperienceStepProps {
  onNext: (data: { driving_experience: boolean }) => void;
  data: { driving_experience: boolean };
}

const ExperienceStep = ({ onNext, data }: ExperienceStepProps) => {
  const [experience, setExperience] = useState<boolean>(data.driving_experience);

  const handleNext = () => {
    onNext({ driving_experience: experience });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">
          As-tu déjà conduit un véhicule ?
        </h2>
        <p className="text-gray-500">Cela nous aidera à adapter ton apprentissage</p>
      </div>

      <RadioGroup
        value={experience ? "yes" : "no"}
        onValueChange={(value) => setExperience(value === "yes")}
        className="grid gap-4"
      >
        <Card className="relative flex items-center space-x-4 p-4 cursor-pointer hover:border-primary transition-colors">
          <RadioGroupItem value="yes" id="yes" />
          <Label htmlFor="yes" className="flex items-center space-x-3 cursor-pointer">
            <Check className="h-5 w-5 text-green-500" />
            <span>Oui, un peu</span>
          </Label>
        </Card>

        <Card className="relative flex items-center space-x-4 p-4 cursor-pointer hover:border-primary transition-colors">
          <RadioGroupItem value="no" id="no" />
          <Label htmlFor="no" className="flex items-center space-x-3 cursor-pointer">
            <X className="h-5 w-5 text-red-500" />
            <span>Non, jamais</span>
          </Label>
        </Card>
      </RadioGroup>

      <Button onClick={handleNext} className="w-full gradient-bg">
        Continuer
      </Button>
    </div>
  );
};

export default ExperienceStep;