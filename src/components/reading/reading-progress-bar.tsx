import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ReadingProgressBarProps {
  targetRef: React.RefObject<HTMLElement>;
  estimatedReadTime?: string;
}

export function ReadingProgressBar({ targetRef, estimatedReadTime }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const calculateProgress = () => {
      if (!targetRef.current) return;

      const element = targetRef.current;
      const rect = element.getBoundingClientRect();
      const elementHeight = element.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate how much of the element has been scrolled
      const scrolled = -rect.top;
      const total = elementHeight - viewportHeight;
      
      if (total <= 0) {
        setProgress(100);
        return;
      }
      
      const percentage = Math.min(100, Math.max(0, (scrolled / total) * 100));
      setProgress(percentage);

      // Calculate time remaining
      if (estimatedReadTime) {
        const minutes = parseInt(estimatedReadTime.match(/\d+/)?.[0] || "5");
        const remainingMinutes = Math.ceil(minutes * (1 - percentage / 100));
        
        if (remainingMinutes > 0) {
          setTimeRemaining(`${remainingMinutes} min liko`);
        } else {
          setTimeRemaining("Perskaityta!");
        }
      }
    };

    calculateProgress();
    window.addEventListener("scroll", calculateProgress);
    window.addEventListener("resize", calculateProgress);

    return () => {
      window.removeEventListener("scroll", calculateProgress);
      window.removeEventListener("resize", calculateProgress);
    };
  }, [targetRef, estimatedReadTime]);

  return (
    <>
      {/* Fixed progress bar at top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/60"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Floating progress indicator with scroll to top */}
      {progress > 5 && (
        <motion.button
          data-reading-progress="true"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 cursor-pointer group"
          aria-label={progress >= 100 ? "Grįžti į viršų" : `Perskaitytas ${Math.round(progress)}%`}
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Background circle */}
            <svg className="absolute inset-0 w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-primary-foreground/20"
              />
              {/* Progress circle */}
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                className="text-primary-foreground transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>
            {/* Icon or percentage */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              {progress >= 100 ? (
                <svg
                  className="w-6 h-6 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                <span className="text-xs font-bold text-primary-foreground">
                  {Math.round(progress)}%
                </span>
              )}
            </div>
          </div>
          {/* Tooltip on hover */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {progress >= 100 ? "Grįžti į viršų" : timeRemaining || "Skaitymo progresas"}
          </div>
        </motion.button>
      )}

    </>
  );
}
