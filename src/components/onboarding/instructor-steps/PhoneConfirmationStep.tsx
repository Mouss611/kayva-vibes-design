import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";
import { useState } from "react";

interface PhoneConfirmationStepProps {
  onNext: (data: { phone_number: string }) => void;
  data: { phone_number: string };
}

const PhoneConfirmationStep = ({ onNext, data }: PhoneConfirmationStepProps) => {
  const [phoneNumber, setPhoneNumber] = useState(data.phone_number);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Phone className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Confirmation du numéro</h2>
        </div>
        <p className="text-gray-600">
          Peux-tu confirmer ton numéro de téléphone ? Cela nous permettra de te contacter en cas de besoin.
        </p>
      </div>

      <Input
        type="tel"
        placeholder="Numéro de téléphone"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <div className="flex justify-end">
        <Button onClick={() => onNext({ phone_number: phoneNumber })}>
          Confirmer
        </Button>
      </div>
    </div>
  );
};

export default PhoneConfirmationStep;