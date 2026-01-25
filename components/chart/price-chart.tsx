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
    return data.quotes
      .filter((quote) => quote.date && !isNaN(new Date(quote.date).getTime()))
      .map((quote) => {
        const dateObj = new Date(quote.date);
        const isIntraday = quote.date.includes("T") || quote.date.includes(" ");

        // Format date string based on whether it's intraday or daily data
        let dateStr = "N/A";
        if (!isNaN(dateObj.getTime())) {
          if (isIntraday) {
            // For intraday: show date and time
            dateStr = dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          } else {
            // For daily: just show date
            dateStr = dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          }
        }

        return {
          date: dateObj,
          dateStr,
          isIntraday,
          close: quote.close,
          open: quote.open,
          high: quote.high,
          low: quote.low,
          volume: quote.volume,
        };
      });
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
              <linearGradient id="colorGradientDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              tickFormatter={(value) => {
                if (value instanceof Date && !isNaN(value.getTime())) {
                  // Check if this is intraday data by looking at the first data point
                  const isIntraday = chartData.length > 0 && chartData[0].isIntraday;

                  if (isIntraday) {
                    // For intraday: show time
                    return value.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  } else {
                    // For daily: show date
                    return value.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }
                }
                return "";
              }}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#3b82f6", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#3b82f6"
              fill="url(#colorGradient)"
              className="dark:stroke-blue-400 dark:fill-[url(#colorGradientDark)]"
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
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
        {data.dateStr}
      </p>
      <div className="mt-2 space-y-1">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Open:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">${data.open?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400">High:</span>
          <span className="font-medium text-green-600 dark:text-green-400">${data.high?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Low:</span>
          <span className="font-medium text-red-600 dark:text-red-400">${data.low?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Close:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">${data.close?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Volume:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {data.volume >= 1000000
              ? `${(data.volume / 1000000).toFixed(2)}M`
              : data.volume >= 1000
              ? `${(data.volume / 1000).toFixed(2)}K`
              : data.volume.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
