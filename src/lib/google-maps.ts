// Gestionnaire de l'API Google Maps
export const loadGoogleMapsScript = (onLoad: () => void, onError: () => void) => {
  // Si l'API est déjà chargée
  if (window.isGoogleMapsLoaded && window.google?.maps?.places) {
    onLoad();
    return;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAKSiWVJPWa_Dr4U-Ld0QXeBkP53HwMjfw&libraries=places`;
  script.async = true;
  script.defer = true;

  script.onload = () => {
    window.isGoogleMapsLoaded = true;
    onLoad();
  };

  script.onerror = onError;

  // Vérifier si le script existe déjà
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (!existingScript) {
    document.head.appendChild(script);
  }
};

export const initializeAutocomplete = (
  inputElement: HTMLInputElement,
  onPlaceChanged: () => void
) => {
  const options = {
    types: ['(cities)'],
    componentRestrictions: { country: 'fr' },
    fields: ['address_components', 'geometry', 'formatted_address']
  };

  const autocomplete = new window.google.maps.places.Autocomplete(
    inputElement,
    options
  );

  autocomplete.addListener("place_changed", onPlaceChanged);
  return autocomplete;
};

export const extractPlaceInfo = (place: any) => {
  if (!place.geometry) {
    return null;
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

  return {
    city: cityName,
    postal_code: postalCode,
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
  };
};