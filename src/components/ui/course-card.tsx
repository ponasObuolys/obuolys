import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Users, BarChart } from "lucide-react";
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
    <Card className="course-card w-full max-w-[300px] flex flex-col overflow-hidden shadow-md rounded-lg h-[400px]">
      <div className="card-image-container h-[169px]">
        {course.level && (
          <div className="category-tag">{course.level}</div>
        )}
        {course.image_url ? (
          <LazyImage 
            src={course.image_url} 
            alt={course.title} 
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
            Nėra nuotraukos
          </div>
        )}
      </div>
      
      <div className="card-content p-4 flex flex-col flex-1">
        <h3 className="card-title text-base font-bold mb-2 line-clamp-2">{course.title}</h3>
        <p className="card-description text-sm text-gray-600 mb-3 line-clamp-3">{course.description}</p>
        
        <div className="card-metadata flex gap-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{course.duration || 'Nenurodyta'}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart size={14} />
            <span>{course.level || 'Pradedantiesiems'}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="card-price font-bold text-right">
            {course.price ? `${course.price}` : 'Nemokamas'}
          </div>
          <Link to={`/kursai/${course.slug}`} className="w-3/5">
            <Button className="button-primary w-full text-sm py-1">Sužinoti daugiau</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
