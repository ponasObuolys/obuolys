
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="mb-6">
              <span className="gradient-text">Dirbtinio intelekto</span> žinios,<br />
              įrankiai ir kursai
            </h1>
            <p className="text-lg mb-8">
              Sužinokite apie naujausius dirbtinio intelekto įrankius, tendencijas ir kaip juos efektyviai panaudoti savo versle.
              Naujienos, straipsniai ir kursai lietuvių kalba.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/straipsniai">
                <Button className="button-primary w-full sm:w-auto">Naujausi straipsniai</Button>
              </Link>
              <Link to="/kursai">
                <Button className="button-outline w-full sm:w-auto">Pradėti mokytis</Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-50"></div>
              <div className="relative bg-white rounded-xl p-6 shadow-lg">
                <div className="aspect-video rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  <span className="text-xl text-gray-400">ponas Obuolys</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold">Dirbtinio intelekto revoliucija</h3>
                  <p className="mt-2 text-gray-600">Kaip AI keičia mūsų kasdienybę ir darbą</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">5 min. skaitymo</span>
                    <Button className="button-accent px-3 py-1 h-auto text-sm">Skaityti</Button>
                  </div>
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
