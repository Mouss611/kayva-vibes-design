import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface IncomeEstimateStepProps {
  onNext: (data: { estimated_income_range: { min: number; max: number } }) => void;
  data: { estimated_income_range: { min: number; max: number } };
}

const IncomeEstimateStep = ({ onNext, data }: IncomeEstimateStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Estimation des revenus</h2>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">
            En fonction de tes réponses, voici une estimation de tes revenus mensuels !
          </p>
          <div className="bg-primary/10 p-6 rounded-lg">
            <p className="text-lg font-semibold text-center">
              Entre {data.estimated_income_range.min}€ et {data.estimated_income_range.max}€ par mois
            </p>
            <p className="text-sm text-gray-600 text-center mt-2">
              Cette estimation varie selon le nombre d'élèves et tes horaires. Les revenus réels peuvent fluctuer en fonction de ta disponibilité et de la demande ! 😎
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onNext({ estimated_income_range: data.estimated_income_range })}>
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default IncomeEstimateStep;