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

  const handleNext = (stepData: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
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
    </OnboardingLayout>
  );
};

export default OnboardingFlow;