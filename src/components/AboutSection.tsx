
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1971&auto=format&fit=crop" 
              alt="Restaurant Interior" 
              className="w-full h-[500px] object-cover rounded-lg shadow-xl"
            />
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-64 h-64 border-8 border-restaurant-secondary rounded-lg -z-10"></div>
          </div>
          
          {/* Content Side */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-restaurant-dark mb-6">Our Story</h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Founded in 2005, Garden Café has been serving authentic cuisine in the heart of Inwood for almost two decades. Our passion for culinary excellence and warm hospitality has made us a beloved destination for food enthusiasts.
            </p>
            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              Every dish at Garden Café is crafted with the finest ingredients, many sourced locally, and prepared with traditional techniques that honor our culinary heritage while embracing modern innovations.
            </p>
            
            {/* Chef Quote */}
            <blockquote className="border-l-4 border-restaurant-primary pl-4 italic text-gray-700 mb-8">
              "Cooking is an art that brings people together. At Garden Café, we don't just serve food; we create memorable experiences."
              <footer className="text-restaurant-primary font-medium mt-2">- James Wilson, Head Chef</footer>
            </blockquote>
            
            <Button className="bg-restaurant-primary hover:bg-restaurant-dark text-white">
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
