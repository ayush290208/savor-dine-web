
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DeliveryMap from '@/components/DeliveryMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, CreditCard, Truck, Package, MapPin, Banknote } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  quantity?: number;
}

interface SettingsData {
  id?: string;
  key: string;
  value: string;
}

interface StripeSettings {
  enabled: boolean;
  publishableKey: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, basil",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=1974&auto=format&fit=crop",
    category: "mains"
  },
  {
    id: 2,
    name: "Truffle Pasta",
    description: "Homemade pasta with black truffle and parmesan",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1770&auto=format&fit=crop",
    category: "mains"
  },
  {
    id: 3,
    name: "Caprese Salad",
    description: "Tomato, fresh mozzarella, basil, balsamic glaze",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1608032077018-c9aad9565d29?q=80&w=1974&auto=format&fit=crop",
    category: "starters"
  }
];

const OrderPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cash'>('stripe');
  const [loading, setLoading] = useState(false);
  const [stripeInfo, setStripeInfo] = useState<StripeSettings | null>(null);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'starters' | 'mains' | 'desserts' | 'all'>('all');

  const fetchStripeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'stripe_settings')
        .maybeSingle();

      if (error) {
        console.error('Error fetching Stripe settings:', error);
        return;
      }

      if (data) {
        const typedData = data as SettingsData;
        try {
          const settings = JSON.parse(typedData.value);
          setStripeInfo({
            enabled: settings.enabled || false,
            publishableKey: settings.publishableKey || ''
          });
          
          if (!settings.enabled) {
            setPaymentMethod('cash');
          }
        } catch (parseError) {
          console.error('Error parsing Stripe settings:', parseError);
        }
      }
    } catch (error) {
      console.error('Error processing Stripe settings:', error);
    }
  };

  useEffect(() => {
    fetchStripeSettings();
  }, []);

  const addToCart = (item: MenuItem) => {
    const itemInCart = cart.find(cartItem => cartItem.id === item.id);
    
    if (itemInCart) {
      const updatedCart = cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 } 
          : cartItem
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    toast({
      title: "Added to cart",
      description: `${item.name} added to your order.`
    });
  };

  const removeFromCart = (itemId: number) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const handleAddressSelect = (address: string) => {
    setCustomerInfo({ ...customerInfo, address });
    setShowMapDialog(false);
  };

  const openMapDialog = () => {
    setShowMapDialog(true);
  };

  const handleSubmitOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || (deliveryMethod === 'delivery' && !customerInfo.address)) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to your order.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          total_amount: calculateTotal(),
          status: 'pending'
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        menu_item_id: String(item.id),
        quantity: item.quantity || 1,
        price_at_purchase: item.price,
        notes: customerInfo.notes
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      if (paymentMethod === 'stripe' && stripeInfo?.enabled) {
        toast({
          title: "Processing Payment",
          description: "Redirecting to payment page..."
        });
        // In a real implementation, you would redirect to Stripe payment page
        setTimeout(() => {
          navigate('/order-confirmation');
        }, 1500);
      } else {
        navigate('/order-confirmation');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMenuItems = activeTab === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-12 mt-16">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-restaurant-dark mb-8 text-center">
          Order Delicious Food
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Menu Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                  <TabsList className="mb-4 w-full justify-start overflow-auto">
                    <TabsTrigger value="all" className="px-4">All Items</TabsTrigger>
                    <TabsTrigger value="starters" className="px-4">Starters</TabsTrigger>
                    <TabsTrigger value="mains" className="px-4">Main Courses</TabsTrigger>
                    <TabsTrigger value="desserts" className="px-4">Desserts</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-4">
                  {filteredMenuItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-md hover:shadow-md transition-shadow">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="flex-grow">
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="font-medium text-restaurant-primary mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      <Button 
                        className="bg-restaurant-primary hover:bg-restaurant-dark flex-shrink-0"
                        onClick={() => addToCart(item)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Order
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="space-y-6 sticky top-24">
              <Card className="shadow-md">
                <CardHeader className="bg-restaurant-primary text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2" />
                    Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">Your cart is empty</p>
                      <p className="text-sm mt-2">Add items from our menu to start your order</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-3">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                              className="h-8 w-8 p-0"
                            >
                              -
                            </Button>
                            <span>{item.quantity || 1}</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                              className="h-8 w-8 p-0"
                            >
                              +
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 h-8"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col items-stretch border-t pt-4 bg-muted/20">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="font-medium text-lg">Total:</span>
                    <span className="font-bold text-lg text-restaurant-primary">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <Button 
                    onClick={handleSubmitOrder} 
                    className="w-full bg-restaurant-primary hover:bg-restaurant-dark"
                    disabled={loading || cart.length === 0}
                  >
                    {loading ? 'Processing...' : 'Pay Now & Complete Order'}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={deliveryMethod} 
                    onValueChange={(value: 'delivery' | 'pickup') => setDeliveryMethod(value)}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex items-center cursor-pointer flex-1">
                        <Truck className="h-4 w-4 mr-2" />
                        <div>
                          <div>Delivery</div>
                          <p className="text-sm text-muted-foreground">Delivered to your address</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex items-center cursor-pointer flex-1">
                        <Package className="h-4 w-4 mr-2" />
                        <div>
                          <div>Pickup</div>
                          <p className="text-sm text-muted-foreground">Ready for pickup at our restaurant</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(value: 'stripe' | 'cash') => setPaymentMethod(value)}
                    className="space-y-4"
                  >
                    {stripeInfo?.enabled && (
                      <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe" className="flex items-center cursor-pointer flex-1">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <div>
                            <div>Credit Card</div>
                            <p className="text-sm text-muted-foreground">Pay securely online</p>
                          </div>
                        </Label>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center cursor-pointer flex-1">
                        <Banknote className="mr-2 h-4 w-4" />
                        <div>
                          <div>Cash on Delivery</div>
                          <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name*</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        placeholder="Your name" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone*</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        placeholder="Your phone number" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        placeholder="Your email" 
                      />
                    </div>
                    {deliveryMethod === 'delivery' && (
                      <div>
                        <Label htmlFor="address" className="flex justify-between">
                          Delivery Address*
                          <Button 
                            variant="link" 
                            className="p-0 text-restaurant-primary h-auto" 
                            onClick={openMapDialog}
                          >
                            Select on Map
                          </Button>
                        </Label>
                        <Input 
                          id="address" 
                          name="address" 
                          value={customerInfo.address}
                          onChange={handleInputChange}
                          placeholder="Your delivery address" 
                          required={deliveryMethod === 'delivery'}
                        />
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>We deliver within 10 miles of our location</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <Label htmlFor="notes">Special Instructions</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={customerInfo.notes}
                        onChange={handleInputChange}
                        placeholder="Any special instructions for your order"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Delivery Location</DialogTitle>
            <DialogDescription>
              Use the map to pinpoint your exact delivery location
            </DialogDescription>
          </DialogHeader>
          <DeliveryMap onAddressSelect={handleAddressSelect} />
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default OrderPage;
