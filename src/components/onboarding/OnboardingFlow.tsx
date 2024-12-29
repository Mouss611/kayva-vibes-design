import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import OnboardingLayout from "./OnboardingLayout";
import MotivationStep from "./steps/MotivationStep";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import AvailabilityStep from "./steps/AvailabilityStep";
import ExperienceStep from "./steps/ExperienceStep";
import LocationStep from "./steps/LocationStep";
import StartPreferenceStep from "./steps/StartPreferenceStep";
import SummaryStep from "./steps/SummaryStep";
import { Database } from "@/integrations/supabase/types";
import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";

const TOTAL_STEPS = 7;

type Availability = Database["public"]["Enums"]["availability"];
type Gender = Database["public"]["Enums"]["gender"];
type StartPreference = Database["public"]["Enums"]["start_preference"];

interface OnboardingFormData {
  driving_motivation: string;
  age: number;
  gender: Gender;
  availability: Availability[];
  driving_experience: boolean;
  city: string;
  postal_code: string;
  max_distance: number;
  start_preference: StartPreference;
}

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    driving_motivation: "",
    age: 18,
    gender: "male",
    availability: [],
    driving_experience: false,
    city: "",
    postal_code: "",
    max_distance: 5,
    start_preference: "as_soon_as_possible",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // MotivationStep
        return !!formData.driving_motivation;
      case 2: // PersonalInfoStep
        return formData.age >= 15 && !!formData.gender;
      case 3: // AvailabilityStep
        return formData.availability.length > 0;
      case 4: // ExperienceStep
        return true; // Always valid as it's a boolean choice
      case 5: // LocationStep
        return !!formData.city && !!formData.postal_code;
      case 6: // StartPreferenceStep
        return !!formData.start_preference;
      default:
        return true;
    }
  };

  const handleNext = (stepData: Partial<OnboardingFormData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    if (!validateStep(currentStep)) {
      toast({
        variant: "destructive",
        title: "Validation requise",
        description: "Veuillez remplir tous les champs obligatoires avant de continuer.",
      });
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("student_onboarding")
        .insert({
          id: user.id,
          ...formData,
          onboarding_completed: true,
        });

      if (error) throw error;

      toast({
        title: "Profil complété !",
        description: "Bienvenue dans votre espace élève",
      });

      navigate("/dashboard/student");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <MotivationStep onNext={handleNext} data={formData} />;
      case 2:
        return <PersonalInfoStep onNext={handleNext} data={formData} />;
      case 3:
        return <AvailabilityStep onNext={handleNext} data={formData} />;
      case 4:
        return <ExperienceStep onNext={handleNext} data={formData} />;
      case 5:
        return <LocationStep onNext={handleNext} data={formData} />;
      case 6:
        return <StartPreferenceStep onNext={handleNext} data={formData} />;
      case 7:
        return <SummaryStep data={formData} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout currentStep={currentStep} totalSteps={TOTAL_STEPS}>
      <div className="relative w-full max-w-lg mx-auto">
        {currentStep > 1 && (
          <Button
            variant="ghost"
            onClick={handleBack}
            className="absolute left-0 top-0 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
        )}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingFlow;