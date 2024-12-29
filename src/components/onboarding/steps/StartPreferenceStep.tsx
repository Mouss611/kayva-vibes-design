import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CalendarClock, CalendarDays, Calendar } from "lucide-react";

type StartPreference = "as_soon_as_possible" | "next_week" | "later";

interface StartPreferenceStepProps {
  onNext: (data: { start_preference: StartPreference }) => void;
  data: { start_preference: StartPreference };
}

const StartPreferenceStep = ({ onNext, data }: StartPreferenceStepProps) => {
  const [preference, setPreference] = useState<StartPreference>(
    data.start_preference || "as_soon_as_possible"
  );

  const handleNext = () => {
    onNext({ start_preference: preference });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">
          Quand aimerais-tu commencer ?
        </h2>
        <p className="text-gray-500">Pour planifier au mieux ton apprentissage</p>
      </div>

      <RadioGroup
        value={preference}
        onValueChange={(value: StartPreference) => setPreference(value)}
        className="grid gap-4"
      >
        <Card className="relative flex items-center space-x-4 p-4 cursor-pointer hover:border-primary transition-colors">
          <RadioGroupItem value="as_soon_as_possible" id="asap" />
          <Label htmlFor="asap" className="flex items-center space-x-3 cursor-pointer">
            <CalendarClock className="h-5 w-5 text-primary" />
            <span>Dès que possible !</span>
          </Label>
        </Card>

        <Card className="relative flex items-center space-x-4 p-4 cursor-pointer hover:border-primary transition-colors">
          <RadioGroupItem value="next_week" id="next_week" />
          <Label htmlFor="next_week" className="flex items-center space-x-3 cursor-pointer">
            <CalendarDays className="h-5 w-5 text-primary" />
            <span>La semaine prochaine</span>
          </Label>
        </Card>

        <Card className="relative flex items-center space-x-4 p-4 cursor-pointer hover:border-primary transition-colors">
          <RadioGroupItem value="later" id="later" />
          <Label htmlFor="later" className="flex items-center space-x-3 cursor-pointer">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Plus tard, je planifierai</span>
          </Label>
        </Card>
      </RadioGroup>

      <Button onClick={handleNext} className="w-full gradient-bg">
        Continuer
      </Button>
    </div>
  );
};

export default StartPreferenceStep;