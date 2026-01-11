"use client";

import { useState } from "react";
import { PriceChart } from "@/components/chart/price-chart";
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

  const isIntraday = interval === "1D";
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Price Chart</h2>
        <IntervalSelector value={interval} onChange={setInterval} />
      </div>
      <PriceChart data={data} height={400} />
    </div>
  );
}
