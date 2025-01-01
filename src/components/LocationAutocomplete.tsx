import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface LocationAutocompleteProps {
  onLocationSelect: (location: {
    city: string;
    lat: number;
    lng: number;
    postal_code: string;
  }) => void;
  defaultValue?: string;
  className?: string;
  apiKey?: string;
}

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

const LocationAutocomplete = ({ 
  onLocationSelect, 
  defaultValue = "", 
  className = "",
  apiKey = "AIzaSyBc1Xonf04mqKuyzhNxkh3OdOkzrc5tcB8" // Clé par défaut
}: LocationAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initializeAutocomplete = () => {
    if (!inputRef.current || autocompleteRef.current) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["(cities)"],
          componentRestrictions: { country: "fr" },
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        
        if (!place.geometry) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Veuillez sélectionner une ville dans la liste",
          });
          return;
        }

        let postalCode = "";
        let cityName = "";

        place.address_components.forEach((component: any) => {
          if (component.types.includes("postal_code")) {
            postalCode = component.long_name;
          }
          if (component.types.includes("locality")) {
            cityName = component.long_name;
          }
        });

        onLocationSelect({
          city: cityName,
          postal_code: postalCode,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      });
    } catch (error) {
      console.error("Erreur lors de l'initialisation de l'autocomplétion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'initialiser l'autocomplétion des villes",
      });
    }
  };

  useEffect(() => {
    const loadGoogleMapsScript = async () => {
      try {
        setIsLoading(true);

        // Remove any existing Google Maps scripts
        const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
        existingScripts.forEach(script => script.remove());

        // Create and append the new script
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          initializeAutocomplete();
          setIsLoading(false);
        };

        script.onerror = (error) => {
          console.error("Erreur lors du chargement du script Google Maps:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger l'API Google Maps",
          });
          setIsLoading(false);
        };

        document.head.appendChild(script);

        return () => {
          script.remove();
          if (window.google?.maps) {
            delete window.google.maps;
          }
          if (autocompleteRef.current) {
            autocompleteRef.current = null;
          }
        };
      } catch (error: any) {
        console.error("Erreur:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message || "Une erreur est survenue",
        });
        setIsLoading(false);
      }
    };

    loadGoogleMapsScript();
  }, [apiKey]); // Ajout de apiKey dans les dépendances

  return (
    <Input
      ref={inputRef}
      type="text"
      defaultValue={defaultValue}
      className={`${className} ${isLoading ? 'opacity-50' : ''}`}
      placeholder="Entrez votre ville"
      disabled={isLoading}
    />
  );
};

export default LocationAutocomplete;