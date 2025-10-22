import { useState, useEffect } from "react";
import { X, Cookie, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONSENT_KEY, CONSENT_VERSION, type ConsentPreferences } from "./cookie-consent.utils";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem(CONSENT_KEY);

    if (!savedConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    } else {
      try {
        const consent: ConsentPreferences = JSON.parse(savedConsent);
        // Check if consent version matches
        if (consent.version !== CONSENT_VERSION) {
          setIsVisible(true);
        }
      } catch {
        setIsVisible(true);
      }
    }
  }, []);

  const saveConsent = (analytics: boolean) => {
    const consent: ConsentPreferences = {
      necessary: true, // Always true
      analytics,
      version: CONSENT_VERSION,
      timestamp: Date.now(),
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setIsVisible(false);

    // If user declined analytics, clear existing analytics data
    if (!analytics) {
      localStorage.removeItem("obuolys_recent_views");
      sessionStorage.removeItem("obuolys_session_id");
    }
  };

  const acceptAll = () => saveConsent(true);
  const acceptNecessary = () => saveConsent(false);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 pointer-events-none">
      {/* Backdrop - lighter on mobile */}
      <div
        className="absolute inset-0 bg-black/30 sm:bg-black/50 backdrop-blur-[2px] sm:backdrop-blur-sm pointer-events-auto"
        onClick={() => setShowDetails(false)}
      />

      {/* Cookie Banner */}
      <div
        className={cn(
          "relative w-full max-w-2xl bg-card border-t-2 sm:border-2 border-border sm:rounded-lg shadow-2xl pointer-events-auto",
          "max-h-[90vh] overflow-y-auto",
          "transform transition-all duration-300 ease-out",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-4 sm:p-6 pb-3 sm:pb-4">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Cookie className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold mb-1">Slapukai ir privatumas</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Gerbiame jūsų privatumą ir laikomės BDAR/GDPR reikalavimų
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-2 hover:bg-muted rounded transition-colors touch-manipulation"
            aria-label="Uždaryti"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4">
          <p className="text-xs sm:text-sm text-foreground/80 mb-3 sm:mb-4">
            Naudojame slapukus ir vietinę saugyklą, kad pagerintume jūsų naršymo patirtį ir
            suteiktume analitikos funkcijas. Jūsų duomenys niekada nėra perduodami trečiosioms
            šalims.
          </p>

          {/* Cookie Categories */}
          {showDetails && (
            <div className="space-y-3 mb-4 p-4 bg-muted/50 rounded-lg">
              {/* Necessary Cookies */}
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm">Būtini slapukai</h3>
                    <span className="text-xs text-green-500 font-medium">Visada aktyvūs</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reikalingi svetainės veikimui. Saugo sesijos ID ir pagrindinius nustatymus.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Saugoma:</strong> sessionStorage (obuolys_session_id)
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm">Analitikos slapukai</h3>
                    <span className="text-xs text-muted-foreground font-medium">Pasirinktinai</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Padeda mums suprasti, kaip lankytojai naudojasi svetaine. Skaičiuoja peržiūras
                    ir aktyvius skaitytojus.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Saugoma:</strong> localStorage (obuolys_recent_views), Supabase Realtime
                    Presence
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Laikymo laikas:</strong> 30 minučių (recent_views), sesijos metu
                    (presence)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Toggle Details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs sm:text-sm text-primary hover:underline mb-3 sm:mb-4 touch-manipulation"
          >
            {showDetails ? "Slėpti detales" : "Rodyti detales"}
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-4 sm:p-6 pt-3 sm:pt-4 border-t border-border bg-muted/30">
          <Button
            onClick={acceptNecessary}
            variant="outline"
            className="flex-1 h-11 sm:h-10 text-sm touch-manipulation"
          >
            Tik būtini
          </Button>
          <Button
            onClick={acceptAll}
            className="flex-1 h-11 sm:h-10 text-sm bg-primary hover:bg-primary/90 touch-manipulation"
          >
            Priimti visus
          </Button>
        </div>

        {/* Legal Links */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-center">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Daugiau informacijos:{" "}
            <a href="/privatumas" className="text-primary hover:underline touch-manipulation">
              Privatumo politika
            </a>
            {" | "}
            <a href="/slapukai" className="text-primary hover:underline touch-manipulation">
              Slapukų politika
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
