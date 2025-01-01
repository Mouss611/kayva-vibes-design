import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
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
  const { toast } = useToast();

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        const { data: { GOOGLE_PLACES_API_KEY } } = await supabase.functions.invoke('get-google-places-key');
        
        if (!GOOGLE_PLACES_API_KEY) {
          throw new Error("Clé API Google Places non trouvée");
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = () => {
          if (inputRef.current) {
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

              // Extraire le code postal et le nom de la ville
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
          }
        };

        document.head.appendChild(script);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger l'autocomplétion des villes",
        });
        console.error("Erreur lors de l'initialisation de l'autocomplétion:", error);
      }
    };

    initAutocomplete();

    return () => {
      // Nettoyage du script lors du démontage du composant
      const script = document.querySelector('script[src*="maps.googleapis.com"]');
      if (script) {
        script.remove();
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
    />
  );
};

export default LocationAutocomplete;