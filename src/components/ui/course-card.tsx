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
    <Card className="course-card flex flex-col overflow-hidden">
      <div className="card-image-container">
        {course.level && (
          <div className="category-tag">{course.level}</div>
        )}
        {course.image_url ? (
          <LazyImage 
            src={course.image_url} 
            alt={course.title} 
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
            Nėra nuotraukos
          </div>
        )}
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{course.title}</h3>
        <p className="card-description">{course.description}</p>
        
        <div className="card-metadata">
          <div>
            <Clock size={14} />
            <span>{course.duration || 'Nenurodyta'}</span>
          </div>
          <div>
            <Users size={14} />
            <span>Pradedantiesiems</span>
          </div>
          <div>
            <BarChart size={14} />
            <span>{course.level || 'Pradedantiesiems'}</span>
          </div>
        </div>
        
        {course.highlights && course.highlights.length > 0 && (
          <div className="mt-2 mb-4">
            <ul className="space-y-1 pl-5 list-disc text-sm text-gray-600">
              {course.highlights.slice(0, 2).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-auto">
          <Link to={`/kursai/${course.slug}`} className="w-3/4">
            <Button className="button-primary w-full">Sužinoti daugiau</Button>
          </Link>
          <div className="card-price">
            {course.price ? `${course.price}` : 'Nemokamas'}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
