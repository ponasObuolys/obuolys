import type { ReactNode } from 'react';

interface TechBadgeProps {
  name: string;
  badge: string;
  level?: 'Expert' | 'Advanced' | 'Intermediate';
  description?: string;
}

const levelDots = {
  Expert: 3,
  Advanced: 2,
  Intermediate: 1,
};

export function TechBadge({ name, badge, level = 'Advanced', description }: TechBadgeProps) {
  const dots = levelDots[level];

  return (
    <div
      className="group relative flex items-center gap-3 p-3 rounded-lg border transition-all hover:scale-105 hover:shadow-md bg-card"
      title={description}
    >
      <span className="text-2xl" aria-label={`${name} icon`}>{badge}</span>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-foreground truncate">
          {name}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i < dots ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">{level}</span>
        </div>
      </div>

      {description && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border">
          {description}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover" />
        </div>
      )}
    </div>
  );
}

interface TechCategoryProps {
  name: string;
  icon: string;
  children: ReactNode;
}

export function TechCategory({ name, icon, children }: TechCategoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-3xl" aria-label={`${name} category`}>{icon}</span>
        <h3 className="text-xl font-bold text-foreground">{name}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
}
