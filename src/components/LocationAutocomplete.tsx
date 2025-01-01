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
}

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

const LocationAutocomplete = ({ onLocationSelect, defaultValue = "", className = "" }: LocationAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadGoogleMapsScript = async () => {
      try {
        setIsLoading(true);

        // Remove any existing Google Maps scripts
        const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
        existingScripts.forEach(script => script.remove());

        const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAKSiWVJPWa_Dr4U-Ld0QXeBkP53HwMjfw&libraries=places";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
          initializeAutocomplete();
          setIsLoading(false);
        };

        script.onerror = () => {
          console.error("Erreur lors du chargement de Google Maps");
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger le service de recherche de villes. Veuillez vérifier votre connexion internet.",
          });
          setIsLoading(false);
        };
      } catch (error: any) {
        console.error("Erreur lors du chargement de Google Maps:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement du service de recherche de villes.",
        });
        setIsLoading(false);
      }
    };

    const initializeAutocomplete = () => {
      if (!inputRef.current || autocompleteRef.current) return;

      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["geocode"],
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
      } catch (error: any) {
        console.error("Erreur lors de l'initialisation de l'autocomplétion:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'initialiser la recherche de villes",
        });
      }
    };

    loadGoogleMapsScript();

    return () => {
      // Cleanup
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [onLocationSelect]);

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