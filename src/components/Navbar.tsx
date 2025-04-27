import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PhoneCall, Leaf } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center text-2xl font-serif font-bold text-restaurant-primary">
            <Leaf className="w-6 h-6 mr-2" />
            Garden Café
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="font-medium hover:text-restaurant-primary transition-colors">Home</a>
            <a href="#menu" className="font-medium hover:text-restaurant-primary transition-colors">Menu</a>
            <a href="#about" className="font-medium hover:text-restaurant-primary transition-colors">About</a>
            <a href="#gallery" className="font-medium hover:text-restaurant-primary transition-colors">Gallery</a>
            <a href="#contact" className="font-medium hover:text-restaurant-primary transition-colors">Contact</a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-restaurant-primary hover:bg-restaurant-dark text-white">
              <PhoneCall className="w-4 h-4 mr-2" /> Reserve Table
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-restaurant-dark p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white absolute top-full left-0 w-full shadow-md py-4 px-4 animate-fade-in`}>
          <div className="flex flex-col space-y-4">
            <a href="#home" className="py-2 font-medium hover:text-restaurant-primary" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#menu" className="py-2 font-medium hover:text-restaurant-primary" onClick={() => setMobileMenuOpen(false)}>Menu</a>
            <a href="#about" className="py-2 font-medium hover:text-restaurant-primary" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#gallery" className="py-2 font-medium hover:text-restaurant-primary" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#contact" className="py-2 font-medium hover:text-restaurant-primary" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <Button className="bg-restaurant-primary hover:bg-restaurant-dark text-white w-full">
              <PhoneCall className="w-4 h-4 mr-2" /> Reserve Table
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
