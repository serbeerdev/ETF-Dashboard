"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PriceBadge } from "@/components/etf/price-badge";
import { transformQuote } from "@/lib/utils";
import type { EtfQuote } from "@/types/etf.types";

export function EtfCard({ etf }: { etf: EtfQuote }) {
  const transformed = transformQuote(etf);

  return (
    <Link href={`/etf/${etf.symbol}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold truncate">{etf.symbol}</h3>
              <p className="text-sm text-gray-500 truncate">{transformed.name}</p>
            </div>
            <PriceBadge change={transformed.changePercent} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${transformed.price.toFixed(2)}</div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <span className={transformed.change >= 0 ? "text-green-600" : "text-red-600"}>
              {transformed.change >= 0 ? "+" : ""}{transformed.change.toFixed(2)}
            </span>
            <span>•</span>
            <span>Vol: {(transformed.volume / 1000000).toFixed(2)}M</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
