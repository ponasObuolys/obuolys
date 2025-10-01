import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LazyImage from '@/components/ui/lazy-image';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

const Hero = () => {
  const { toast } = useToast();

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('labas@ponasobuolys.lt');
      toast({
        title: "El. paštas nukopijuotas!",
        description: "labas@ponasobuolys.lt",
        duration: 3000,
      });
    } catch {
      toast({
        title: "Klaida",
        description: "Nepavyko nukopijuoti el. pašto",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="dark-card">
            {/* Status badge */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground/60">AI Specialistas</span>
              </div>
              <div className="status-available">
                AKTYVIAI KONSULTUOJU
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Text content */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                  Aš esu <span className="text-primary">ponas Obuolys</span>
                </h1>

                <p className="text-xl text-foreground/80 leading-relaxed">
                  Dirbtinio intelekto specialistas iš Lietuvos.
                  Šiuo metu kuriu AI sprendimus ir konsultuoju verslo įmones apie dirbtinio intelekto galimybes.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to="/kontaktai">
                    <Button className="button-primary w-full sm:w-auto">
                      Konsultuotis
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleCopyEmail}
                    className="button-outline w-full sm:w-auto flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Kopijuoti El. paštą
                  </Button>
                </div>
              </div>

              {/* Right side - Avatar */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-border bg-card">
                    <LazyImage
                      src="/obuolys-logo.png"
                      alt="Ponas Obuolys Avatar"
                      className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                    />
                  </div>
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold">AN</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">AI Naujienos</h3>
                    <p className="text-sm text-foreground/60">Publikacijos, Straipsniai</p>
                  </div>
                  <svg className="w-5 h-5 text-foreground/40 ml-auto group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              {/* Kursai */}
              <Link to="/kursai" className="project-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold">K</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Kursai</h3>
                    <p className="text-sm text-foreground/60">Mokymai, Konsultacijos</p>
                  </div>
                  <svg className="w-5 h-5 text-foreground/40 ml-auto group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              {/* Įrankiai */}
              <Link to="/irankiai" className="project-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                    <span className="text-white font-bold">Į</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Įrankiai</h3>
                    <p className="text-sm text-foreground/60">AI sprendimai</p>
                  </div>
                  <svg className="w-5 h-5 text-foreground/40 ml-auto group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
