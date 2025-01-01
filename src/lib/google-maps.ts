// Gestionnaire de l'API Google Maps
export const loadGoogleMapsScript = (onLoad: () => void, onError: () => void) => {
  console.log("Début du chargement de l'API Google Maps");
  
  // Si l'API est déjà chargée
  if (window.isGoogleMapsLoaded && window.google?.maps?.places) {
    console.log("API Google Maps déjà chargée, initialisation directe");
    onLoad();
    return;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAKSiWVJPWa_Dr4U-Ld0QXeBkP53HwMjfw&libraries=places`;
  script.async = true;
  script.defer = true;

  script.onload = () => {
    console.log("API Google Maps chargée avec succès");
    window.isGoogleMapsLoaded = true;
    
    // Vérification supplémentaire que l'API est bien disponible
    if (window.google?.maps?.places) {
      console.log("API Places disponible, initialisation...");
      onLoad();
    } else {
      console.error("API Places non disponible après le chargement");
      onError();
    }
  };

  script.onerror = (error) => {
    console.error("Erreur lors du chargement de l'API Google Maps:", error);
    onError();
  };

  // Vérifier si le script existe déjà
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (!existingScript) {
    console.log("Ajout du script Google Maps au DOM");
    document.head.appendChild(script);
  } else {
    console.log("Script Google Maps déjà présent dans le DOM");
    // Si le script existe mais n'est pas chargé, on attend son chargement
    if (!window.google?.maps?.places) {
      console.log("En attente du chargement du script existant...");
      existingScript.addEventListener('load', () => {
        console.log("Script existant chargé avec succès");
        onLoad();
      });
      existingScript.addEventListener('error', () => {
        console.error("Erreur lors du chargement du script existant");
        onError();
      });
    }
  }
};

export const initializeAutocomplete = (
  inputElement: HTMLInputElement,
  onPlaceChanged: () => void
) => {
  console.log("Initialisation de l'autocomplétion");
  
  try {
    const options = {
      types: ['(cities)'],
      componentRestrictions: { country: 'fr' },
      fields: ['address_components', 'geometry', 'formatted_address']
    };

    console.log("Configuration de l'autocomplétion:", options);
    
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputElement,
      options
    );

    console.log("Instance d'autocomplétion créée avec succès");
    
    autocomplete.addListener("place_changed", () => {
      console.log("Événement place_changed déclenché");
      onPlaceChanged();
    });
    
    return autocomplete;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'autocomplétion:", error);
    throw error;
  }
};

export const extractPlaceInfo = (place: any) => {
  console.log("Extraction des informations du lieu sélectionné:", place);
  
  if (!place.geometry) {
    console.error("Pas de géométrie disponible pour le lieu");
    return null;
  }

  let cityName = "";
  let postalCode = "";

  place.address_components.forEach((component: any) => {
    if (component.types.includes("locality")) {
      cityName = component.long_name;
      console.log("Ville trouvée:", cityName);
    }
    if (component.types.includes("postal_code")) {
      postalCode = component.long_name;
      console.log("Code postal trouvé:", postalCode);
    }
  });

  if (!cityName) {
    const adminArea = place.address_components.find((component: any) =>
      component.types.includes("administrative_area_level_1")
    );
    if (adminArea) {
      cityName = adminArea.long_name;
      console.log("Nom de ville alternatif trouvé:", cityName);
    }
  }

  const result = {
    city: cityName,
    postal_code: postalCode,
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
  };

  console.log("Informations extraites:", result);
  return result;
};