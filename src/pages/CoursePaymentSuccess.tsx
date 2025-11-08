import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const GOOGLE_FORM_URL = 'https://forms.gle/WVZfhQbikxDcSxtS6';

/**
 * Sėkmingo kurso mokėjimo puslapis
 * Automatiškai nukreipia į Google Forms registraciją
 */
export default function CoursePaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Jei nėra session_id, nukreipti į kursų puslapį
    if (!sessionId) {
      navigate('/kursai');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, navigate]);

  const handleRedirect = () => {
    setIsRedirecting(true);
    window.location.href = GOOGLE_FORM_URL;
  };

  const handleManualRedirect = () => {
    handleRedirect();
  };

  if (!sessionId) {
    return null; // Nukreipiama į /kursai
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-400">
            Mokėjimas sėkmingas! 🎉
          </CardTitle>
          <CardDescription className="text-lg">
            Ačiū už įsigytą kursą "KAIP PRADĖTI PROGRAMUOTI SU DI"
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Informacija */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Kas toliau?
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>
                  Mokėjimo patvirtinimas išsiųstas jūsų el. paštu (patikrinkite
                  spam aplanką)
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📋</span>
                <span>
                  Dabar turite užpildyti registracijos formą, kad gautumėte
                  prieigą prie kurso
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>
                  Per 24 valandas gausite el. laišką su kurso detalėmis ir
                  prieigos informacija
                </span>
              </li>
            </ul>
          </div>

          {/* Auto redirect message */}
          <div className="text-center space-y-4">
            {isRedirecting ? (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Nukreipiama į registracijos formą...</span>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground">
                  Automatiškai būsite nukreipti į registracijos formą po{' '}
                  <span className="font-bold text-primary">{countdown}</span>{' '}
                  sekundžių
                </p>

                <Button
                  size="lg"
                  onClick={handleManualRedirect}
                  className="w-full sm:w-auto"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Pereiti į registracijos formą dabar
                </Button>
              </>
            )}
          </div>

          {/* Saugumas */}
          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            <p>
              Mokėjimas ID: <code className="text-xs">{sessionId}</code>
            </p>
            <p className="mt-2">
              Jūsų mokėjimas saugiai apdorotas per{' '}
              <span className="font-semibold">Stripe</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
