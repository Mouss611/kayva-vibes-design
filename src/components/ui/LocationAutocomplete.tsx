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
    google: typeof google;
    initAutocomplete: () => void;
  }
}

const LocationAutocomplete = ({ value, onChange, placeholder = "Entrez votre adresse", className }: LocationAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (!window.google) {
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
        types: ["(cities)"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          setInputValue(place.formatted_address);
          onChange(place.formatted_address, place.place_id);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={`pl-10 ${className}`}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
};

export default LocationAutocomplete;