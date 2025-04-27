
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Settings, DollarSign } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Form validation schema
const formSchema = z.object({
  stripePublishableKey: z.string().min(1, "Publishable key is required"),
  stripeEnabled: z.boolean().default(false),
  testMode: z.boolean().default(true)
});

const AdminStripeSettings = () => {
  const [loading, setLoading] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stripePublishableKey: '',
      stripeEnabled: false,
      testMode: true
    },
  });

  // Load saved settings when component mounts
  const fetchStripeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'stripe_settings')
        .single();

      if (error) {
        // If no record exists, it's fine
        return;
      }

      if (data && data.value) {
        const settings = JSON.parse(data.value);
        form.setValue('stripePublishableKey', settings.publishableKey || '');
        form.setValue('stripeEnabled', settings.enabled || false);
        form.setValue('testMode', settings.testMode || true);
        setStripeConnected(!!settings.publishableKey);
      }
    } catch (error) {
      console.error('Error loading Stripe settings:', error);
    }
  };

  // Call fetchStripeSettings when the component mounts
  useState(() => {
    fetchStripeSettings();
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const stripeSettings = {
        publishableKey: values.stripePublishableKey,
        enabled: values.stripeEnabled,
        testMode: values.testMode,
        updatedAt: new Date().toISOString()
      };

      // Save to database
      const { error } = await supabase
        .from('settings')
        .upsert({ 
          key: 'stripe_settings', 
          value: JSON.stringify(stripeSettings) 
        }, { onConflict: 'key' });

      if (error) {
        throw error;
      }

      toast({
        title: "Settings saved",
        description: "Your Stripe settings have been saved successfully.",
      });

      setStripeConnected(!!values.stripePublishableKey);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          Stripe Payment Settings
        </h2>
        <p className="text-muted-foreground">
          Connect your Stripe account to accept payments directly from your website.
        </p>
      </div>

      {stripeConnected && (
        <Alert className="bg-green-50 border-green-200">
          <DollarSign className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Stripe Connected</AlertTitle>
          <AlertDescription className="text-green-600">
            Your Stripe account is connected and {form.watch('stripeEnabled') ? 'enabled' : 'disabled'} for payments.
            {form.watch('testMode') && ' Running in test mode.'}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Stripe Configuration</CardTitle>
          <CardDescription>
            Enter your Stripe API keys to enable payment processing. You can find these in your Stripe Dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="stripePublishableKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stripe Publishable Key</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="pk_test_..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Your Stripe publishable key (starts with pk_test_ for test mode or pk_live_ for live mode)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="stripeEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Stripe Payments</FormLabel>
                        <FormDescription>
                          Allow customers to pay through Stripe
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="testMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Test Mode</FormLabel>
                        <FormDescription>
                          Use Stripe test environment
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-muted/50 flex flex-col items-start text-xs text-muted-foreground">
          <p>Note: For security reasons, your Stripe Secret Key should be stored in a secure environment variable.</p>
          <p>The Stripe Secret Key would be needed for a complete integration, typically stored securely in a server-side environment.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminStripeSettings;
