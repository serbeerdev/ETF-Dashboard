"use client";

import { Button } from "@/components/ui/button";

type Interval = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y" | "MAX";

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

// Map interval to API params
export function mapIntervalToParams(interval: Interval): {
  range?: string;
  interval?: string;
} {
  const map: Record<Interval, any> = {
    "1D": { range: "1d", interval: "1m" },
    "1W": { range: "5d", interval: "5d" },
    "1M": { range: "1mo", interval: "1d" },
    "3M": { range: "3mo", interval: "1wk" },
    "6M": { range: "6mo", interval: "1wk" },
    "1Y": { range: "1y", interval: "1mo" },
    "5Y": { range: "5y", interval: "1mo" },
    "MAX": { range: "max", interval: "3mo" },
  };

  return map[interval];
}
