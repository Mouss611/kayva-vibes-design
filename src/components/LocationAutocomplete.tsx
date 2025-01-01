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
    isGoogleMapsLoaded: boolean;
  }
}

const LocationAutocomplete = ({ onLocationSelect, defaultValue = "", className = "" }: LocationAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;
    
    const place = autocompleteRef.current.getPlace();

    if (!place.geometry) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une ville dans la liste.",
      });
      return;
    }

    let cityName = "";
    let postalCode = "";

    place.address_components.forEach((component: any) => {
      if (component.types.includes("locality")) {
        cityName = component.long_name;
      }
      if (component.types.includes("postal_code")) {
        postalCode = component.long_name;
      }
    });

    if (!cityName) {
      const adminArea = place.address_components.find((component: any) =>
        component.types.includes("administrative_area_level_1")
      );
      if (adminArea) {
        cityName = adminArea.long_name;
      }
    }

    // Mise à jour du champ avec la ville sélectionnée
    if (inputRef.current && cityName) {
      inputRef.current.value = cityName;
    }

    onLocationSelect({
      city: cityName,
      postal_code: postalCode,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });

    if (cityName) {
      toast({
        title: "Ville sélectionnée",
        description: `Vous avez sélectionné ${cityName}`,
      });
    }
  };

  const initializeAutocomplete = () => {
    if (!inputRef.current || autocompleteRef.current) return;

    try {
      const options = {
        types: ['(cities)'],
        componentRestrictions: { country: 'fr' },
        fields: ['address_components', 'geometry', 'formatted_address']
      };

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      autocompleteRef.current.addListener("place_changed", onPlaceChanged);
    } catch (error: any) {
      console.error("Erreur lors de l'initialisation de l'autocomplétion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'initialiser la recherche de villes",
      });
    }
  };

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      // Si l'API est déjà chargée, initialiser directement l'autocomplétion
      if (window.isGoogleMapsLoaded && window.google?.maps?.places) {
        initializeAutocomplete();
        return;
      }

      try {
        setIsLoading(true);
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAKSiWVJPWa_Dr4U-Ld0QXeBkP53HwMjfw&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          window.isGoogleMapsLoaded = true;
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

        // Vérifier si le script existe déjà
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (!existingScript) {
          document.head.appendChild(script);
        }
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

    loadGoogleMapsScript();

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [toast]);

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