import { Link } from 'react-router-dom';
import { SocialLinks } from '@/components/ui/SocialLinks';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white mt-16 w-full">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">ponas Obuolys</h3>
            <p className="text-gray-300 mb-4">
              Dirbtinio intelekto naujienos, įrankiai, kursai ir straipsniai lietuvių kalba.
            </p>

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
                <Link to="/publikacijos" className="text-gray-300 hover:text-primary transition-colors duration-300">
                  Publikacijos
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
            <div className="mt-2 flex justify-center">
              <SocialLinks className="justify-center" />
            </div>
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
