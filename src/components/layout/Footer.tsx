import { SocialLinks } from '@/components/ui/SocialLinks';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer 
      className="bg-secondary text-white mt-16 w-full"
      itemScope 
      itemType="https://schema.org/WPFooter"
      role="contentinfo"
    >
      <div className="container mx-auto py-6">
        {/* SEO-optimized structured data */}
        <div itemScope itemType="https://schema.org/Person" className="hidden">
          <meta itemProp="name" content="ponas Obuolys" />
          <meta itemProp="jobTitle" content="AI specialistas" />
          <meta itemProp="description" content="Dirbtinio intelekto naujienos, įrankiai, kursai ir straipsniai lietuvių kalba" />
          <meta itemProp="email" content="labas@ponasobuolys.lt" />
          <meta itemProp="url" content="https://ponasobuolys.lt" />
        </div>

        {/* Compact social links section */}
        <div className="text-center">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Susisiekite su manimi</h2>
          <SocialLinks className="justify-center" />
        </div>

        {/* Legal links */}
        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <Link to="/privatumas" className="hover:text-primary transition-colors">
              Privatumo politika
            </Link>
            <span className="text-gray-600">•</span>
            <Link to="/slapukai" className="hover:text-primary transition-colors">
              Slapukų politika
            </Link>
            <span className="text-gray-600">•</span>
            <a href="mailto:labas@ponasobuolys.lt" className="hover:text-primary transition-colors">
              labas@ponasobuolys.lt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
