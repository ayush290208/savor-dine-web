
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Facebook, Instagram, PhoneCall } from "lucide-react";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Show success message
    toast({
      title: "Message Sent!",
      description: "We'll get back to you soon.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      message: ""
    });
  };

  return (
    <section id="contact" className="py-20 bg-restaurant-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-restaurant-dark mb-4">Contact Us</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Have questions or want to get in touch? We'd love to hear from you!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-serif font-bold text-restaurant-dark mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Your name" 
                  required 
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Your email" 
                  required 
                />
              </div>
              <div className="mb-6">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  className="w-full min-h-[120px] p-3 border rounded-md"
                  required
                ></textarea>
              </div>
              <Button type="submit" className="w-full bg-restaurant-primary hover:bg-restaurant-dark text-white">
                Send Message
              </Button>
            </form>
          </div>
          
          {/* Map and Contact Info */}
          <div>
            {/* Map */}
            <div className="mb-8 h-80 rounded-lg overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095910916!2d-74.00926732426903!3d40.74076283608241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sFlatiron%20District%2C%20New%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1650000000000!5e0!3m2!1sen!2s!4v1650000000000!5e0" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Restaurant Location"
              ></iframe>
            </div>
            
            {/* Contact Info */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="mb-6">
                <h4 className="font-serif font-bold text-xl text-restaurant-dark mb-2">Hours</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700">
                  <div>Monday - Friday</div>
                  <div>11:00 AM - 10:00 PM</div>
                  <div>Saturday - Sunday</div>
                  <div>11:00 AM - 11:00 PM</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-serif font-bold text-xl text-restaurant-dark mb-2">Address</h4>
                <p className="text-gray-700">
                  123 Restaurant Street<br />
                  Flatiron District<br />
                  New York, NY 10010
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="font-serif font-bold text-xl text-restaurant-dark mb-2">Contact</h4>
                <p className="text-gray-700 mb-1">Phone: (212) 555-1234</p>
                <p className="text-gray-700">Email: info@savordine.com</p>
              </div>
              
              <div>
                <h4 className="font-serif font-bold text-xl text-restaurant-dark mb-2">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-restaurant-primary hover:text-restaurant-dark transition-colors">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-restaurant-primary hover:text-restaurant-dark transition-colors">
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
