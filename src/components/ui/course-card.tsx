import { Link } from "react-router-dom";
import { Clock, BarChart } from "lucide-react";
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

// Color palette for course levels
const levelColors: { [key: string]: string } = {
  Pradedantiesiems: "bg-green-600",
  Pažengusiems: "bg-blue-600",
  Profesionalams: "bg-purple-600",
  default: "bg-green-600",
};

const CourseCard = ({ course }: CourseCardProps) => {
  const levelColor = levelColors[course.level] || levelColors.default;

  return (
    <Link to={`/kursai/${course.slug}`} className="block group">
      <div className="project-card h-full flex flex-col">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-lg ${levelColor} flex items-center justify-center flex-shrink-0`}
          >
            <span className="text-white font-bold text-lg">
              {course.level ? course.level.charAt(0) : "K"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold line-clamp-2 mb-1 text-left">{course.title}</h3>
            <p className="text-sm text-foreground/90 text-left">{course.level || "Kursas"}</p>
          </div>
          <svg
            className="w-5 h-5 text-foreground/40 group-hover:text-foreground transition-colors flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Image section */}
        {course.image_url && (
          <div className="h-[180px] rounded-lg overflow-hidden bg-muted mb-4">
            <LazyImage
              src={course.image_url}
              alt={course.title}
              aspectRatio="16/9"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Description - flexible */}
        <div className="flex-1 mb-4">
          <p className="text-sm text-foreground/90 line-clamp-3 text-left">{course.description}</p>
        </div>

        {/* Metadata and price - fixed at bottom */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-foreground/90">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{course.duration || "Nenurodyta"}</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart size={14} />
              <span>{course.level || "Pradedantiesiems"}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-lg font-bold text-primary">
              {course.price && !isNaN(Number(course.price))
                ? `${Number(course.price).toFixed(2)} €`
                : course.price
                  ? `${course.price} €`
                  : "Nemokamas"}
            </div>
            <span className="text-xs text-foreground/90">Sužinoti daugiau →</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
