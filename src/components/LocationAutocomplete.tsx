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
    const loadGoogleMapsScript = async () => {
      try {
        // Prevent multiple script loads
        if (isScriptLoading || scriptRef.current) return;
        setIsScriptLoading(true);

        const { data: { GOOGLE_PLACES_API_KEY }, error } = await supabase.functions.invoke('get-google-places-key');
        
        if (error || !GOOGLE_PLACES_API_KEY) {
          throw new Error("Impossible de récupérer la clé API Google Places");
        }

        // Remove any existing Google Maps scripts to prevent duplicates
        const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
        existingScripts.forEach(script => script.remove());

        return new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;
          script.async = true;
          script.onload = () => {
            scriptRef.current = script;
            resolve();
          };
          script.onerror = () => {
            reject(new Error("Erreur lors du chargement de Google Maps"));
          };
          document.head.appendChild(script);
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message || "Impossible de charger l'autocomplétion des villes",
        });
        console.error("Erreur lors du chargement de Google Maps:", error);
      } finally {
        setIsScriptLoading(false);
      }
    };

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
      } catch (error: any) {
        console.error("Erreur lors de l'initialisation de l'autocomplétion:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'initialiser l'autocomplétion des villes",
        });
      }
    };

    const init = async () => {
      await loadGoogleMapsScript();
      if (window.google?.maps) {
        initializeAutocomplete();
      }
    };

    init();

    return () => {
      // Clean up
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
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
      disabled={isScriptLoading}
    />
  );
};

export default LocationAutocomplete;