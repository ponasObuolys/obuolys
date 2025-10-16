import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";

interface PerformanceHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  onClear: () => void;
}

export const PerformanceHeader = ({ isRefreshing, onRefresh, onClear }: PerformanceHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-bold">Našumo monitoringas</h2>
        <p className="text-sm md:text-base text-gray-600">
          <span className="hidden sm:inline">Core Web Vitals ir komponentų kraunymo statistika</span>
          <span className="sm:hidden">Web Vitals statistika</span>
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing} className="text-xs md:text-sm">
          <RefreshCw className={`h-4 w-4 md:mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden md:inline">Atnaujinti</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onClear} className="text-xs md:text-sm">
          <Trash2 className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Išvalyti</span>
        </Button>
      </div>
    </div>
  );
};
