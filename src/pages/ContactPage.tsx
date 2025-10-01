
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Youtube, MessageSquare, Instagram, Facebook } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { secureLogger } from '@/utils/browserLogger';

import { Helmet } from 'react-helmet-async';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    messageType: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, messageType: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save contact message to database
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: `[${formData.messageType}] ${formData.subject}`,
            message: formData.message,
            status: 'unread'
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Žinutė išsiųsta",
        description: "Dėkojame už jūsų žinutę. Susisieksime kuo greičiau.",
        variant: "default",
      });
      
      setFormData({
        name: '',
        email: '',
        messageType: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      secureLogger.error('Error saving contact message', { error });
      toast({
        title: "Klaida",
        description: "Nepavyko išsiųsti žinutės. Bandykite dar kartą arba susisiekite el. paštu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Kontaktai | Ponas Obuolys</title>
        <meta name="description" content="Susisiekite su Ponas Obuolys dėl AI konsultacijų, bendradarbiavimo ar pasiūlykite AI naujieną bendruomenei." />
        <meta property="og:title" content="Kontaktai | Ponas Obuolys" />
        <meta property="og:description" content="Susisiekite su Ponas Obuolys dėl AI konsultacijų, bendradarbiavimo ar pasiūlykite AI naujieną bendruomenei." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ponasobuolys.lt/kontaktai" />
        <meta property="og:image" content="https://ponasobuolys.lt/og-cover.jpg" />
      </Helmet>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="dark-card text-center mb-8">
              <div className="flex items-center gap-3 mb-8 justify-center">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                <span className="text-sm text-foreground/60">Konsultacijos</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Susisiekite su manimi
              </h1>

              <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
                Turite idėją ir reikalinga dizaino pagalba? Susisiekite dabar
              </p>
            </div>
          
            {/* Contact Form */}
            <div className="dark-card">
              <h2 className="text-2xl font-bold text-foreground mb-6">Susisiekite</h2>
                
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-2">
                      Vardas
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Vardas"
                      className="bg-background border-border text-foreground placeholder:text-foreground/50"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">
                      El. paštas
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="El. paštas"
                      className="bg-background border-border text-foreground placeholder:text-foreground/50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="messageType" className="block text-sm font-medium text-foreground/80 mb-2">
                    Žinutės tipas
                  </label>
                  <Select value={formData.messageType} onValueChange={handleSelectChange}>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Pasirinkite žinutės tipą" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="KONSULTACIJA">💼 AI Konsultacija</SelectItem>
                      <SelectItem value="AI_NAUJIENA">📰 Pasiūlyti AI naujieną</SelectItem>
                      <SelectItem value="BENDRADARBIAVIMAS">🤝 Bendradarbiavimas</SelectItem>
                      <SelectItem value="KITA">💬 Kita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground/80 mb-2">
                    Žinutė
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={
                      formData.messageType === 'AI_NAUJIENA'
                        ? "Aprašykite AI naujieną, kurią norėtumėte pasiūlyti bendruomenei..."
                        : formData.messageType === 'KONSULTACIJA'
                        ? "Aprašykite savo poreikius AI konsultacijoms..."
                        : "Jūsų žinutė..."
                    }
                    rows={6}
                    className="bg-background border-border text-foreground placeholder:text-foreground/50"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="button-primary w-full"
                  disabled={isSubmitting || !formData.messageType}
                >
                  {isSubmitting ? 'Siunčiama...' : 'Pateikti užklausą'}
                </Button>
              </form>
            </div>

            {/* Social Links Section */}
            <div className="mt-16">
              <div className="dark-card text-center">
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <span className="w-2 h-2 rounded-full bg-foreground/40"></span>
                  <span className="text-sm text-foreground/60">Sekite mane</span>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                  <a
                    href="https://www.youtube.com/@ponasObuolys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>

                  <a
                    href="https://www.facebook.com/ponasObuolys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>

                  <a
                    href="https://www.instagram.com/ponasObuolys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>

                  <a
                    href="https://wa.me/37060000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </a>
                </div>

                <div className="text-sm text-foreground/50">
                  <p>© 2023 Ponas Obuolys – AI specialistas Lietuvoje</p>
                  <p className="mt-1">Aš esu šiandien šiandien Lietuvoje</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
