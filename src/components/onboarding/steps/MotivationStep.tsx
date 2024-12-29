import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Car, GraduationCap, Gamepad2 } from "lucide-react";

interface MotivationStepProps {
  onNext: (data: { driving_motivation: string }) => void;
  data: { driving_motivation: string };
}

const MotivationStep = ({ onNext, data }: MotivationStepProps) => {
  const [motivation, setMotivation] = useState(data.driving_motivation);
  const [otherMotivation, setOtherMotivation] = useState("");

  const handleNext = () => {
    if (motivation === "other") {
      onNext({ driving_motivation: otherMotivation });
    } else {
      onNext({ driving_motivation: motivation });
    }
  };

  const isValid = motivation === "other" ? !!otherMotivation : !!motivation;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">
          Pourquoi veux-tu passer ton permis ?
        </h2>
        <p className="text-gray-500">Cette information nous aidera à personnaliser ton parcours</p>
      </div>

      <RadioGroup
        value={motivation}
        onValueChange={setMotivation}
        className="grid gap-4"
      >
        <Card className="relative flex items-center space-x-4 p-4 cursor-pointer hover:border-primary transition-colors">
          <RadioGroupItem value="independence" id="independence" className="peer" />
          <Label htmlFor="independence" className="flex items-center space-x-3 cursor-pointer">
            <Car className="h-5 w-5 text-primary" />
            <span>Pour gagner en indépendance</span>
          </Label>
        </Card>

        <Card className="relative flex items-center space-x-4 p-4 cursor-pointer hover:border-primary transition-colors">
          <RadioGroupItem value="studies_work" id="studies_work" />
          <Label htmlFor="studies_work" className="flex items-center space-x-3 cursor-pointer">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span>Pour mes études ou mon travail</span>
          </Label>
        </Card>

        <Card className="relative flex items-center space-x-4 p-4 cursor-pointer hover:border-primary transition-colors">
          <RadioGroupItem value="learn" id="learn" />
          <Label htmlFor="learn" className="flex items-center space-x-3 cursor-pointer">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <span>J'aimerais apprendre à conduire</span>
          </Label>
        </Card>

        <Card className="relative flex items-center space-x-4 p-4 cursor-pointer hover:border-primary transition-colors">
          <RadioGroupItem value="other" id="other" />
          <Label htmlFor="other" className="flex items-center space-x-3 cursor-pointer">
            <span>Autre raison</span>
          </Label>
        </Card>
      </RadioGroup>

      {motivation === "other" && (
        <Input
          placeholder="Ta raison..."
          value={otherMotivation}
          onChange={(e) => setOtherMotivation(e.target.value)}
          className="mt-4"
        />
      )}

      <Button
        onClick={handleNext}
        className="w-full gradient-bg"
        disabled={!isValid}
      >
        Continuer
      </Button>
    </div>
  );
};

export default MotivationStep;