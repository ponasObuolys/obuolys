import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Tomas V.",
      company: "Logistikos įmonė",
      role: "CEO",
      rating: 5,
      text: "Po 3 mėnesių naudojimo efektyvumas padidėjo 40%. Sistema veikia sklandžiai, o svarbiausia - darbuotojai ja naudojasi mielai, nes ji supaprastino jų darbą.",
      project: "Krovinių valdymo sistema",
    },
    {
      name: "Laura K.",
      company: "Transporto kompanija",
      role: "Operacijų vadovė",
      rating: 5,
      text: "Buvau skeptiška dėl automatizacijos, bet rezultatai pranoko lūkesčius. Dabar užuot skambinusi vairuotojams, matau viską realiu laiku dashboard'e. Sutaupau 3 valandas per dieną.",
      project: "Vairuotojų koordinavimo platforma",
    },
    {
      name: "Mindaugas P.",
      company: "Distribucijos įmonė",
      role: "Savininkas",
      rating: 5,
      text: "Greitas pristatymas ir asmeninis dėmesys - tai kas labiausiai įvertinau. Viskas padaryta taip, kaip reikia mūsų verslui. Po metų ROI jau pasiektas.",
      project: "Sandėlio apskaitos sistema",
    },
    {
      name: "Rūta J.",
      company: "Kurjerių tarnyba",
      role: "Klientų aptarnavimo vadovė",
      rating: 5,
      text: "Klientų portalas pakeitė žaidimo taisykles. Skambučiai sumažėjo 60%, o klientų pasitenkinimas išaugo. Galime aptarnauti daugiau klientų su ta pačia komanda.",
      project: "Klientų portalo platforma",
    },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Ką Sako Mūsų Klientai
          </h2>
          <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            Realūs atsiliepimai iš klientų, kurie jau naudojasi mūsų sukurtomis sistemomis
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="dark-card flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <Quote className="w-8 h-8 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <div className="text-xs text-primary font-bold mb-1">{testimonial.project}</div>
                  </div>
                </div>

                <p className="text-foreground/80 leading-relaxed mb-6 flex-1 text-left">
                  "{testimonial.text}"
                </p>

                <div className="border-t border-border pt-4">
                  <div className="font-bold text-foreground text-left">{testimonial.name}</div>
                  <div className="text-sm text-foreground/60 text-left">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-foreground/60 italic">
              * Visi atsiliepimai realūs, tačiau vardai pakeisti klientų privatumo tikslais
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
