
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users, Star, Check, CheckCircle, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect } from 'react';

// Mock course data
const coursesData = {
  "ai-verslui": {
    title: "Dirbtinis intelektas verslui",
    description: "Sužinokite, kaip panaudoti AI savo versle, automatizuoti procesus ir padidinti efektyvumą. Šiame kurse išmoksite praktiškai pritaikyti dirbtinio intelekto technologijas, kad galėtumėte optimizuoti savo verslo procesus, sumažinti išlaidas ir padidinti produktyvumą.",
    duration: "8 savaitės",
    students: 345,
    level: "Pradedantiems",
    rating: 4.8,
    reviews: 68,
    price: "199€",
    instructor: "Jonas Jonaitis",
    instructorBio: "AI strategas ir verslo konsultantas su 10+ metų patirtimi IT srityje. Padėjo daugiau nei 50 įmonių sėkmingai integruoti AI technologijas.",
    highlights: [
      "Išmoksite identifikuoti AI panaudojimo galimybes savo versle",
      "Suprasite, kaip automatizuoti rutininius procesus",
      "Išmoksite naudoti AI įrankius verslo analitikai",
      "Sužinosite, kaip gerinti klientų patirtį su AI sprendimais",
      "Suprasite AI projektų įgyvendinimo iššūkius ir galimybes"
    ],
    modules: [
      {
        title: "Įvadas į verslo AI",
        lessons: [
          "AI technologijų apžvalga ir panaudojimo galimybės",
          "Sėkmingo AI integravimo versle pavyzdžiai",
          "Kaip identifikuoti AI galimybes savo įmonėje"
        ]
      },
      {
        title: "Verslo procesų automatizavimas",
        lessons: [
          "Procesų analizė ir optimizavimo galimybės",
          "Rutininių užduočių automatizavimas su AI",
          "Dokumentų valdymo optimizavimas",
          "Praktiniai automatizavimo pavyzdžiai"
        ]
      },
      {
        title: "Klientų aptarnavimas ir AI",
        lessons: [
          "Chatbotai ir virtualūs asistentai",
          "Klientų elgsenos analizė su AI",
          "Personalizuoti pasiūlymai naudojant dirbtinį intelektą",
          "Klientų lojalumo didinimas"
        ]
      },
      {
        title: "Duomenų analizė ir sprendimų priėmimas",
        lessons: [
          "Verslo duomenų analizė su AI įrankiais",
          "Prognozavimo modeliai ir jų pritaikymas",
          "Sprendimų priėmimas remiantis AI analize",
          "Ateities tendencijų numatymas"
        ]
      },
      {
        title: "AI projektų įgyvendinimas",
        lessons: [
          "AI projekto planavimas ir komandos sudarymas",
          "Biudžeto ir resursų planavimas",
          "Rizikų valdymas ir iššūkių sprendimas",
          "Sėkmės matavimas ir rezultatų vertinimas"
        ]
      }
    ],
    faq: [
      {
        question: "Ar reikalingos techninės žinios šiam kursui?",
        answer: "Ne, kursas sukurtas taip, kad būtų suprantamas ir be techninių žinių. Visos koncepcijos paaiškinamos paprastai ir su praktiniais pavyzdžiais."
      },
      {
        question: "Kaip vyksta mokymosi procesas?",
        answer: "Kursas vyksta internetu. Kiekvieną savaitę gausite prieigą prie naujų vaizdo pamokų, praktinių užduočių ir papildomos medžiagos. Taip pat bus tiesioginiai susitikimai su instruktoriumi 1 kartą per savaitę."
      },
      {
        question: "Kiek laiko reikia skirti mokymuisi?",
        answer: "Rekomenduojame skirti bent 3-5 valandas per savaitę, kad galėtumėte peržiūrėti medžiagą ir atlikti praktines užduotis."
      },
      {
        question: "Ar gausiu sertifikatą?",
        answer: "Taip, baigę kursą gausite elektroninį sertifikatą, patvirtinantį jūsų įgytas žinias."
      },
      {
        question: "Ar galėsiu peržiūrėti medžiagą vėliau?",
        answer: "Taip, įsigiję kursą turėsite prieigą prie medžiagos neribotam laikui ir galėsite grįžti prie pamokų bet kada."
      }
    ]
  },
  // Additional course data would be defined here similarly
};

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const course = slug ? coursesData[slug as keyof typeof coursesData] : null;
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Kursas nerastas</h1>
          <p className="mb-6">Atsiprašome, bet ieškomas kursas neegzistuoja.</p>
          <Link to="/kursai">
            <Button className="button-primary">Grįžti į kursų sąrašą</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Link to="/kursai" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Grįžti į kursų sąrašą</span>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  <span>{course.students} mokinių</span>
                </div>
                <div className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  <span>{course.rating} ({course.reviews} atsiliepimai)</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">Ką išmoksite:</h3>
                <ul className="space-y-2">
                  {course.highlights.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">Dėstytojas:</h3>
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex-shrink-0 flex items-center justify-center text-gray-500">
                    Foto
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{course.instructor}</h4>
                    <p className="text-gray-600">{course.instructorBio}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="turinys" className="bg-white rounded-lg shadow-md p-6">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="turinys">Kurso turinys</TabsTrigger>
                <TabsTrigger value="duk">D.U.K.</TabsTrigger>
              </TabsList>
              
              <TabsContent value="turinys">
                <h3 className="text-xl font-bold mb-4">Kurso moduliai:</h3>
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((module, index) => (
                    <AccordionItem key={index} value={`module-${index}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {module.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pl-6">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <li key={lessonIndex} className="flex items-start">
                              <CheckCircle className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{lesson}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              
              <TabsContent value="duk">
                <h3 className="text-xl font-bold mb-4">Dažnai užduodami klausimai:</h3>
                <Accordion type="single" collapsible className="w-full">
                  {course.faq.map((item, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-primary mb-2">{course.price}</p>
                <div className="text-sm mb-4 text-gray-500">Vienkartinis mokėjimas, prieiga neribotam laikui</div>
                <Button className="w-full button-primary text-lg py-6">Įsigyti kursą</Button>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold mb-4">Kursas apima:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Neribota prieiga prie kurso medžiagos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Praktiniai užsiėmimai ir užduotys</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Tiesioginis ryšys su dėstytoju</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Kurso baigimo sertifikatas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Narystė uždaroje Facebook grupėje</span>
                  </li>
                </ul>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-start">
                  <AlertCircle className="mr-2 h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    14 dienų pinigų grąžinimo garantija, jei kursas neatitiks jūsų lūkesčių.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetail;
