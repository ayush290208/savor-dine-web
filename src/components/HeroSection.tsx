
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop" 
          alt="Restaurant Ambiance" 
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-6 animate-fade-in">
            Savor Every Bite at <span className="text-restaurant-secondary">SavorDine</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in" style={{animationDelay: "0.2s"}}>
            Authentic Italian cuisine, made with love in New York City
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in" style={{animationDelay: "0.4s"}}>
            <Button className="bg-restaurant-primary hover:bg-restaurant-dark text-white text-lg px-8 py-6">
              <ShoppingCart className="w-5 h-5 mr-2" /> Order Online
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              View Menu
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
