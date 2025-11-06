import { Check, ChevronLeft, ChevronRight, Clock, Building2 } from "lucide-react";
import { useState, useRef, type MouseEvent } from "react";

interface ProjectImage {
  url: string;
  caption?: string;
}

interface EnhancedProject {
  id: number;
  title: string;
  category: string;
  problem: string;
  solution: string;
  results: string[];
  roi?: string; // e.g., "Investicija €12,000 • Atsipirko per 4 mėnesius"
  images: ProjectImage[]; // Multiple images
  techStack: string[]; // e.g., ["React", "TypeScript", "Supabase"]
  timeline: string; // e.g., "6 savaitės • 2025 Q2"
  clientInfo: string; // e.g., "Transporto įmonė, 50+ darbuotojų"
}

interface EnhancedProjectCardProps {
  project: EnhancedProject;
}

const EnhancedProjectCard = ({ project }: EnhancedProjectCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [transform, setTransform] = useState("");
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const moveX = ((x - centerX) / centerX) * -20;
    const moveY = ((y - centerY) / centerY) * -20;

    setTransform(`scale(1.3) translate(${moveX}px, ${moveY}px)`);
  };

  const handleMouseLeave = () => {
    setTransform("");
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + project.images.length) % project.images.length
    );
  };

  const currentImage = project.images[currentImageIndex];

  return (
    <div className="dark-card flex flex-col h-full">
      {/* Image Gallery with Navigation */}
      <div
        ref={imageContainerRef}
        className="relative h-80 mb-6 rounded-lg overflow-hidden bg-muted group cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={currentImage.url}
          alt={`${project.title} - ${currentImage.caption || `projekto vaizdas ${currentImageIndex + 1}`} - React TypeScript ${project.category} sistema`}
          className="w-full h-full object-cover transition-transform duration-300 ease-out"
          style={{ transform }}
          loading="lazy"
        />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
            {project.category}
          </span>
        </div>

        {/* Image Navigation */}
        {project.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full z-10">
              {currentImageIndex + 1} / {project.images.length}
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {project.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Image Caption */}
        {currentImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-sm">
            {currentImage.caption}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-2xl font-bold mb-4 text-foreground text-left">{project.title}</h3>

        {/* Project Meta (Timeline & Client) */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-foreground/70">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{project.timeline}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span>{project.clientInfo}</span>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

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
          <ul className="space-y-2 mb-4">
            {project.results.map((result, idx) => (
              <li key={idx} className="flex items-start gap-2 text-left">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">{result}</span>
              </li>
            ))}
          </ul>

          {/* ROI Section */}
          {project.roi && (
            <div className="mt-4 pt-4 border-t border-foreground/10">
              <p className="text-sm font-bold text-primary text-left">{project.roi}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedProjectCard;
