"use client";

import { useState } from "react";
import { PriceChartLightweight } from "@/components/chart/price-chart-lightweight";
import { IntervalSelector, mapIntervalToParams } from "@/components/chart/interval-selector";
import { useDailyHistory, useIntradayHistory } from "@/hooks/use-etf-data";
import type { Interval } from "@/components/chart/interval-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EtfChartSectionProps {
  symbol: string;
}

export function EtfChartSection({ symbol }: EtfChartSectionProps) {
  const [interval, setInterval] = useState<Interval>("1M");

  // 1D uses intraday API, 1W with "1h" interval also uses intraday API
  const isIntraday = interval === "1D" || interval === "1W";
  const params = mapIntervalToParams(interval);

  const { data, isLoading, error } = isIntraday
    ? useIntradayHistory(symbol, params)
    : useDailyHistory(symbol, params);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load chart data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Price Charts</h2>
        <IntervalSelector value={interval} onChange={setInterval} />
      </div>

      <PriceChartLightweight data={data} height={400} title="Price History" />
    </div>
  );
}
