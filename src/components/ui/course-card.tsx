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
    <Card className="course-card">
      <div className="card-image-container">
        {course.level && (
          <div className="category-tag">{course.level}</div>
        )}
        {course.image_url ? (
          <LazyImage 
            src={course.image_url} 
            alt={course.title} 
            className="object-cover absolute inset-0 w-full h-full"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400">
            Nėra nuotraukos
          </div>
        )}
      </div>
      
      <div className="card-content">
        <h3 className="card-title line-clamp-2">{course.title}</h3>
        <p className="card-description line-clamp-3">{course.description}</p>
        
        <div className="card-metadata">
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
          <div className="card-price">
            {course.price && !isNaN(Number(course.price))
              ? `${Number(course.price).toFixed(2)} €`
              : course.price
                ? `${course.price} €`
                : 'Nemokamas'}
          </div>
          <Link to={`/kursai/${course.slug}`} className="ml-auto">
            <Button className="button-primary">Sužinoti daugiau</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
