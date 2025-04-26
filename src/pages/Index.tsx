
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import GallerySection from "@/components/GallerySection";
import ReservationSection from "@/components/ReservationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="font-sans">
      <Navbar />
      <HeroSection />
      <MenuSection />
      <AboutSection />
      <TestimonialsSection />
      <GallerySection />
      <ReservationSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
