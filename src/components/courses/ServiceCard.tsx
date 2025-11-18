import { Calendar, Clock, Users } from "lucide-react";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  format: string;
  icon: React.ReactNode;
  colorClass: string;
  onClick: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function ServiceCard({
  title,
  subtitle,
  description,
  duration,
  format,
  icon,
  colorClass,
  onClick,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
}: ServiceCardProps) {
  return (
    <div
      className="project-card flex flex-col h-full"
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick()}
    >
      {/* Header section - fixed */}
      <div className="flex items-start gap-3 mb-4 min-h-[80px]">
        <div
          className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1 text-left">{title}</h3>
          <p className="text-sm text-foreground/90 text-left">{subtitle}</p>
        </div>
      </div>

      {/* Description section - flexible */}
      <div className="flex-1 mb-4">
        <p className="text-sm text-foreground/70 text-left">{description}</p>
      </div>

      {/* Metadata section - fixed at bottom */}
      <div className="flex items-center gap-4 text-xs text-foreground/50 pt-4 border-t border-border">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1">
          {format.includes("žmonių") ? <Users size={12} /> : <Calendar size={12} />}
          <span>{format}</span>
        </div>
      </div>
    </div>
  );
}
