import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface FinalStepProps {
  onSubmit: () => void;
  data: any;
}

const FinalStep = ({ onSubmit }: FinalStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4 text-center">
        <CheckCircle className="w-12 h-12 text-primary mx-auto" />
        <h2 className="text-2xl font-bold">C'est presque fini !</h2>
        <div className="space-y-2">
          <p className="text-gray-600">
            Merci pour tes réponses ! Nous t'enverrons bientôt un e-mail pour confirmer ta demande.
          </p>
          <p className="text-gray-600">
            Notre support te contactera pour finaliser ton inscription. 🔜
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={onSubmit}>
          Terminer l'inscription
        </Button>
      </div>
    </div>
  );
};

export default FinalStep;