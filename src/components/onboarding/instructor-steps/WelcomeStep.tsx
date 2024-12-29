import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface WelcomeStepProps {
  onNext: (data: any) => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold">
          🎉 Bienvenue dans notre programme, futur super moniteur !
        </h2>
        <p className="text-gray-600">
          Nous allons t'accompagner pour personnaliser ton expérience et t'aider à démarrer ta carrière de moniteur.
        </p>
        <p className="text-gray-600">
          Cela ne prendra que quelques minutes, et à la fin, tu sauras exactement comment planifier tes cours et combien tu pourrais gagner chaque mois ! 😊
        </p>
      </div>

      <div className="flex justify-center">
        <Button onClick={() => onNext({})}>
          Commencer
        </Button>
      </div>
    </motion.div>
  );
};

export default WelcomeStep;