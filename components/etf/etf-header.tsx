import { Card, CardContent } from "@/components/ui/card";
import { PriceBadge } from "@/components/etf/price-badge";
import { transformQuote } from "@/lib/utils";
import type { EtfInfo } from "@/types/etf.types";

export function EtfHeader({
  symbol,
  info,
}: {
  symbol: string;
  info: EtfInfo;
}) {
  const price = transformQuote(info.price);
  const summary = info.summaryProfile.longBusinessSummary || "";
  const truncatedSummary = summary.length > 200
    ? summary.slice(0, 200) + "..."
    : summary;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold">{symbol}</h1>
            <p className="text-lg text-gray-500 mt-1 line-clamp-2">{truncatedSummary}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-bold">${price.price.toFixed(2)}</div>
            <div className="mt-2 flex items-center justify-end gap-2">
              <PriceBadge change={price.changePercent} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
          <div>
            <span className="text-gray-500">Day High:</span>
            <span className="ml-2 font-medium">${price.dayHigh.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">Day Low:</span>
            <span className="ml-2 font-medium">${price.dayLow.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">Volume:</span>
            <span className="ml-2 font-medium">{(price.volume / 1000000).toFixed(2)}M</span>
          </div>
          <div>
            <span className="text-gray-500">Prev Close:</span>
            <span className="ml-2 font-medium">${price.previousClose.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
