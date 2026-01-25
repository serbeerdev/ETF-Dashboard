"use client";

import { Button } from "@/components/ui/button";

export type Interval = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y" | "MAX";

const intervals: Interval[] = ["1D", "1W", "1M", "3M", "6M", "1Y", "5Y", "MAX"];

interface IntervalSelectorProps {
  value: Interval;
  onChange: (interval: Interval) => void;
  className?: string;
}

export function IntervalSelector({
  value,
  onChange,
  className = "",
}: IntervalSelectorProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {intervals.map((interval) => (
        <Button
          key={interval}
          variant={value === interval ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(interval)}
          className="min-w-[3rem]"
        >
          {interval}
        </Button>
      ))}
    </div>
  );
}

// Calculate from/to dates based on interval
function calculateDateRange(interval: Interval): { from: string; to: string } {
  const to = new Date();
  const from = new Date();

  switch (interval) {
    case "1D":
      from.setDate(to.getDate() - 2); // Show 2 days of intraday data
      break;
    case "1W":
      from.setDate(to.getDate() - 7);
      break;
    case "1M":
      from.setMonth(to.getMonth() - 1);
      break;
    case "3M":
      from.setMonth(to.getMonth() - 3);
      break;
    case "6M":
      from.setMonth(to.getMonth() - 6);
      break;
    case "1Y":
      from.setFullYear(to.getFullYear() - 1);
      break;
    case "5Y":
      from.setFullYear(to.getFullYear() - 5);
      break;
    case "MAX":
      from.setFullYear(2015, 0, 1); // Start from 2015
      break;
  }

  // Format as YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return {
    from: formatDate(from),
    to: formatDate(to),
  };
}

// Map interval to API params
export function mapIntervalToParams(interval: Interval): {
  from?: string;
  to?: string;
  interval?: string;
} {
  const intervalMap: Record<Interval, string> = {
    "1D": "1m",
    "1W": "1h",
    "1M": "1d",
    "3M": "1wk",
    "6M": "1wk",
    "1Y": "1mo",
    "5Y": "1mo",
    "MAX": "1wk",
  };

  const { from, to } = calculateDateRange(interval);

  return {
    from,
    to,
    interval: intervalMap[interval],
  };
}
