import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface PerformanceScoreCardProps {
  performanceScore: number;
}

export const PerformanceScoreCard = ({ performanceScore }: PerformanceScoreCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Bendrasis našumo balas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold">{performanceScore}/100</div>
          <Progress value={performanceScore} className="flex-1" />
          <Badge
            variant={
              performanceScore >= 90
                ? "default"
                : performanceScore >= 50
                  ? "secondary"
                  : "destructive"
            }
          >
            {performanceScore >= 90
              ? "Puikus"
              : performanceScore >= 50
                ? "Reikia tobulinti"
                : "Prastas"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
