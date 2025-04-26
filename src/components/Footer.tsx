
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Facebook, Instagram, PhoneCall, ShoppingCart, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleQuickAdminLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'mrvirenderrai692@gmail.com',
        password: 'ayush000#'
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Admin Login Successful",
        description: "Redirecting to admin dashboard",
      });

      navigate('/admin');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-restaurant-dark text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">SavorDine</h3>
            <p className="mb-4 text-gray-300">
              Authentic Italian cuisine in the heart of New York City. We bring the flavors of Italy to your table.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#menu" className="text-gray-300 hover:text-white transition-colors">Menu</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#reservations" className="text-gray-300 hover:text-white transition-colors">Reservations</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300">
              <p className="mb-2">123 Restaurant Street</p>
              <p className="mb-2">Flatiron District, New York</p>
              <p className="mb-2">NY 10010</p>
              <p className="mb-2">Phone: (212) 555-1234</p>
              <p>Email: info@savordine.com</p>
            </address>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for special offers and updates.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Your email address" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button 
                type="submit" 
                className="bg-restaurant-secondary hover:bg-restaurant-accent text-restaurant-dark"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SavorDine. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleQuickAdminLogin} 
                className="text-gray-400 hover:text-white"
              >
                <LogIn className="mr-2 h-4 w-4" /> Quick Admin Login
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-40">
        <Button 
          className="rounded-full bg-restaurant-primary hover:bg-restaurant-dark text-white h-14 w-14 p-0"
          onClick={() => window.location.href = "#reservations"}
        >
          <PhoneCall className="h-6 w-6" />
        </Button>
        <Button 
          className="rounded-full bg-restaurant-secondary hover:bg-restaurant-accent text-restaurant-dark h-14 w-14 p-0"
          onClick={() => window.location.href = "#reservations"}
        >
          <ShoppingCart className="h-6 w-6" />
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
