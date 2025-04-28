
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const viewMenu = () => {
    navigate('/order');
  };
  
  // Function to handle smooth scrolling to sections on homepage
  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center text-2xl font-serif font-bold text-restaurant-primary">
            <Menu className="w-6 h-6 mr-2" />
            Garden Café
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="font-medium hover:text-restaurant-primary transition-colors">Home</button>
            <button onClick={() => scrollToSection('menu')} className="font-medium hover:text-restaurant-primary transition-colors">Menu</button>
            <button onClick={() => scrollToSection('about')} className="font-medium hover:text-restaurant-primary transition-colors">About</button>
            <button onClick={() => scrollToSection('gallery')} className="font-medium hover:text-restaurant-primary transition-colors">Gallery</button>
            <button onClick={() => scrollToSection('contact')} className="font-medium hover:text-restaurant-primary transition-colors">Contact</button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              className="bg-restaurant-primary hover:bg-restaurant-dark text-white"
              onClick={viewMenu}
            >
              <ShoppingCart className="w-4 h-4 mr-2" /> View Menu
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
            <button onClick={() => scrollToSection('home')} className="py-2 font-medium hover:text-restaurant-primary">Home</button>
            <button onClick={() => scrollToSection('menu')} className="py-2 font-medium hover:text-restaurant-primary">Menu</button>
            <button onClick={() => scrollToSection('about')} className="py-2 font-medium hover:text-restaurant-primary">About</button>
            <button onClick={() => scrollToSection('gallery')} className="py-2 font-medium hover:text-restaurant-primary">Gallery</button>
            <button onClick={() => scrollToSection('contact')} className="py-2 font-medium hover:text-restaurant-primary">Contact</button>
            <Button className="bg-restaurant-primary hover:bg-restaurant-dark text-white w-full" onClick={() => {
              setMobileMenuOpen(false);
              navigate('/order');
            }}>
              <ShoppingCart className="w-4 h-4 mr-2" /> View Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
