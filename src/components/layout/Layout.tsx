
import { ReactNode, useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { ChevronUp } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Naudojame hooką, kad peršoktų į viršų pakeitus puslapį
  useScrollToTop();
  
  // "Back to Top" mygtuko būsenos
  const [showButton, setShowButton] = useState(false);
  
  // Stebėti slinkimą ir rodyti/slėpti mygtuką
  useEffect(() => {
    const handleScroll = () => {
      // Rodyti mygtuką, kai nuslenka žemiau nei 300px
      setShowButton(window.scrollY > 300);
    };
    
    // Pridėti event listener
    window.addEventListener('scroll', handleScroll);
    
    // Išvalyti event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Slinkti į viršų paspaudus mygtuką
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      
      {/* Back to Top mygtukas */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all duration-300 z-50"
          aria-label="Grįžti į viršų"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Layout;
