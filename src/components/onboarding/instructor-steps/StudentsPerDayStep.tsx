import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface StudentsPerDayStepProps {
  onNext: (data: { students_per_day: number }) => void;
  data: { students_per_day: number };
}

const StudentsPerDayStep = ({ onNext, data }: StudentsPerDayStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Nombre d'élèves par jour</h2>
        </div>
        <p className="text-gray-600">
          Choisis un nombre d'élèves que tu peux gérer confortablement tout en maintenant une bonne qualité d'enseignement.
        </p>
      </div>

      <RadioGroup
        defaultValue={data.students_per_day.toString()}
        onValueChange={(value) => onNext({ students_per_day: parseInt(value) })}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="8" id="r1" />
          <Label htmlFor="r1">8 élèves/jour 👶</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="9" id="r2" />
          <Label htmlFor="r2">9 élèves/jour 👦</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="10" id="r3" />
          <Label htmlFor="r3">10 élèves/jour 👨‍🏫</Label>
        </div>
      </RadioGroup>

      <div className="flex justify-end">
        <Button onClick={() => onNext({ students_per_day: data.students_per_day })}>
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default StudentsPerDayStep;