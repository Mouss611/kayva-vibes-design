import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import OnboardingLayout from "./OnboardingLayout";
import WelcomeStep from "./instructor-steps/WelcomeStep";
import LocationStep from "./instructor-steps/LocationStep";
import AvailabilityStep from "./instructor-steps/AvailabilityStep";
import StudentsPerDayStep from "./instructor-steps/StudentsPerDayStep";
import IncomeEstimateStep from "./instructor-steps/IncomeEstimateStep";
import PhoneConfirmationStep from "./instructor-steps/PhoneConfirmationStep";
import DocumentsStep from "./instructor-steps/DocumentsStep";
import FinalStep from "./instructor-steps/FinalStep";

const TOTAL_STEPS = 8;

interface OnboardingFormData {
  preferred_location: string;
  working_days: string[];
  students_per_day: number;
  estimated_income_range: {
    min: number;
    max: number;
  };
  phone_number: string;
  documents_status: {
    identity: boolean;
    driving_license: boolean;
    teaching_permit: boolean;
    vehicle_registration: boolean;
    technical_control: boolean;
    vehicle_insurance: boolean;
    professional_insurance: boolean;
    business_registration: boolean;
    criminal_record: boolean;
  };
}

const InstructorOnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    preferred_location: "",
    working_days: [],
    students_per_day: 8,
    estimated_income_range: {
      min: 2500,
      max: 4500
    },
    phone_number: "",
    documents_status: {
      identity: false,
      driving_license: false,
      teaching_permit: false,
      vehicle_registration: false,
      technical_control: false,
      vehicle_insurance: false,
      professional_insurance: false,
      business_registration: false,
      criminal_record: false
    }
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
        .from("profiles")
        .update({
          ...formData,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profil complété !",
        description: "Bienvenue dans votre espace moniteur",
      });

      navigate("/dashboard/instructor");
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
        return <WelcomeStep onNext={handleNext} />;
      case 2:
        return <LocationStep onNext={handleNext} data={formData} />;
      case 3:
        return <AvailabilityStep onNext={handleNext} data={formData} />;
      case 4:
        return <StudentsPerDayStep onNext={handleNext} data={formData} />;
      case 5:
        return <IncomeEstimateStep onNext={handleNext} data={formData} />;
      case 6:
        return <PhoneConfirmationStep onNext={handleNext} data={formData} />;
      case 7:
        return <DocumentsStep onNext={handleNext} data={formData} />;
      case 8:
        return <FinalStep data={formData} onSubmit={handleSubmit} />;
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

export default InstructorOnboardingFlow;