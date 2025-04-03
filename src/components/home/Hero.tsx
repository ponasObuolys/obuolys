import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LazyImage from '@/components/ui/lazy-image';

const Hero = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="mb-6">
              <span className="gradient-text">Dirbtinio intelekto</span> publikacijos,<br />
              įrankiai ir kursai
            </h1>
            <p className="text-lg mb-8">
              Sužinokite apie naujausius dirbtinio intelekto įrankius, tendencijas ir kaip juos efektyviai panaudoti savo versle.
              Naujienos, straipsniai ir kursai lietuvių kalba.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/publikacijos">
                <Button className="button-primary w-full sm:w-auto">Naujausios publikacijos</Button>
              </Link>
              <Link to="/kursai">
                <Button className="button-outline w-full sm:w-auto">Pradėti mokytis</Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-50"></div>
              <div className="relative bg-white rounded-xl p-6 shadow-lg">
                <div className="aspect-video rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  <LazyImage 
                    src="/obuolys-logo.png" 
                    alt="Ponas Obuolys" 
                    className="w-3/4 h-3/4 object-contain transition-transform hover:scale-110 duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
