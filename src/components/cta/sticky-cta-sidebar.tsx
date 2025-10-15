import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const stickyMessages = [
  {
    title: "🚀 Greitas AI įrankis?",
    description: "Nuo idėjos iki rezultato per 2 savaites",
    cta: "Užsakyti"
  },
  {
    title: "💡 Turite AI idėją?",
    description: "Nemokama konsultacija su AI ekspertu",
    cta: "Konsultuotis"
  },
  {
    title: "⚡ AI automatizacija",
    description: "Sutaupykite iki 20h per savaitę",
    cta: "Pradėti"
  },
  {
    title: "🎯 Individualūs sprendimai",
    description: "100% pritaikyti Jūsų verslui",
    cta: "Sužinoti"
  },
  {
    title: "💰 AI nuo 500€/mėn",
    description: "Prieinamos kainos, didelis poveikis",
    cta: "Kainos"
  },
  {
    title: "🔥 Konkurentai jau naudoja",
    description: "Nelikite nuošalyje - pradėkite dabar",
    cta: "Pradėti"
  },
  {
    title: "✨ Nemokamas prototipas",
    description: "Išbandykite prieš priimdami sprendimą",
    cta: "Demo"
  },
  {
    title: "🎓 AI mokymai komandai",
    description: "Jūsų darbuotojai mokės naudoti AI",
    cta: "Mokymai"
  },
  {
    title: "📊 ROI per 3 mėnesius",
    description: "Investicija, kuri atsipirks greitai",
    cta: "Skaičiuoti"
  },
  {
    title: "🇱🇹 Lietuvių kalba",
    description: "AI, kuris supranta lietuviškai",
    cta: "Išbandyti"
  },
  {
    title: "🔒 Jūsų duomenys saugūs",
    description: "Jūsų patalpose arba privati debesija",
    cta: "Saugumas"
  },
  {
    title: "📱 Mobilios aplikacijos",
    description: "AI įrankiai iOS ir Android",
    cta: "Pamatyti"
  },
  {
    title: "🎤 Balso valdymas",
    description: "Kalbėkite su AI lietuviškai",
    cta: "Išbandyti"
  },
  {
    title: "📈 30+ projektų",
    description: "Patirtis su įvairiausiais verslais",
    cta: "Atvejai"
  },
  {
    title: "⏱️ 24/7 palaikymas",
    description: "Lietuvių kalba, greitas atsakymas",
    cta: "Susisiekti"
  }
];

export function StickyCtaSidebar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    // Rodo CTA po 3 sekundžių scrollinimo
    const handleScroll = () => {
      if (window.scrollY > 500 && !isDismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= 500) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  useEffect(() => {
    // Keičia žinutę kas 10 sekundžių
    if (isVisible && !isDismissed) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % stickyMessages.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isVisible, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    // Grąžina po 2 minučių
    setTimeout(() => {
      setIsDismissed(false);
    }, 120000);
  };

  const currentMessage = stickyMessages[currentMessageIndex];

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed right-2 sm:right-4 bottom-20 sm:bottom-24 z-40 w-[calc(100%-1rem)] sm:w-72 max-w-sm"
        >
          <div className="bg-gradient-to-br from-primary/95 to-primary text-primary-foreground rounded-lg shadow-2xl p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -z-10" />
            
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors z-10"
              aria-label="Uždaryti"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Content */}
            <div className="pr-6 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Sparkles className="h-4 w-4 flex-shrink-0" />
                <h3 className="font-bold text-sm leading-tight">{currentMessage.title}</h3>
              </div>
              <p className="text-xs mb-4 text-primary-foreground/90 leading-relaxed">
                {currentMessage.description}
              </p>
              <Link to="/verslo-sprendimai">
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
                >
                  {currentMessage.cta}
                </Button>
              </Link>
            </div>

            {/* Progress indicator */}
            <div className="flex gap-1 mt-3 justify-center">
              {stickyMessages.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all ${
                    index === currentMessageIndex
                      ? "w-6 bg-white"
                      : "w-1 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
