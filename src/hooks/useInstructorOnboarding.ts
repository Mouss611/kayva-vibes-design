import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OnboardingFormData } from "@/types/onboarding";

export const useInstructorOnboarding = () => {
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 2: // LocationStep
        return !!formData.preferred_location;
      case 3: // AvailabilityStep
        return formData.working_days.length > 0;
      case 4: // StudentsPerDayStep
        return formData.students_per_day >= 8;
      case 5: // IncomeEstimateStep
        return true; // Auto-calculated, always valid
      case 6: // PhoneConfirmationStep
        return !!formData.phone_number && formData.phone_number.length >= 10;
      case 7: // DocumentsStep
        return Object.values(formData.documents_status).some(value => value);
      default:
        return true;
    }
  };

  const handleNext = (stepData: Partial<OnboardingFormData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 8) {
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
          preferred_location: formData.preferred_location,
          working_days: formData.working_days,
          students_per_day: formData.students_per_day,
          estimated_income_range: formData.estimated_income_range,
          phone_number: formData.phone_number,
          documents_status: formData.documents_status,
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

  return {
    currentStep,
    formData,
    handleNext,
    handleBack,
    handleSubmit,
    validateStep,
  };
};