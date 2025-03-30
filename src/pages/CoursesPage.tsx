
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, BookOpen, Users } from "lucide-react";

// Mock data
const courses = [
  {
    id: 1,
    title: "Dirbtinis intelektas verslui",
    description: "Sužinokite, kaip panaudoti AI savo versle, automatizuoti procesus ir padidinti efektyvumą.",
    duration: "8 savaitės",
    students: 345,
    level: "Pradedantiems",
    price: "199€",
    highlights: [
      "AI principai ir pritaikymas",
      "Praktiniai įrankių naudojimo pavyzdžiai",
      "Darbų automatizavimas",
      "Verslo procesų optimizavimas",
      "AI integravimas į įmonės veiklą",
      "Duomenų analizė su AI"
    ],
    slug: "ai-verslui"
  },
  {
    id: 2,
    title: "AI turinio kūrimas",
    description: "Išmokite kurti patrauklų turinį naudojant dirbtinį intelektą - tekstą, vaizdus ir vaizdo įrašus.",
    duration: "6 savaitės",
    students: 278,
    level: "Vidutinio lygio",
    price: "149€",
    highlights: [
      "Tekstų generavimas su ChatGPT",
      "Vaizdų kūrimas su Midjourney ir DALL-E",
      "Vaizdo įrašų kūrimas su AI",
      "Efektyvūs prašymai (prompts)",
      "Sukurto turinio tobulinimas",
      "Turinio strategijos"
    ],
    slug: "ai-turinio-kurimas"
  },
  {
    id: 3,
    title: "AI monetizacijos strategijos",
    description: "Sužinokite, kaip uždirbti pinigus naudodami dirbtinio intelekto įrankius ir kuriant AI produktus.",
    duration: "10 savaitės",
    students: 192,
    level: "Pažengusiems",
    price: "249€",
    highlights: [
      "Pajamų šaltinių identifikavimas",
      "AI paslaugų kūrimas ir pardavimas",
      "Produkto kainodara",
      "Klientų pritraukimas",
      "Sėkmingos monetizacijos pavyzdžiai",
      "Rinkos analizė ir nišų radimas"
    ],
    slug: "ai-monetizacija"
  },
  {
    id: 4,
    title: "Produktyvumas su AI",
    description: "Išmokite, kaip naudoti dirbtinį intelektą, kad sutaupytumėte laiko ir padidintumėte savo efektyvumą.",
    duration: "4 savaitės",
    students: 410,
    level: "Visiems",
    price: "99€",
    highlights: [
      "Kasdienių užduočių automatizavimas",
      "Laiko valdymo strategijos su AI",
      "Dokumentų tvarkymas ir analizė",
      "Efektyvios komunikacijos įrankiai",
      "Asmeninė organizacija su AI",
      "Produktyvumo rutinos"
    ],
    slug: "produktyvumas-ai"
  }
];

const CoursesPage = () => {
  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="mb-4"><span className="gradient-text">Kursai</span></h1>
            <p className="max-w-2xl mx-auto">
              Mūsų praktiniai kursai padės jums efektyviai panaudoti dirbtinį intelektą ir paversti jį 
              pajamų šaltiniu
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="custom-card h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium py-1 px-3 rounded-full bg-accent/10 text-accent inline-block">
                      {course.level}
                    </div>
                    <div className="text-xl font-bold text-primary">{course.price}</div>
                  </div>
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                  <CardDescription className="text-base">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-primary" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" />
                      <span>{course.students} mokinių</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-bold text-md mb-2 flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-primary" />
                      Kurso turinys:
                    </h4>
                    <ul className="space-y-2 pl-7 list-disc">
                      {course.highlights.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Link to={`/kursai/${course.slug}`} className="w-full">
                    <Button className="w-full button-primary">Sužinoti daugiau</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 bg-white rounded-lg p-8 shadow text-center">
            <h2 className="text-2xl font-bold mb-4">Norite mokytis individualiai?</h2>
            <p className="mb-6 max-w-xl mx-auto">
              Siūlome individualius mokymus pagal jūsų poreikius ir tempą. 
              Susisiekite su mumis ir aptarsime jūsų tikslus bei galimas mokymosi galimybes.
            </p>
            <Link to="/kontaktai">
              <Button className="button-outline">Susisiekti</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CoursesPage;
