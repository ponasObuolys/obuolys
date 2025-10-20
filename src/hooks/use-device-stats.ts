import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { secureLogger } from "@/utils/browserLogger";

export interface DeviceStat {
  type: string;
  count: number;
  percentage: number;
}

export interface BrowserStat {
  name: string;
  count: number;
  percentage: number;
}

export interface DeviceStatsData {
  devices: DeviceStat[];
  browsers: BrowserStat[];
}

interface UseDeviceStatsOptions {
  days?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch device and browser statistics
 */
export function useDeviceStats({
  days = 30,
  enabled = true,
}: UseDeviceStatsOptions = {}) {
  return useQuery({
    queryKey: ["device-stats", days],
    queryFn: async () => {
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - days);

      const { data, error } = await supabase.rpc("get_device_breakdown", {
        since_date: sinceDate.toISOString(),
      });

      if (error) {
        secureLogger.error("Error fetching device stats", { error });
        throw error;
      }

      return data as unknown as DeviceStatsData;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled,
  });
}
