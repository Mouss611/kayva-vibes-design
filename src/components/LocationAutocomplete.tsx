import { Input } from "@/components/ui/input";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
    isGoogleMapsLoaded: boolean;
  }
}

interface LocationAutocompleteProps {
  onLocationSelect: (location: {
    city: string;
    lat: number;
    lng: number;
    postal_code: string;
  }) => void;
  defaultValue?: string;
  className?: string;
}

const LocationAutocomplete = ({ 
  onLocationSelect, 
  defaultValue = "", 
  className = "" 
}: LocationAutocompleteProps) => {
  const { inputRef, isLoading } = useGooglePlaces({ onLocationSelect });

  return (
    <Input
      ref={inputRef}
      type="text"
      defaultValue={defaultValue}
      className={className}
      placeholder="Entrez votre ville"
      disabled={isLoading}
    />
  );
};

export default LocationAutocomplete;