"use client";

import { useState } from "react";
import { PriceChartLightweight } from "@/components/chart/price-chart-lightweight";
import { IntervalSelector, mapIntervalToParams } from "@/components/chart/interval-selector";
import { ChartTypeSelector } from "@/components/chart/chart-type-selector";
import { MovingAverageSelector } from "@/components/chart/moving-average-selector";
import { useDailyHistory, useIntradayHistory } from "@/hooks/use-etf-data";
import type { Interval } from "@/components/chart/interval-selector";
import type { ChartType } from "@/components/chart/chart-type-selector";
import type { MovingAverageType } from "@/components/chart/moving-average-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EtfChartSectionProps {
  symbol: string;
}

export function EtfChartSection({ symbol }: EtfChartSectionProps) {
  const [interval, setInterval] = useState<Interval>("1M");
  const [chartType, setChartType] = useState<ChartType>("area");
  const [movingAverages, setMovingAverages] = useState<MovingAverageType[]>([]);

  // 1D, 1W, 1M use intraday API (1h for 1W and 1M)
  const isIntraday = interval === "1D" || interval === "1W" || interval === "1M";
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-semibold">Price Charts</h2>
        <div className="flex gap-2 flex-wrap">
          <IntervalSelector value={interval} onChange={setInterval} />
          <ChartTypeSelector value={chartType} onChange={setChartType} />
          <MovingAverageSelector value={movingAverages} onChange={setMovingAverages} />
        </div>
      </div>

      <PriceChartLightweight
        data={data}
        height={400}
        title="Price History"
        chartType={chartType}
        movingAverages={movingAverages}
      />
    </div>
  );
}
