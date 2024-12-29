import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DocumentsStepProps {
  onNext: (data: { documents_status: Record<string, boolean> }) => void;
  data: { documents_status: Record<string, boolean> };
}

const documents = [
  { id: "identity", label: "Pièce d'identité recto verso en cours de validité" },
  { id: "driving_license", label: "Permis de conduire avec mention permis B recto verso" },
  { id: "teaching_permit", label: "Autorisation d'enseigner en cours de validité" },
  { id: "vehicle_registration", label: "Carte(s) grise(s) avec mention 'véhicule-école'" },
  { id: "technical_control", label: "Attestation de contrôle technique" },
  { id: "vehicle_insurance", label: "Attestation d'assurance véhicule" },
  { id: "professional_insurance", label: "Attestation d'assurance RC Pro 'Auto-école'" },
  { id: "business_registration", label: "Kbis ou notification d'affiliation" },
  { id: "criminal_record", label: "Extrait du bulletin n°3 du casier judiciaire" },
];

const DocumentsStep = ({ onNext, data }: DocumentsStepProps) => {
  const handleDocumentChange = (documentId: string, checked: boolean) => {
    const updatedDocuments = {
      ...data.documents_status,
      [documentId]: checked,
    };
    onNext({ documents_status: updatedDocuments });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Documents nécessaires</h2>
        </div>
        <p className="text-gray-600">
          Voici la liste des documents dont nous aurons besoin. Tu pourras les soumettre plus tard !
        </p>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-start space-x-2">
            <Checkbox
              id={doc.id}
              checked={data.documents_status[doc.id]}
              onCheckedChange={(checked) => handleDocumentChange(doc.id, checked as boolean)}
            />
            <Label htmlFor={doc.id} className="text-sm leading-none">
              {doc.label}
            </Label>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onNext({ documents_status: data.documents_status })}>
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default DocumentsStep;