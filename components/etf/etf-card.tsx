"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PriceBadge } from "@/components/etf/price-badge";
import { SparklineChart } from "@/components/chart/sparkline-chart";
import { transformQuote } from "@/lib/utils";
import { useSparkline } from "@/hooks/use-etf-data";
import type { EtfQuote } from "@/types/etf.types";

export function EtfCard({ etf }: { etf: EtfQuote }) {
  const transformed = transformQuote(etf);
  const { data: sparklineData } = useSparkline(etf.symbol, {
    period: "1m",
    points: 30,
  });

  return (
    <Link href={`/etf/${etf.symbol}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold truncate">{etf.symbol}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{transformed.name}</p>
            </div>
            <PriceBadge change={transformed.changePercent} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${transformed.price.toFixed(2)}</div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span className={transformed.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
              {transformed.change >= 0 ? "+" : ""}{transformed.change.toFixed(2)}
            </span>
            <span>•</span>
            <span>Vol: {(transformed.volume / 1000000).toFixed(2)}M</span>
          </div>

          {/* Day Info */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Apertura:</span>
              <span className="font-medium">${transformed.open.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Rango:</span>
              <span className="font-medium">
                {transformed.dayLow.toFixed(2)} - {transformed.dayHigh.toFixed(2)}
              </span>
            </div>
            {sparklineData && sparklineData.data.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">1 Mes:</span>
                <span className="font-medium">
                  ${sparklineData.data[0].p.toFixed(2)} → ${sparklineData.data[sparklineData.data.length - 1].p.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {sparklineData && (
            <div className="mt-3">
              <SparklineChart data={sparklineData} height={50} />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
