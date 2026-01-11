"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import type { HistoryData } from "@/types/etf.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PriceChart({
  data,
  height = 400,
  title,
}: {
  data: HistoryData;
  height?: number;
  title?: string;
}) {
  const chartData = useMemo(() => {
    const quotes = data.indicators.quote[0];
    return data.timestamps.map((timestamp, index) => ({
      date: new Date(timestamp * 1000),
      dateStr: new Date(timestamp * 1000).toLocaleDateString(),
      close: quotes.close[index],
      open: quotes.open[index],
      high: quotes.high[index],
      low: quotes.low[index],
      volume: quotes.volume[index],
    }));
  }, [data]);

  const minPrice = Math.min(...chartData.map((d) => d.low)) * 0.999;
  const maxPrice = Math.max(...chartData.map((d) => d.high)) * 1.001;

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="dateStr"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => {
                // Simplify date display on small screens
                const date = new Date(value);
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#3b82f6", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#3b82f6"
              fill="url(#colorGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload }: TooltipProps<any, any>) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white border rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium text-gray-900">{data.dateStr}</p>
      <div className="mt-2 space-y-1">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-gray-500">Open:</span>
          <span className="font-medium">${data.open?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-gray-500">High:</span>
          <span className="font-medium text-green-600">${data.high?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-gray-500">Low:</span>
          <span className="font-medium text-red-600">${data.low?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-gray-500">Close:</span>
          <span className="font-medium">${data.close?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-gray-500">Volume:</span>
          <span className="font-medium">{(data.volume / 1000000).toFixed(2)}M</span>
        </div>
      </div>
    </div>
  );
}
