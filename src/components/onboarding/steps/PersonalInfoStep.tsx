import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Database } from "@/integrations/supabase/types";

type Gender = Database["public"]["Enums"]["gender"];

interface PersonalInfoStepProps {
  onNext: (data: { age: number; gender: Gender }) => void;
  data: { age: number; gender: Gender };
}

const PersonalInfoStep = ({ onNext, data }: PersonalInfoStepProps) => {
  const [age, setAge] = useState(data.age || 18);
  const [gender, setGender] = useState<Gender>(data.gender || "male");

  const handleNext = () => {
    onNext({ age, gender });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Quelques informations sur toi</h2>
          <p className="text-gray-500">Pour mieux te connaître</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Quel âge as-tu ?</Label>
          <Input
            id="age"
            type="number"
            min={15}
            max={99}
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Es-tu un homme ou une femme ?</Label>
          <RadioGroup
            value={gender}
            onValueChange={(value: Gender) => setGender(value)}
            className="grid grid-cols-2 gap-4"
          >
            <Card className="relative flex items-center justify-center p-4 cursor-pointer hover:border-primary transition-colors">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male" className="cursor-pointer">
                👨 Homme
              </Label>
            </Card>

            <Card className="relative flex items-center justify-center p-4 cursor-pointer hover:border-primary transition-colors">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female" className="cursor-pointer">
                👩 Femme
              </Label>
            </Card>
          </RadioGroup>
        </div>
      </div>

      <Button onClick={handleNext} className="w-full gradient-bg">
        Continuer
      </Button>
    </div>
  );
};

export default PersonalInfoStep;