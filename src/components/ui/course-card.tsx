import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, BookOpen } from "lucide-react";
import LazyImage from "@/components/ui/lazy-image";

interface CourseCardProps {
  course: {
    id: string;
    slug: string;
    title: string;
    description: string;
    image_url?: string;
    level: string;
    price: string;
    duration: string;
    highlights?: string[];
  };
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="course-card flex flex-col h-full overflow-hidden">
      <div className="course-image-container w-full aspect-video overflow-hidden">
        {course.image_url ? (
          <LazyImage
            src={course.image_url}
            alt={course.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
            Nėra nuotraukos
          </div>
        )}
      </div>
      
      <div className="course-content flex flex-col flex-grow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium py-1 px-3 rounded-full bg-accent/10 text-accent inline-block">
              {course.level}
            </div>
            <div className="text-xl font-bold text-primary">{course.price}</div>
          </div>
          <CardTitle className="text-xl line-clamp-2 h-14">{course.title}</CardTitle>
          <CardDescription className="text-base line-clamp-3 h-18">{course.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="py-2 flex-grow">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            <span>{course.duration}</span>
          </div>
          
          {course.highlights && course.highlights.length > 0 && (
            <div className="mt-4">
              <h4 className="font-bold text-md mb-2 flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Kurso turinys:
              </h4>
              <ul className="space-y-1 pl-7 list-disc max-h-32 overflow-y-auto">
                {course.highlights.map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-2 mt-auto">
          <Link to={`/kursai/${course.slug}`} className="w-full">
            <Button className="w-full button-primary">Sužinoti daugiau</Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
};

export default CourseCard;
