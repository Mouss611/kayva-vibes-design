import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AvailabilityStepProps {
  onNext: (data: { working_days: string[] }) => void;
  data: { working_days: string[] };
}

const AvailabilityStep = ({ onNext, data }: AvailabilityStepProps) => {
  const [workingDays, setWorkingDays] = useState<string[]>(data.working_days);
  const { toast } = useToast();

  const handleNext = () => {
    if (!workingDays.length) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner vos disponibilités",
      });
      return;
    }
    onNext({ working_days: workingDays });
  };

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
        value={workingDays[0]}
        onValueChange={(value) => value && setWorkingDays([value])}
        className="justify-center"
      >
        <ToggleGroupItem 
          value="5-7" 
          className="px-6 py-3 rounded-full transition-all duration-200 data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:shadow-lg hover:bg-primary/10"
        >
          5/7J 🖐️
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="6-7" 
          className="px-6 py-3 rounded-full transition-all duration-200 data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:shadow-lg hover:bg-primary/10"
        >
          6/7J ✋
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="7-7" 
          className="px-6 py-3 rounded-full transition-all duration-200 data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:shadow-lg hover:bg-primary/10"
        >
          7/7J 💪
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="2-7" 
          className="px-6 py-3 rounded-full transition-all duration-200 data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:shadow-lg hover:bg-primary/10"
        >
          Week-end ⏰
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={!workingDays.length}
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default AvailabilityStep;