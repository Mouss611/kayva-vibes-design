import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface AvailabilityStepProps {
  onNext: (data: { working_days: string[] }) => void;
  data: { working_days: string[] };
}

const AvailabilityStep = ({ onNext, data }: AvailabilityStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Disponibilités</h2>
        </div>
        <p className="text-gray-600">
          Choisis le nombre de jours où tu es disponible pour enseigner. Cela nous aidera à mieux organiser les plannings des élèves !
        </p>
      </div>

      <ToggleGroup
        type="single"
        defaultValue={data.working_days[0]}
        onValueChange={(value) => value && onNext({ working_days: [value] })}
        className="justify-center"
      >
        <ToggleGroupItem value="5-7" className="px-4">
          5/7J 🖐️
        </ToggleGroupItem>
        <ToggleGroupItem value="6-7" className="px-4">
          6/7J ✋
        </ToggleGroupItem>
        <ToggleGroupItem value="7-7" className="px-4">
          7/7J 💪
        </ToggleGroupItem>
        <ToggleGroupItem value="2-7" className="px-4">
          Week-end ⏰
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="flex justify-end">
        <Button onClick={() => onNext({ working_days: data.working_days })}>
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default AvailabilityStep;