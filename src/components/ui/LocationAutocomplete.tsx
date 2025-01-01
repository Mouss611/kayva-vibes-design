import React, { useEffect, useRef, useState } from "react";
import { Input } from "./input";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string, placeId?: string) => void;
  placeholder?: string;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

const LocationAutocomplete = ({ value, onChange, placeholder = "Entrez votre adresse", className }: LocationAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!window.google) {
      // Load the Google Maps Places API
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&libraries=places&callback=initAutocomplete`;
      script.async = true;
      script.defer = true;
      
      window.initAutocomplete = () => {
        setIsLoaded(true);
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
        delete window.initAutocomplete;
      };
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "fr" },
        fields: ["address_components", "geometry", "place_id"],
        types: ["address"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.geometry) {
          const formattedAddress = inputRef.current?.value || "";
          onChange(formattedAddress, place.place_id);
        } else {
          toast({
            title: "Erreur",
            description: "Veuillez sélectionner une adresse dans la liste",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'initialisation de l'autocomplétion",
        variant: "destructive",
      });
    }

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange]);

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pl-10 ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default LocationAutocomplete;