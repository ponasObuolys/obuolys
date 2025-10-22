import { Check } from "lucide-react";
import { useState, useRef, type MouseEvent } from "react";

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
  const [transform, setTransform] = useState("");
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Neigiamos reikšmės - paveikslėlis juda priešinga kryptimi
    const moveX = ((x - centerX) / centerX) * -20;
    const moveY = ((y - centerY) / centerY) * -20;

    setTransform(`scale(1.3) translate(${moveX}px, ${moveY}px)`);
  };

  const handleMouseLeave = () => {
    setTransform("");
  };

  return (
    <div className="dark-card flex flex-col h-full">
      {/* Image placeholder */}
      <div
        ref={imageContainerRef}
        className="relative h-64 mb-6 rounded-lg overflow-hidden bg-muted group cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 ease-out"
          style={{ transform }}
          loading="lazy"
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-2xl font-bold mb-4 text-foreground text-left">{project.title}</h3>

        <div className="mb-4">
          <h4 className="text-sm font-bold text-foreground/60 mb-2 text-left">PROBLEMA:</h4>
          <p className="text-foreground/80 text-left leading-relaxed">{project.problem}</p>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-bold text-foreground/60 mb-2 text-left">SPRENDIMAS:</h4>
          <p className="text-foreground/80 text-left leading-relaxed">{project.solution}</p>
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
