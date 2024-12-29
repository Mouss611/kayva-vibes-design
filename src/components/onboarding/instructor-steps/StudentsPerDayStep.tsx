import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { User } from "lucide-react";
import { useState } from "react";

interface StudentsPerDayStepProps {
  onNext: (data: { students_per_day: number }) => void;
  data: { students_per_day: number };
}

const StudentsPerDayStep = ({ onNext, data }: StudentsPerDayStepProps) => {
  const [studentsPerDay, setStudentsPerDay] = useState<number>(data.students_per_day);

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

      <ToggleGroup
        type="single"
        value={studentsPerDay.toString()}
        onValueChange={(value) => value && setStudentsPerDay(parseInt(value))}
        className="justify-center"
      >
        <ToggleGroupItem 
          value="8" 
          className="px-6 py-3 rounded-full transition-all duration-200 data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:shadow-lg hover:bg-primary/10"
        >
          8 élèves/jour 👶
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="9" 
          className="px-6 py-3 rounded-full transition-all duration-200 data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:shadow-lg hover:bg-primary/10"
        >
          9 élèves/jour 👦
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="10" 
          className="px-6 py-3 rounded-full transition-all duration-200 data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:shadow-lg hover:bg-primary/10"
        >
          10 élèves/jour 👨‍🏫
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="flex justify-end">
        <Button onClick={() => onNext({ students_per_day: studentsPerDay })}>
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default StudentsPerDayStep;