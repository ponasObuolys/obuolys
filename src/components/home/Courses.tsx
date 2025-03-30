
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, BookOpen, Users } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Dirbtinis intelektas verslui",
    description: "Sužinokite, kaip panaudoti AI savo versle, automatizuoti procesus ir padidinti efektyvumą.",
    duration: "8 savaitės",
    students: 345,
    level: "Pradedantiems",
    price: "199€",
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
    slug: "ai-turinio-kurimas"
  }
];

const Courses = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">Mokykitės <span className="gradient-text">uždirbti</span> su AI</h2>
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
                    <li>AI principai ir pritaikymas</li>
                    <li>Praktiniai įrankių naudojimo pavyzdžiai</li>
                    <li>Darbų automatizavimas</li>
                    <li>Verslo procesų optimizavimas</li>
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
        
        <div className="text-center mt-12">
          <Link to="/kursai">
            <Button className="button-outline">Visi kursai</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Courses;
