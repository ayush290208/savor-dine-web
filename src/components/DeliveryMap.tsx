
import { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

interface DeliveryMapProps {
  onAddressSelect: (address: string) => void;
}

const DeliveryMap = ({ onAddressSelect }: DeliveryMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const mapRef = useRef<HTMLDivElement>(null);
  const { isLoaded, isError } = useGoogleMaps();
  
  useEffect(() => {
    if (isLoaded && mapRef.current) {
      initMap();
    }
    
    if (isError) {
      setIsLoading(false);
      setError("Failed to load Google Maps. Please enter your address manually.");
    }
  }, [isLoaded, isError]);
  
  const initMap = () => {
    if (!mapRef.current || typeof google === 'undefined') return;
    
    setIsLoading(true);
    
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          const mapInstance = new google.maps.Map(mapRef.current!, {
            center: { lat: latitude, lng: longitude },
            zoom: 15,
            mapTypeControl: false
          });
          
          const markerInstance = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: mapInstance,
            draggable: true,
            animation: google.maps.Animation.DROP
          });
          
          setMap(mapInstance);
          setMarker(markerInstance);
          setIsLoading(false);
          
          // Get address from coordinates
          getAddressFromCoords(latitude, longitude);
          
          // Add event listener for marker drag end
          markerInstance.addListener('dragend', () => {
            const position = markerInstance.getPosition();
            if (position) {
              getAddressFromCoords(position.lat(), position.lng());
            }
          });
          
          // Add click event on map to move marker
          mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
            const position = e.latLng;
            if (position) {
              markerInstance.setPosition(position);
              getAddressFromCoords(position.lat(), position.lng());
            }
          });
          
        },
        (error) => {
          console.error('Error getting location:', error);
          
          // Default location (city center)
          const defaultLoc = { lat: 40.7128, lng: -74.0060 }; // New York
          
          const mapInstance = new google.maps.Map(mapRef.current!, {
            center: defaultLoc,
            zoom: 12,
            mapTypeControl: false
          });
          
          const markerInstance = new google.maps.Marker({
            position: defaultLoc,
            map: mapInstance,
            draggable: true
          });
          
          setMap(mapInstance);
          setMarker(markerInstance);
          setIsLoading(false);
          setError("Couldn't get your location. Please select your delivery address on the map.");
          
          // Add event listeners as above
          markerInstance.addListener('dragend', () => {
            const position = markerInstance.getPosition();
            if (position) {
              getAddressFromCoords(position.lat(), position.lng());
            }
          });
          
          mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
            const position = e.latLng;
            if (position) {
              markerInstance.setPosition(position);
              getAddressFromCoords(position.lat(), position.lng());
            }
          });
        },
        { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      setIsLoading(false);
      setError("Geolocation is not supported by this browser.");
    }
  };
  
  const getAddressFromCoords = (lat: number, lng: number) => {
    if (typeof google === 'undefined') return;
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const addressText = results[0].formatted_address;
        setAddress(addressText);
      } else {
        setError("Couldn't get address for this location.");
      }
    });
  };
  
  const confirmAddress = () => {
    if (address) {
      onAddressSelect(address);
    } else {
      setError("Please select a delivery address on the map.");
    }
  };

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Map Error</AlertTitle>
        <AlertDescription>
          Could not load Google Maps. Please enter your address manually.
          <Input 
            className="mt-2" 
            placeholder="Enter your delivery address" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button 
            onClick={confirmAddress} 
            disabled={!address}
            className="mt-2 bg-restaurant-primary hover:bg-restaurant-dark"
          >
            Confirm Address
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="mb-4 rounded-md overflow-hidden border shadow-sm" style={{ height: "300px" }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full bg-gray-100">
            Loading map...
          </div>
        ) : (
          <div ref={mapRef} className="h-full w-full"></div>
        )}
      </div>
      
      {address && (
        <div className="mb-4 p-3 bg-muted rounded-md">
          <p className="font-medium">Selected address:</p>
          <p className="text-muted-foreground">{address}</p>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={confirmAddress} 
          disabled={!address}
          className="bg-restaurant-primary hover:bg-restaurant-dark"
        >
          Confirm Location
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        Note: You can click on the map or drag the marker to adjust your delivery location.
      </p>
    </div>
  );
};

export default DeliveryMap;
