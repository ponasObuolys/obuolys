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
              {/* Dinaminis švytėjimo efektas po kortele */}
{/* Glow sluoksnis su didesniu opacity ir z-10 */}
<div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-80 animate-glow z-10 pointer-events-none"></div>
              {/* Baltos kortelės fonas su permatomumu, kad matytųsi glow */}
<div className="relative bg-white/70 rounded-xl p-6 shadow-lg z-20">
                {/* Permatomas pilkas fonas, kad matytųsi švytėjimas */}
{/* Frosted glass efektas su blur ir permatomumu, kad matytųsi švytėjimas */}
{/* Dar išraiškingesnis Frosted Glass efektas su didesniu blur ir mažesniu opacity */}
<div className="aspect-video rounded-md overflow-hidden bg-gray-200/20 flex items-center justify-center border-4 border-white backdrop-blur-xl backdrop-saturate-150">
                  <LazyImage 
                    src="/obuolys-logo.png" 
                    alt="Ponas Obuolys" 
                    className="w-full h-full object-contain transition-transform hover:scale-110 duration-300"
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
