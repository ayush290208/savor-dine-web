
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-restaurant-primary" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-restaurant-dark">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-gray-700">
            Thank you for your order. We've received your request and are processing it now.
          </p>
          
          <div className="bg-restaurant-light p-6 rounded-lg border border-restaurant-primary/20">
            <p className="text-gray-700 mb-2">
              You will receive a confirmation via email or SMS shortly.
            </p>
            <p className="text-sm text-gray-600">
              For any questions about your order, please contact us at (555) 123-4567.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild className="bg-restaurant-primary hover:bg-restaurant-dark">
              <Link to="/">Return to Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/menu">Browse More Items</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
