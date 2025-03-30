
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-primary font-bold text-2xl">ponas Obuolys</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">Pagrindinis</Link>
            <Link to="/straipsniai" className="nav-link">Straipsniai</Link>
            <Link to="/naujienos" className="nav-link">Naujienos</Link>
            <div className="relative group">
              <button className="nav-link flex items-center">
                <span>Įrankiai</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg p-2 invisible group-hover:visible transition-all duration-300 opacity-0 group-hover:opacity-100">
                <Link to="/irankiai" className="block px-4 py-2 text-sm text-secondary hover:bg-primary/10 rounded-md">Visi įrankiai</Link>
                <Link to="/irankiai/generuoti" className="block px-4 py-2 text-sm text-secondary hover:bg-primary/10 rounded-md">Turinio generavimas</Link>
                <Link to="/irankiai/analitika" className="block px-4 py-2 text-sm text-secondary hover:bg-primary/10 rounded-md">Analitika</Link>
              </div>
            </div>
            <Link to="/kursai" className="nav-link">Kursai</Link>
            <Link to="/kontaktai" className="nav-link">Kontaktai</Link>
          </nav>
          
          <div className="hidden md:block">
            <Button className="button-primary">Prisijungti</Button>
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-secondary hover:text-primary transition-colors duration-300"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 space-y-2">
            <Link 
              to="/" 
              className="block px-4 py-2 text-secondary hover:bg-primary/10 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pagrindinis
            </Link>
            <Link 
              to="/straipsniai" 
              className="block px-4 py-2 text-secondary hover:bg-primary/10 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Straipsniai
            </Link>
            <Link 
              to="/naujienos" 
              className="block px-4 py-2 text-secondary hover:bg-primary/10 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Naujienos
            </Link>
            <div className="px-4 py-2">
              <div className="flex items-center justify-between text-secondary">
                <span>Įrankiai</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="ml-4 mt-2 space-y-2">
                <Link 
                  to="/irankiai" 
                  className="block px-4 py-2 text-secondary hover:bg-primary/10 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Visi įrankiai
                </Link>
                <Link 
                  to="/irankiai/generuoti" 
                  className="block px-4 py-2 text-secondary hover:bg-primary/10 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Turinio generavimas
                </Link>
                <Link 
                  to="/irankiai/analitika" 
                  className="block px-4 py-2 text-secondary hover:bg-primary/10 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Analitika
                </Link>
              </div>
            </div>
            <Link 
              to="/kursai" 
              className="block px-4 py-2 text-secondary hover:bg-primary/10 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kursai
            </Link>
            <Link 
              to="/kontaktai" 
              className="block px-4 py-2 text-secondary hover:bg-primary/10 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kontaktai
            </Link>
            <div className="px-4 py-2">
              <Button className="w-full button-primary">Prisijungti</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
