import { Check } from 'lucide-react';
import LazyImage from '@/components/ui/lazy-image';

interface Project {
  id: number;
  title: string;
  category: string;
  problem: string;
  solution: string;
  results: string[];
  image: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="dark-card flex flex-col h-full">
      {/* Image placeholder */}
      <div className="relative h-64 mb-6 rounded-lg overflow-hidden bg-muted">
        <LazyImage
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          placeholderSrc="/placeholder-project.jpg"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-2xl font-bold mb-4 text-foreground text-left">
          {project.title}
        </h3>

        <div className="mb-4">
          <h4 className="text-sm font-bold text-foreground/60 mb-2 text-left">PROBLEMA:</h4>
          <p className="text-foreground/80 text-left leading-relaxed">
            {project.problem}
          </p>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-bold text-foreground/60 mb-2 text-left">SPRENDIMAS:</h4>
          <p className="text-foreground/80 text-left leading-relaxed">
            {project.solution}
          </p>
        </div>

        <div className="mt-auto">
          <h4 className="text-sm font-bold text-foreground/60 mb-3 text-left">REZULTATAI:</h4>
          <ul className="space-y-2">
            {project.results.map((result, idx) => (
              <li key={idx} className="flex items-start gap-2 text-left">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">{result}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
