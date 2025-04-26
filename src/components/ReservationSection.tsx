
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { PhoneCall, ShoppingCart } from "lucide-react";

const ReservationSection = () => {
  const { toast } = useToast();
  const [reservationData, setReservationData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: "",
    notes: ""
  });

  const [orderData, setOrderData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });

  const handleReservationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReservationData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form (simple validation)
    if (!reservationData.name || !reservationData.phone || !reservationData.date || !reservationData.time) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Form is valid, show success message
    toast({
      title: "Reservation Received!",
      description: "We'll confirm your reservation shortly.",
    });
    
    // Reset form
    setReservationData({
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      guests: "",
      notes: ""
    });
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form (simple validation)
    if (!orderData.name || !orderData.phone || !orderData.address) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Form is valid, show success message
    toast({
      title: "Order Received!",
      description: "Your delicious food is on the way!",
    });
    
    // Reset form
    setOrderData({
      name: "",
      phone: "",
      address: "",
      notes: ""
    });
  };

  return (
    <section id="reservations" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-restaurant-dark mb-4">Make a Reservation or Order Online</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Reserve a table for a special dining experience or order your favorite dishes to enjoy at home
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardContent className="p-0">
            <Tabs defaultValue="reservation" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reservation" className="py-4 text-lg">
                  <PhoneCall className="mr-2 h-5 w-5" /> Table Reservation
                </TabsTrigger>
                <TabsTrigger value="order" className="py-4 text-lg">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Order Takeaway
                </TabsTrigger>
              </TabsList>
              
              {/* Reservation Form */}
              <TabsContent value="reservation" className="p-6">
                <form onSubmit={handleReservationSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label htmlFor="res-name">Name*</Label>
                      <Input 
                        id="res-name" 
                        name="name" 
                        value={reservationData.name} 
                        onChange={handleReservationChange} 
                        placeholder="Your name" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="res-phone">Phone*</Label>
                      <Input 
                        id="res-phone" 
                        name="phone" 
                        value={reservationData.phone} 
                        onChange={handleReservationChange} 
                        placeholder="Your phone number" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="res-email">Email</Label>
                      <Input 
                        id="res-email" 
                        name="email" 
                        type="email" 
                        value={reservationData.email} 
                        onChange={handleReservationChange} 
                        placeholder="Your email" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="res-guests">Number of Guests</Label>
                      <Input 
                        id="res-guests" 
                        name="guests" 
                        type="number" 
                        min="1" 
                        max="20" 
                        value={reservationData.guests} 
                        onChange={handleReservationChange} 
                        placeholder="Number of guests" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="res-date">Date*</Label>
                      <Input 
                        id="res-date" 
                        name="date" 
                        type="date" 
                        value={reservationData.date} 
                        onChange={handleReservationChange} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="res-time">Time*</Label>
                      <Input 
                        id="res-time" 
                        name="time" 
                        type="time" 
                        value={reservationData.time} 
                        onChange={handleReservationChange} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <Label htmlFor="res-notes">Special Requests</Label>
                    <textarea
                      id="res-notes"
                      name="notes"
                      value={reservationData.notes}
                      onChange={handleReservationChange}
                      placeholder="Any special requests or dietary requirements"
                      className="w-full min-h-[100px] p-3 border rounded-md"
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full bg-restaurant-primary hover:bg-restaurant-dark text-white text-lg py-6">
                    Book Table
                  </Button>
                </form>
              </TabsContent>
              
              {/* Order Form */}
              <TabsContent value="order" className="p-6">
                <form onSubmit={handleOrderSubmit}>
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <div>
                      <Label htmlFor="order-name">Name*</Label>
                      <Input 
                        id="order-name" 
                        name="name" 
                        value={orderData.name} 
                        onChange={handleOrderChange} 
                        placeholder="Your name" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="order-phone">Phone*</Label>
                      <Input 
                        id="order-phone" 
                        name="phone" 
                        value={orderData.phone} 
                        onChange={handleOrderChange} 
                        placeholder="Your phone number" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="order-address">Delivery Address*</Label>
                      <Input 
                        id="order-address" 
                        name="address" 
                        value={orderData.address} 
                        onChange={handleOrderChange} 
                        placeholder="Your delivery address" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="order-notes">Order Notes</Label>
                      <textarea
                        id="order-notes"
                        name="notes"
                        value={orderData.notes}
                        onChange={handleOrderChange}
                        placeholder="Any special instructions for your order"
                        className="w-full min-h-[100px] p-3 border rounded-md"
                      ></textarea>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-restaurant-primary hover:bg-restaurant-dark text-white text-lg py-6">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Place Order
                  </Button>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    After placing your order, you'll be redirected to select menu items.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ReservationSection;
