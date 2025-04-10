import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UserDropdown } from '@/components/ui/user-dropdown';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';


const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-primary font-bold text-2xl">ponas Obuolys</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/publikacijos" className="nav-link">Publikacijos</Link>
            {/* <Link to="/naujienos" className="nav-link">Naujienos</Link> */}
            <Link to="/kursai" className="nav-link">Kursai</Link>
            <Link to="/irankiai" className="nav-link">Įrankiai</Link>
            <Link to="/kontaktai" className="nav-link">Kontaktai</Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            {/* Support Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="nav-link flex items-center">
                  Paremk <Heart className="ml-1 h-4 w-4 text-red-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a href="https://patreon.com/ponasObuolys" target="_blank" rel="noopener noreferrer">
                    Patreon
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="https://www.youtube.com/@ponasObuolys/join" target="_blank" rel="noopener noreferrer">
                    YouTube Narystė
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <UserDropdown />
            ) : (
              <Link to="/auth">
                <Button className="button-primary">Prisijungti</Button>
              </Link>
            )}
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
        <div className="md:hidden bg-white shadow-md w-full">
          <div className="container mx-auto py-3 space-y-2">
            <Link 
              to="/" 
              className="block px-4 py-2 text-secondary hover:bg-primary/10 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pagrindinis
            </Link>
            <Link
              to="/publikacijos"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Publikacijos
            </Link>
            {/* <Link
              to="/naujienos"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Naujienos
            </Link> */}
            <Link
              to="/kursai"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kursai
            </Link>
            <Link
              to="/irankiai"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Įrankiai
            </Link>
            <Link 
              to="/kontaktai" 
              className="block px-4 py-2 text-secondary hover:bg-primary/10 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kontaktai
            </Link>
            
            {/* Mobile Support Links */}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <a 
                href="https://patreon.com/ponasObuolys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Paremk per Patreon
              </a>
              <a 
                href="https://www.youtube.com/@ponasObuolys/join" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tapk YouTube Nariu
              </a>
            </div>

            <div className="px-4 py-2">
              {user ? (
                <Link 
                  to="/auth" 
                  className="block w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                >
                  <Button variant="outline" className="w-full justify-start">
                    Mano paskyra
                  </Button>
                </Link>
              ) : (
                <Link 
                  to="/auth" 
                  className="block w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full button-primary">Prisijungti</Button>
                </Link>
              )}
            </div>
            <div className="px-4 py-2 flex justify-center">

            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
