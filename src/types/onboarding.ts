export interface DocumentStatus {
  identity: boolean;
  driving_license: boolean;
  teaching_permit: boolean;
  vehicle_registration: boolean;
  technical_control: boolean;
  vehicle_insurance: boolean;
  professional_insurance: boolean;
  business_registration: boolean;
  criminal_record: boolean;
}

export interface OnboardingFormData {
  preferred_location: string;
  working_days: string[];
  students_per_day: number;
  estimated_income_range: {
    min: number;
    max: number;
  };
  phone_number: string;
  documents_status: DocumentStatus;
}

export type OnboardingStepProps = {
  onNext: (data: Partial<OnboardingFormData>) => void;
  data: OnboardingFormData;
};