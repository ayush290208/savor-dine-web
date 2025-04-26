
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const images: GalleryImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
    alt: "Restaurant Interior",
    category: "ambiance"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
    alt: "Chef Preparing Food",
    category: "kitchen"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop",
    alt: "Pizza Dish",
    category: "dishes"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop",
    alt: "Table Setting",
    category: "ambiance"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=1770&auto=format&fit=crop",
    alt: "Pasta Dish",
    category: "dishes"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1971&auto=format&fit=crop",
    alt: "Restaurant Interior Night",
    category: "ambiance"
  }
];

const GallerySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Calculate visible images (3 at a time, centered around currentIndex)
  const getVisibleImages = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % images.length;
      result.push(images[index]);
    }
    return result;
  };

  const visibleImages = getVisibleImages();

  return (
    <section id="gallery" className="py-20 bg-restaurant-dark text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Gallery</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Take a visual journey through our restaurant, dishes, and the culinary magic that happens in our kitchen
          </p>
        </div>
        
        {/* Gallery Carousel */}
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
            {visibleImages.map((image, idx) => (
              <div 
                key={image.id} 
                className={`
                  relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300
                  ${idx === 1 ? 'md:scale-110 z-10' : 'opacity-80 hover:opacity-100'}
                `}
                onClick={() => openModal(image)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-0 transition-all duration-300"></div>
              </div>
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-restaurant-secondary text-restaurant-secondary hover:bg-restaurant-secondary/10" 
              onClick={prevImage}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-restaurant-secondary text-restaurant-secondary hover:bg-restaurant-secondary/10" 
              onClick={nextImage}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {selectedImage && (
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt} 
              className="w-full h-auto object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;
