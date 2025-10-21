import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LazyImage from '@/components/ui/lazy-image';

const Hero = () => {

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="dark-card">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Text content */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-left">
                  Aš esu <span className="text-primary">ponas Obuolys</span>
                </h1>

                <p className="text-xl text-foreground/90 leading-relaxed text-left">
                  Dirbtinio intelekto specialistas iš Lietuvos.
                  Šiuo metu kuriu AI sprendimus ir konsultuoju verslo įmones apie dirbtinio intelekto galimybes.
                </p>

                {/* Action button */}
                <div className="flex justify-center lg:justify-start pt-4">
                  <Link to="/kontaktai?type=KONSULTACIJA">
                    <Button className="button-primary">
                      Konsultuotis
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right side - Avatar with badge */}
              <div className="flex justify-center lg:justify-end">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-border bg-card">
                      <LazyImage
                        src="/obuolys-logo.png"
                        alt="Ponas Obuolys Avatar"
                        width={256}
                        height={256}
                        priority={true}
                        className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                      />
                    </div>
                  </div>
                  <Link to="/kontaktai?type=KONSULTACIJA" className="status-available cursor-pointer hover:bg-accent/20 transition-colors">
                    AKTYVIAI KONSULTUOJU
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Projects section preview */}
          <div className="mt-16">
            {/* Project preview cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI Naujienos */}
              <Link to="/publikacijos" className="project-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">AN</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-left">AI Naujienos</h3>
                    <p className="text-sm text-foreground/90 text-left">Publikacijos, Straipsniai</p>
                  </div>
                  <svg className="w-5 h-5 text-foreground/40 group-hover:text-foreground transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              {/* Kursai */}
              <Link to="/kursai" className="project-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">K</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-left">Kursai</h3>
                    <p className="text-sm text-foreground/90 text-left">Mokymai, Konsultacijos</p>
                  </div>
                  <svg className="w-5 h-5 text-foreground/40 group-hover:text-foreground transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              {/* Įrankiai */}
              <Link to="/irankiai" className="project-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">Į</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-left">Įrankiai</h3>
                    <p className="text-sm text-foreground/90 text-left">AI sprendimai</p>
                  </div>
                  <svg className="w-5 h-5 text-foreground/40 group-hover:text-foreground transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
