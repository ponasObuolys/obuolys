import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LazyImage from '@/components/ui/lazy-image';

const Hero = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Kairė pusė: ištempiama flex kolona, mygtukai centre ir apačioje */}
{/* Kairė pusė: visa kolona, tekstas viršuje, mygtukai centre apačioje */}
{/* Kairė pusė: kolona, elementai centre (mobile) arba kairėje (desktop), tarpai valdomi gap */}
{/* Kairė pusė: visada centre */}
<div className="flex flex-col items-center animate-fade-in min-h-[340px] gap-4">
            {/* Antraštė: centre mobile, kairėje desktop */}
<h1 className="mb-6 text-center">
              <span className="gradient-text">Dirbtinio intelekto</span> publikacijos,<br />
              įrankiai ir kursai
            </h1>
            <p className="text-lg mb-3 text-center">
              Sužinokite apie naujausius dirbtinio intelekto įrankius, tendencijas ir kaip juos efektyviai panaudoti savo versle.
              Naujienos, straipsniai ir kursai lietuvių kalba.
            </p>
            {/* Mygtukų konteineris centre po tekstu */}
<div className="flex justify-center w-full gap-4">
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
