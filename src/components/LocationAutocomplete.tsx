import { useEffect, useRef, useState } from "react";
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
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [isScriptLoading, setIsScriptLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        // Prevent multiple script loads
        if (isScriptLoading || scriptRef.current) return;
        setIsScriptLoading(true);

        const { data: { GOOGLE_PLACES_API_KEY } } = await supabase.functions.invoke('get-google-places-key');
        
        if (!GOOGLE_PLACES_API_KEY) {
          throw new Error("Clé API Google Places non trouvée");
        }

        // Remove any existing Google Maps scripts
        const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
        existingScripts.forEach(script => script.remove());

        // Create and load the script
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places&callback=initAutocomplete`;
        script.async = true;
        script.defer = true;
        scriptRef.current = script;

        // Define the callback function
        window.initAutocomplete = () => {
          if (inputRef.current && !autocompleteRef.current) {
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

              // Extract postal code and city name
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
      } finally {
        setIsScriptLoading(false);
      }
    };

    initAutocomplete();

    return () => {
      // Clean up script and references when component unmounts
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
      if (window.google?.maps) {
        delete window.google.maps;
      }
      if (window.initAutocomplete) {
        delete window.initAutocomplete;
      }
      autocompleteRef.current = null;
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