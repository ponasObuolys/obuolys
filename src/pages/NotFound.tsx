
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import LazyImage from '@/components/ui/lazy-image';
import { BusinessSolutionsCTA } from '@/components/cta/business-solutions-cta';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Puslapis nerastas – Ponas Obuolys</title>
        <meta name="description" content="Ieškomas puslapis nerastas. Grįžkite į pagrindinį puslapį arba naršykite po mūsų turinį." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="dark-card text-center">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 rounded-full bg-foreground/40"></span>
                <span className="text-sm text-foreground/60">Klaida! 404</span>
              </div>

              {/* Avatar with character */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-border bg-card">
                    <LazyImage
                      src="/obuolys-logo.png"
                      alt="Ponas Obuolys - Confused"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Thinking emoji overlay */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center">
                    <span className="text-2xl">🤔</span>
                  </div>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                Puslapis nerastas.
              </h1>

              <p className="text-xl text-foreground/80 mb-8 max-w-md mx-auto">
                Ieškomas puslapis neegzistuoja.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/">
                  <Button className="button-primary w-full sm:w-auto">
                    Grįžti į pradžią
                  </Button>
                </Link>
                <Link to="/publikacijos">
                  <Button className="button-outline w-full sm:w-auto">
                    Peržiūrėti mano darbą →
                  </Button>
                </Link>
              </div>

              {/* Social links section */}
              <div className="border-t border-border pt-8">
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <span className="w-2 h-2 rounded-full bg-foreground/40"></span>
                  <span className="text-sm text-foreground/60">Sekite mane</span>
                </div>

                <div className="flex justify-center gap-4">
                  <a
                    href="https://www.youtube.com/@ponasObuolys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>

                  <a
                    href="https://www.facebook.com/ponasObuolys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  <a
                    href="https://www.instagram.com/ponasObuolys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.73-3.016-1.8L7.583 14.1c.26.486.767.8 1.33.8.827 0 1.49-.663 1.49-1.49s-.663-1.49-1.49-1.49c-.563 0-1.07.314-1.33.8L5.433 11.732c.568-1.07 1.719-1.8 3.016-1.8 1.878 0 3.395 1.517 3.395 3.395s-1.517 3.395-3.395 3.395z"/>
                    </svg>
                  </a>

                  <a
                    href="https://chat.whatsapp.com/BnFnb6yznVH6vMYlEQx8cy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label="Prisijungti prie WhatsApp grupės"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.488"/>
                    </svg>
                  </a>
                </div>
              </div>

              <div className="mt-8 text-sm text-foreground/50">
                <p>© {new Date().getFullYear()} Ponas Obuolys – AI specialistas Lietuvoje</p>
              </div>
            </div>

            {/* CTA - Puslapis nerastas, bet AI sprendimai - taip! */}
            <div className="mt-12">
              <BusinessSolutionsCTA variant="compact" context="article" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
