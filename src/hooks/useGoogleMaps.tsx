
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GoogleMapsSettings {
  apiKey: string;
}

export function useGoogleMaps() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchGoogleMapsApiKey = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'google_maps_settings')
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching Google Maps settings:', error);
          setIsError(true);
          return;
        }

        if (data && data.value) {
          try {
            const settings = JSON.parse(data.value) as GoogleMapsSettings;
            if (settings.apiKey) {
              setApiKey(settings.apiKey);
              loadGoogleMapsScript(settings.apiKey);
            } else {
              setIsError(true);
            }
          } catch (parseError) {
            console.error('Error parsing Google Maps settings:', parseError);
            setIsError(true);
          }
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error('Error processing Google Maps settings:', error);
        setIsError(true);
      }
    };

    const loadGoogleMapsScript = (key: string) => {
      // Check if script is already loaded
      if (document.querySelector(`script[src*="maps.googleapis.com/maps/api"]`)) {
        setIsLoaded(true);
        return;
      }
      
      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
      };
      
      script.onerror = () => {
        setIsError(true);
      };
      
      document.head.appendChild(script);
    };

    fetchGoogleMapsApiKey();
  }, []);

  return { isLoaded, isError, apiKey };
}
