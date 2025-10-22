import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Pradėkite savo AI kelionę jau šiandien
              </h2>
              <p className="text-lg mb-8 text-white/90">
                Prisijunkite prie bendruomenės ir gaukite nemokamus patarimus, kaip efektyviai
                naudoti dirbtinį intelektą savo asmeniniame ar profesiniame gyvenime.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/kursai" className="w-full sm:w-auto">
                  <Button className="w-full bg-white text-primary hover:bg-white/90">
                    Pradėti mokytis
                  </Button>
                </Link>
                <Link to="/kontaktai" className="w-full sm:w-auto">
                  <Button className="w-full border border-white bg-transparent hover:bg-white/10 text-white">
                    Susisiekti
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
