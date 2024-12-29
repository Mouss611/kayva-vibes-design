import { Progress } from "@/components/ui/progress";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
}

const OnboardingLayout = ({ children, currentStep, totalSteps }: OnboardingLayoutProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8 md:px-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-montserrat font-bold text-primary text-center mb-2">
          kayva
        </h1>
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500 mt-2 text-center">
            Étape {currentStep} sur {totalSteps}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;