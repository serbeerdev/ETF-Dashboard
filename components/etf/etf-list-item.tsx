"use client";

import Link from "next/link";
import { SparklineChart } from "@/components/chart/sparkline-chart";
import { transformQuote } from "@/lib/utils";
import { useSparkline } from "@/hooks/use-etf-data";
import type { EtfQuote } from "@/types/etf.types";

export function EtfListItem({ etf }: { etf: EtfQuote }) {
  const transformed = transformQuote(etf);
  const { data: sparklineData } = useSparkline(etf.symbol, {
    period: "1m",
    points: 30,
  });

  return (
    <Link href={`/etf/${etf.symbol}`}>
      <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
        {/* Icon - Using a simple colored square with first letter as placeholder */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
          {etf.symbol[0]}
        </div>

        {/* Symbol and Name */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg truncate">{etf.symbol}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{transformed.name}</p>
        </div>

        {/* Price and Day Range */}
        <div className="flex-shrink-0 text-right">
          <div className="font-bold text-lg">${transformed.price.toFixed(2)}</div>
          <div className={`text-sm font-medium ${transformed.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {transformed.change >= 0 ? "+" : ""}{transformed.changePercent.toFixed(2)}%
          </div>
          {sparklineData && sparklineData.data.length > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {sparklineData.data[0].p.toFixed(2)} → {sparklineData.data[sparklineData.data.length - 1].p.toFixed(2)}
            </div>
          )}
        </div>

        {/* Day Sparkline */}
        {sparklineData && (
          <div className="flex-shrink-0 w-24">
            <SparklineChart data={sparklineData} height={40} />
          </div>
        )}
      </div>
    </Link>
  );
}
