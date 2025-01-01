import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { loadGoogleMapsScript, initializeAutocomplete, extractPlaceInfo } from "@/lib/google-maps";

interface LocationData {
  city: string;
  postal_code: string;
  lat: number;
  lng: number;
}

interface UseGooglePlacesProps {
  onLocationSelect: (location: LocationData) => void;
}

export const useGooglePlaces = ({ onLocationSelect }: UseGooglePlacesProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const { toast } = useToast();

  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;
    
    const place = autocompleteRef.current.getPlace();
    const placeInfo = extractPlaceInfo(place);

    if (!placeInfo) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une ville dans la liste.",
      });
      return;
    }

    // Mise à jour du champ avec la ville sélectionnée
    if (inputRef.current && placeInfo.city) {
      inputRef.current.value = placeInfo.city;
    }

    onLocationSelect(placeInfo);

    toast({
      title: "Ville sélectionnée",
      description: `Vous avez sélectionné ${placeInfo.city}`,
    });
  };

  useEffect(() => {
    const initPlaces = () => {
      if (!inputRef.current || autocompleteRef.current) return;
      try {
        autocompleteRef.current = initializeAutocomplete(
          inputRef.current,
          handlePlaceChanged
        );
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'autocomplétion:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'initialiser la recherche de villes",
        });
      }
    };

    setIsLoading(true);
    loadGoogleMapsScript(
      () => {
        initPlaces();
        setIsLoading(false);
      },
      () => {
        console.error("Erreur lors du chargement de Google Maps");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger le service de recherche de villes",
        });
        setIsLoading(false);
      }
    );

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [toast]);

  return { inputRef, isLoading };
};