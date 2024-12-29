import { motion, AnimatePresence } from "framer-motion";
import { useInstructorOnboarding } from "@/hooks/useInstructorOnboarding";
import OnboardingLayout from "./OnboardingLayout";
import WelcomeStep from "./instructor-steps/WelcomeStep";
import LocationStep from "./instructor-steps/LocationStep";
import AvailabilityStep from "./instructor-steps/AvailabilityStep";
import StudentsPerDayStep from "./instructor-steps/StudentsPerDayStep";
import IncomeEstimateStep from "./instructor-steps/IncomeEstimateStep";
import PhoneConfirmationStep from "./instructor-steps/PhoneConfirmationStep";
import DocumentsStep from "./instructor-steps/DocumentsStep";
import FinalStep from "./instructor-steps/FinalStep";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const TOTAL_STEPS = 8;

const InstructorOnboardingFlow = () => {
  const { currentStep, formData, handleNext, handleBack, handleSubmit } = useInstructorOnboarding();

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
        return <FinalStep onSubmit={handleSubmit} data={formData} />;
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout currentStep={currentStep} totalSteps={TOTAL_STEPS}>
      {currentStep > 1 && (
        <Button
          variant="ghost"
          onClick={handleBack}
          className="absolute left-4 top-4 md:left-8 md:top-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
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
    </OnboardingLayout>
  );
};

export default InstructorOnboardingFlow;