import { Smartphone, Monitor, Tablet } from "lucide-react";
import { useDeviceStats } from "@/hooks/use-device-stats";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DeviceStatsProps {
  days?: number;
  className?: string;
}

const browserIcons: Record<string, string> = {
  Chrome: "🌐",
  Firefox: "🦊",
  Safari: "🧭",
  Edge: "🌊",
  Opera: "🎭",
  Other: "📱",
};

const deviceIcons = {
  Mobile: Smartphone,
  Tablet: Tablet,
  Desktop: Monitor,
};

export function DeviceStats({ days = 30, className }: DeviceStatsProps) {
  const { data, isLoading, error } = useDeviceStats({ days });

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
        <div className="bg-card border rounded-lg p-4">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || (!data.devices?.length && !data.browsers?.length)) {
    return null;
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      {/* Devices */}
      {data.devices && data.devices.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            Įrenginiai
          </h4>
          <div className="space-y-3">
            {data.devices.map((device) => {
              const Icon = deviceIcons[device.type as keyof typeof deviceIcons] || Monitor;
              return (
                <div key={device.type} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-sm">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {device.type}
                    </span>
                    <span className="font-medium text-sm">
                      {device.percentage}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {device.count.toLocaleString("lt-LT")} sesijų
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Browsers */}
      {data.browsers && data.browsers.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">🌐</span>
            Naršyklės
          </h4>
          <div className="space-y-3">
            {data.browsers.map((browser) => (
              <div key={browser.name} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm">
                    <span className="text-lg">
                      {browserIcons[browser.name] || browserIcons.Other}
                    </span>
                    {browser.name}
                  </span>
                  <span className="font-medium text-sm">
                    {browser.percentage}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${browser.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {browser.count.toLocaleString("lt-LT")} sesijų
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
