/**
 * Calculator CTA Component
 * Promotes project calculator lead magnet
 */

import { Link } from 'react-router-dom';
import { Calculator, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShinyButton } from '@/components/ui/shiny-button';
import { Card } from '@/components/ui/card';

interface CalculatorCTAProps {
  variant?: 'default' | 'compact';
}

export function CalculatorCTA({ variant = 'default' }: CalculatorCTAProps) {
  if (variant === 'compact') {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Calculator className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-2">
              Kiek kainuotų jūsų projektas?
            </h3>
            <p className="text-sm text-foreground/70 mb-4">
              Sužinokite orientacinę kainą ir trukmę per 2 minutes.
            </p>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/skaiciuokle">
                Skaičiuoti Dabar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 md:p-12">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
      </div>

      <div className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Calculator className="w-8 h-8 text-white" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Kiek Kainuotų Jūsų React Projektas?
          </h2>

          {/* Description */}
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Nemokamai apskaičiuokite orientacinę kainą ir trukmę jūsų React/TypeScript projektui. Rezultatai per 2 minutes.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-white">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">2 min skaičiavimas</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Tikslūs įkainiai</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Nemokama konsultacija</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/skaiciuokle">
              <ShinyButton size="lg">
                Pradėti Skaičiuoti
                <ArrowRight className="w-5 h-5" />
              </ShinyButton>
            </Link>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/verslo-sprendimai#portfolio">
                Peržiūrėti Portfolio
              </Link>
            </Button>
          </div>

          {/* Trust indicator */}
          <p className="text-sm text-white/70 mt-6">
            ✓ 5+ sėkmingi projektai • ✓ Vidutinė kaina €8,500 • ✓ 6-10 savaičių pristatymas
          </p>
        </div>
      </div>
    </div>
  );
}
