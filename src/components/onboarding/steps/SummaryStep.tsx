import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface SummaryStepProps {
  onSubmit: () => void;
  data: {
    age: number;
    gender: string;
    availability: string[];
    city: string;
    postal_code: string;
    max_distance: number;
  };
}

const SummaryStep = ({ onSubmit, data }: SummaryStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Super, voilà ton profil !</h2>
        <p className="text-gray-500">Vérifie que tout est correct</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Âge</p>
            <p className="font-medium">{data.age} ans</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Genre</p>
            <p className="font-medium">
              {data.gender === "male" ? "Homme" : "Femme"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Disponibilités</p>
            <p className="font-medium">
              {data.availability
                .map((a) => {
                  switch (a) {
                    case "morning":
                      return "Matin";
                    case "afternoon":
                      return "Après-midi";
                    case "evening":
                      return "Soirée";
                    case "weekend":
                      return "Week-end";
                    default:
                      return a;
                  }
                })
                .join(", ")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ville</p>
            <p className="font-medium">{data.city}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Code postal</p>
            <p className="font-medium">{data.postal_code}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Distance max.</p>
            <p className="font-medium">{data.max_distance} km</p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <p className="text-center text-sm text-gray-500">
          Bienvenue dans ton espace élève 🚗 ! Si tu as déjà souscrit à une offre,
          ton moniteur te contactera dans les 48h. Pense à garder ton téléphone
          près de toi pour ne pas manquer son appel. En attendant, explore ton
          tableau de bord pour découvrir toutes les options disponibles. 😊
        </p>

        <Button onClick={onSubmit} className="w-full gradient-bg">
          Accéder à mon dashboard
        </Button>
      </div>
    </div>
  );
};

export default SummaryStep;