
import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Emma Thompson",
    rating: 5,
    text: "The best Italian food I've had outside of Italy. The atmosphere is cozy and the staff is incredibly friendly. I'll definitely be back!",
    date: "October 15, 2023",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Michael Johnson",
    rating: 4,
    text: "Excellent food and service. The truffle pasta was exceptional and the tiramisu was divine. Perfect spot for our anniversary dinner.",
    date: "December 3, 2023",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Sarah Williams",
    rating: 5,
    text: "Amazing place with authentic cuisine! Every bite was bursting with flavor. The chef clearly puts passion into each dish.",
    date: "January 22, 2024",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Daniel Garcia",
    rating: 5,
    text: "I've been to many Italian restaurants across the city, but SavorDine tops them all. Incredible food, perfect ambiance!",
    date: "March 5, 2024",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonialToShow, setTestimonialToShow] = useState(1);

  // Determine number of testimonials to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setTestimonialToShow(3);
      } else if (window.innerWidth >= 768) {
        setTestimonialToShow(2);
      } else {
        setTestimonialToShow(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + testimonialToShow >= testimonials.length ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - testimonialToShow : prevIndex - 1
    );
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex, 
    Math.min(currentIndex + testimonialToShow, testimonials.length)
  );

  return (
    <section className="py-20 bg-gradient-to-b from-restaurant-light to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-restaurant-dark mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our valued customers have to say about their dining experience.
          </p>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Testimonials Cards */}
          <div className="flex justify-center gap-6 mb-8">
            {visibleTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-restaurant-primary text-restaurant-primary hover:bg-restaurant-primary/10" 
              onClick={prevTestimonial}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-restaurant-primary text-restaurant-primary hover:bg-restaurant-primary/10" 
              onClick={nextTestimonial}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="font-serif font-bold text-xl text-restaurant-primary mb-1">Top Rated</div>
              <div className="text-gray-600">on Google</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="font-serif font-bold text-xl text-restaurant-primary mb-1">Hygiene</div>
              <div className="text-gray-600">Certified</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="font-serif font-bold text-xl text-restaurant-primary mb-1">1,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="font-serif font-bold text-xl text-restaurant-primary mb-1">Award</div>
              <div className="text-gray-600">Winning Chef</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <Card className="shadow-md max-w-md animate-fade-in">
      <CardContent className="p-6">
        {/* Stars */}
        <div className="flex mb-4">
          {Array(5).fill(0).map((_, i) => (
            <Star 
              key={i} 
              className={`w-5 h-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        
        {/* Testimonial Text */}
        <p className="text-gray-700 italic mb-6">"{testimonial.text}"</p>
        
        {/* User Info */}
        <div className="flex items-center">
          {testimonial.image && (
            <img 
              src={testimonial.image} 
              alt={testimonial.name} 
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
          )}
          <div>
            <h4 className="font-medium text-restaurant-dark">{testimonial.name}</h4>
            <p className="text-sm text-gray-500">{testimonial.date}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsSection;
