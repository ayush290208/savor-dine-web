
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart } from "lucide-react";

// Menu item interface
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

// Sample menu data
const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, basil",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=1974&auto=format&fit=crop",
    category: "mains"
  },
  {
    id: 2,
    name: "Truffle Pasta",
    description: "Homemade pasta with black truffle and parmesan",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1770&auto=format&fit=crop",
    category: "mains"
  },
  {
    id: 3,
    name: "Caprese Salad",
    description: "Tomato, fresh mozzarella, basil, balsamic glaze",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1608032077018-c9aad9565d29?q=80&w=1974&auto=format&fit=crop",
    category: "starters"
  },
  {
    id: 4,
    name: "Tiramisu",
    description: "Classic Italian dessert with mascarpone and espresso",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1887&auto=format&fit=crop",
    category: "desserts"
  },
  {
    id: 5,
    name: "Bruschetta",
    description: "Toasted bread with tomatoes, garlic and basil",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?q=80&w=1974&auto=format&fit=crop",
    category: "starters"
  },
  {
    id: 6,
    name: "Panna Cotta",
    description: "Italian dessert with cream, vanilla and berries",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1887&auto=format&fit=crop",
    category: "desserts"
  }
];

const MenuSection = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const goToOrder = () => {
    navigate('/order');
  };

  return (
    <section id="menu" className="py-20 bg-restaurant-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-restaurant-dark mb-4">Our Menu</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore our carefully crafted menu featuring authentic Italian dishes made with the freshest ingredients
          </p>
        </div>
        
        <Tabs defaultValue="all" className="max-w-4xl mx-auto">
          <TabsList className="mb-8 flex justify-center">
            <TabsTrigger value="all" className="text-lg px-5">All</TabsTrigger>
            <TabsTrigger value="starters" className="text-lg px-5">Starters</TabsTrigger>
            <TabsTrigger value="mains" className="text-lg px-5">Main Courses</TabsTrigger>
            <TabsTrigger value="desserts" className="text-lg px-5">Desserts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onOrderClick={goToOrder} />
            ))}
          </TabsContent>
          
          <TabsContent value="starters" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.filter(item => item.category === "starters").map((item) => (
              <MenuItemCard key={item.id} item={item} onOrderClick={goToOrder} />
            ))}
          </TabsContent>
          
          <TabsContent value="mains" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.filter(item => item.category === "mains").map((item) => (
              <MenuItemCard key={item.id} item={item} onOrderClick={goToOrder} />
            ))}
          </TabsContent>
          
          <TabsContent value="desserts" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.filter(item => item.category === "desserts").map((item) => (
              <MenuItemCard key={item.id} item={item} onOrderClick={goToOrder} />
            ))}
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-restaurant-primary hover:bg-restaurant-dark text-white text-lg"
            onClick={goToOrder}
          >
            <ShoppingCart className="w-5 h-5 mr-2" /> Order Now
          </Button>
        </div>
      </div>
    </section>
  );
};

const MenuItemCard = ({ item, onOrderClick }: { item: MenuItem, onOrderClick: () => void }) => {
  return (
    <Card className="overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer" onClick={onOrderClick}>
      <div className="h-48 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif font-bold text-xl text-restaurant-dark">{item.name}</h3>
          <span className="font-medium text-restaurant-primary">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-gray-600">{item.description}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3 w-full border-restaurant-primary text-restaurant-primary hover:bg-restaurant-primary hover:text-white"
        >
          <ShoppingCart className="w-4 h-4 mr-2" /> Order Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuSection;
