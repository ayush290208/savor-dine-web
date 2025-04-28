
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define a type for settings data
interface SettingsData {
  id?: string;
  key: string;
  value: string;
}

// Structure for Google Maps settings
interface GoogleMapsSettings {
  apiKey: string;
  lastUpdated?: string;
}

const AdminMapsSettings = () => {
  const [settings, setSettings] = useState<GoogleMapsSettings>({
    apiKey: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Load saved settings when component mounts
  const fetchMapsSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'google_maps_settings')
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      if (data) {
        const typedData = data as SettingsData;
        if (typedData.value) {
          try {
            const settings = JSON.parse(typedData.value);
            setSettings(settings);
          } catch (parseError) {
            console.error('Error parsing settings:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('Error processing settings:', error);
    }
  };

  useEffect(() => {
    fetchMapsSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);

      // Prepare settings object
      const mapsSettings = {
        ...settings,
        lastUpdated: new Date().toISOString()
      };

      // Save to database using upsert
      const { error } = await supabase
        .from('settings')
        .upsert({ 
          key: 'google_maps_settings', 
          value: JSON.stringify(mapsSettings) 
        })
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Google Maps settings saved successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save Google Maps settings.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Google Maps Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure Google Maps API settings for your restaurant's delivery map
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              You'll need a Google Maps API key with Maps JavaScript API and Geocoding API enabled.
              Get your API key from the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline text-restaurant-primary">Google Cloud Console</a>.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="apiKey">Google Maps API Key</Label>
            <Input
              id="apiKey"
              name="apiKey"
              value={settings.apiKey}
              onChange={handleInputChange}
              placeholder="Enter your Google Maps API key"
              type="password"
            />
            <p className="text-sm text-muted-foreground">
              This key will be used for the delivery map feature.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={fetchMapsSettings}>Cancel</Button>
          <Button 
            onClick={saveSettings} 
            disabled={isSaving}
            className="bg-restaurant-primary hover:bg-restaurant-dark"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminMapsSettings;
