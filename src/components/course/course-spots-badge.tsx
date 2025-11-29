import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  calculateRemainingSpots,
  getSpotsColorClass,
  getSpotsUrgencyText,
} from "@/utils/calculate-remaining-spots";

interface CourseSpotsBadgeProps {
  maxSpots: number | null;
  courseStartDate: string | null;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Badge komponentas rodantis likusias vietas kurse
 * Spalva keičiasi pagal likusių vietų skaičių:
 * - Žalia: >10 vietų
 * - Oranžinė: 5-10 vietų
 * - Raudona: <5 vietos
 */
export function CourseSpotsBadge({
  maxSpots,
  courseStartDate,
  className = "",
  showIcon = true,
  size = "md",
}: CourseSpotsBadgeProps) {
  if (!maxSpots || !courseStartDate) {
    return null;
  }

  const remainingSpots = calculateRemainingSpots(maxSpots, courseStartDate);
  const colors = getSpotsColorClass(remainingSpots);

  // Jei kursas jau praėjo
  if (remainingSpots === 0) {
    return null;
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <Badge
      variant="outline"
      className={`
        ${colors.bg} ${colors.text} ${colors.border}
        ${sizeClasses[size]}
        font-medium
        ${className}
      `}
    >
      {showIcon && <Users className="h-3.5 w-3.5 mr-1.5" />}
      <span>
        Liko {remainingSpots} {remainingSpots === 1 ? "vieta" : remainingSpots < 10 ? "vietos" : "vietų"}
      </span>
    </Badge>
  );
}

/**
 * Kompaktiškas vietų indikatorius su urgency tekstu
 */
export function CourseSpotsBadgeCompact({
  maxSpots,
  courseStartDate,
  className = "",
}: Omit<CourseSpotsBadgeProps, "showIcon" | "size">) {
  if (!maxSpots || !courseStartDate) {
    return null;
  }

  const remainingSpots = calculateRemainingSpots(maxSpots, courseStartDate);
  const colors = getSpotsColorClass(remainingSpots);
  const urgencyText = getSpotsUrgencyText(remainingSpots);

  if (remainingSpots === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`text-sm font-medium ${colors.text}`}>
        {urgencyText}
      </span>
      <Badge
        variant="outline"
        className={`${colors.bg} ${colors.text} ${colors.border} text-xs px-2 py-0.5`}
      >
        {remainingSpots}
      </Badge>
    </div>
  );
}
