
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
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

        {/* Blog Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-serif font-bold text-restaurant-dark text-center mb-12">Garden Café Blog</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard 
              title="Experience the Best of New American Cuisine with a Twist"
              date="April 15, 2025"
              image="public/lovable-uploads/736b4d75-282d-4f22-bf8d-cc5620769c86.png"
              excerpt="Welcome to Garden Café Inwood, where culinary creativity meets familiar flavors. Nestled in a charming garden setting, our café presents a unique dining experience that combines new American dishes, refreshing cocktails, and a warm, inviting atmosphere."
            />
            
            <BlogCard 
              title="Celebrating Sustainable Dining Practices"
              date="March 28, 2025"
              image="https://images.unsplash.com/photo-1560341286-747b9461a8f9?q=80&w=1887&auto=format&fit=crop"
              excerpt="At Garden Café, we believe in responsible dining. Learn how we're implementing eco-friendly practices, sourcing ingredients from local farmers, and reducing our environmental footprint while enhancing your dining experience."
            />
            
            <BlogCard 
              title="Behind the Scenes: Meet Our Culinary Team"
              date="February 12, 2025"
              image="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=1887&auto=format&fit=crop"
              excerpt="Get to know the talented chefs and culinary experts who bring passion and creativity to every dish at Garden Café. Their diverse backgrounds and shared commitment to excellence make our menu truly special."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface BlogCardProps {
  title: string;
  date: string;
  image: string;
  excerpt: string;
}

const BlogCard = ({ title, date, image, excerpt }: BlogCardProps) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="h-56 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <p className="text-sm text-restaurant-primary font-medium mb-2">{date}</p>
        <h3 className="font-serif font-bold text-xl text-restaurant-dark mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <Button variant="link" className="text-restaurant-primary p-0 hover:text-restaurant-dark">
          Read More
        </Button>
      </div>
    </Card>
  );
};

export default AboutSection;
