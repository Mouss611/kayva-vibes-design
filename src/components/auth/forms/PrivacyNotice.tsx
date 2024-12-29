import { AlertTriangle } from "lucide-react";

const PrivacyNotice = () => {
  return (
    <div className="mt-4 p-4 bg-secondary/30 rounded-lg flex items-start gap-2">
      <AlertTriangle className="h-5 w-5 text-primary-dark flex-shrink-0 mt-0.5" />
      <p className="text-sm text-gray-600">
        En vous inscrivant, vous acceptez notre{" "}
        <a href="/privacy-policy" className="text-primary hover:underline">
          politique de confidentialité
        </a>
        . Vos données personnelles seront traitées conformément à celle-ci.
      </p>
    </div>
  );
};

export default PrivacyNotice;