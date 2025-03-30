
import { Link } from 'react-router-dom';
import { Mail, Youtube, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">ponas Obuolys</h3>
            <p className="text-gray-300 mb-4">
              Dirbtinio intelekto naujienos, įrankiai, kursai ir straipsniai lietuvių kalba.
            </p>
            <div className="flex space-x-4">
              <a 
                href="mailto:labas@ponasobuolys.lt" 
                className="text-white hover:text-primary transition-colors duration-300"
                aria-label="Email"
              >
                <Mail className="h-6 w-6" />
              </a>
              <a 
                href="https://www.youtube.com/@ponasobuolys" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors duration-300"
                aria-label="YouTube"
              >
                <Youtube className="h-6 w-6" />
              </a>
              <a 
                href="https://wa.me/message/RSBW27G7DYBVP1" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors duration-300"
                aria-label="WhatsApp"
              >
                <MessageSquare className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Nuorodos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors duration-300">
                  Pagrindinis
                </Link>
              </li>
              <li>
                <Link to="/straipsniai" className="text-gray-300 hover:text-primary transition-colors duration-300">
                  Straipsniai
                </Link>
              </li>
              <li>
                <Link to="/naujienos" className="text-gray-300 hover:text-primary transition-colors duration-300">
                  Naujienos
                </Link>
              </li>
              <li>
                <Link to="/irankiai" className="text-gray-300 hover:text-primary transition-colors duration-300">
                  Įrankiai
                </Link>
              </li>
              <li>
                <Link to="/kursai" className="text-gray-300 hover:text-primary transition-colors duration-300">
                  Kursai
                </Link>
              </li>
              <li>
                <Link to="/kontaktai" className="text-gray-300 hover:text-primary transition-colors duration-300">
                  Kontaktai
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Kontaktai</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <a href="mailto:labas@ponasobuolys.lt" className="text-gray-300 hover:text-primary transition-colors duration-300">
                  labas@ponasobuolys.lt
                </a>
              </li>
              <li className="flex items-start">
                <Youtube className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <a 
                  href="https://www.youtube.com/@ponasobuolys"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-primary transition-colors duration-300"
                >
                  @ponasobuolys
                </a>
              </li>
              <li className="flex items-start">
                <MessageSquare className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <a 
                  href="https://wa.me/message/RSBW27G7DYBVP1"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-primary transition-colors duration-300"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} ponas Obuolys. Visos teisės saugomos.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
