
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Youtube, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Žinutė išsiųsta",
        description: "Dėkojame už jūsų žinutę. Susisieksime kuo greičiau.",
        variant: "default",
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="mb-4"><span className="gradient-text">Kontaktai</span></h1>
            <p className="max-w-2xl mx-auto">
              Turite klausimų ar pasiūlymų? Susisiekite su mumis ir mielai atsakysime
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Susisiekite tiesiogiai</h2>
              
              <div className="space-y-6">
                <a 
                  href="mailto:labas@ponasobuolys.lt" 
                  className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-lg">El. paštas</div>
                    <div className="text-gray-600">labas@ponasobuolys.lt</div>
                  </div>
                </a>
                
                <a 
                  href="https://www.youtube.com/@ponasobuolys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <Youtube className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium text-lg">YouTube</div>
                    <div className="text-gray-600">@ponasobuolys</div>
                  </div>
                </a>
                
                <a 
                  href="https://wa.me/message/RSBW27G7DYBVP1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-lg">WhatsApp</div>
                    <div className="text-gray-600">Rašykite žinutę</div>
                  </div>
                </a>
              </div>
              
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">Priėmimo valandos</h3>
                <p className="mb-4">
                  Į laiškus ir žinutes atsakome darbo dienomis nuo 9:00 iki 17:00 val.
                </p>
                <p>
                  Stengiamės atsakyti per 24 valandas, tačiau kartais tai gali užtrukti iki 2 darbo dienų.
                </p>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Siųsti žinutę</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Vardas
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jūsų vardas"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      El. paštas
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jusu.pastas@pavyzdys.lt"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      Tema
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Žinutės tema"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Žinutė
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Jūsų žinutė..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="button-primary w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Siunčiama...' : 'Siųsti žinutę'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-white rounded-lg p-8 shadow text-center">
            <h2 className="text-2xl font-bold mb-4">Bendradarbiaukime!</h2>
            <p className="mb-6 max-w-xl mx-auto">
              Ieškote AI eksperto, lektoriaus ar norite aptarti bendradarbiavimo galimybes?
              Mielai aptarsime, kaip galėčiau padėti jūsų projektui ar renginiui.
            </p>
            <Button className="button-primary">Aptarti bendradarbiavimą</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
