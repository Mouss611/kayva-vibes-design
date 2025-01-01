import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

interface MapProps {
  onLocationSelect?: (location: { address: string; coordinates: [number, number] }) => void;
}

const Map = ({ onLocationSelect }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2F5dmEtdmliZXMiLCJhIjoiY2xzcjVtOWJzMGJvbTJrcXZ0ZmQxZnlwNyJ9.rKm1vE2vQaUj8xHQAVhvBA';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3522, 48.8566], // Paris coordinates
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  const handleSearch = async () => {
    if (!searchInput || !map.current) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchInput
        )}.json?access_token=${mapboxgl.accessToken}&country=fr`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        
        // Remove existing marker if any
        if (marker.current) {
          marker.current.remove();
        }

        // Add new marker
        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current);

        // Fly to location
        map.current.flyTo({
          center: [lng, lat],
          zoom: 14,
          essential: true
        });

        // Call callback if provided
        if (onLocationSelect) {
          onLocationSelect({
            address: data.features[0].place_name,
            coordinates: [lng, lat]
          });
        }
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  return (
    <div className="relative w-full h-[600px]">
      <Card className="absolute top-4 left-4 z-10 w-80">
        <div className="p-4 flex gap-2">
          <Input
            type="text"
            placeholder="Rechercher une adresse..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </Card>
      <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg" />
    </div>
  );
};

export default Map;