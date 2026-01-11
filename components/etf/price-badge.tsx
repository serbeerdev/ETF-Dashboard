import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export function PriceBadge({ change }: { change: number }) {
  const isPositive = change >= 0;

  return (
    <Badge variant={isPositive ? "default" : "destructive"} className="font-semibold">
      {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
      {isPositive ? "+" : ""}{change.toFixed(2)}%
    </Badge>
  );
}
