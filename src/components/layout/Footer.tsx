import { SocialLinks } from '@/components/ui/SocialLinks';

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
      </div>
    </footer>
  );
};

export default Footer;
