import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";

interface PerformanceHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  onClear: () => void;
}

export const PerformanceHeader = ({ isRefreshing, onRefresh, onClear }: PerformanceHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Našumo monitoringas</h2>
        <p className="text-gray-600">Core Web Vitals ir komponentų kraunymo statistika</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Atnaujinti
        </Button>
        <Button variant="outline" size="sm" onClick={onClear}>
          <Trash2 className="h-4 w-4 mr-2" />
          Išvalyti
        </Button>
      </div>
    </div>
  );
};
