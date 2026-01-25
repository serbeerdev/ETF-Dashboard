"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type ChartType = "area" | "candlestick" | "heikin_ashi";

const chartTypes: { value: ChartType; label: string }[] = [
  { value: "area", label: "Área" },
  { value: "candlestick", label: "Velas" },
  { value: "heikin_ashi", label: "Heikin Ashi" },
];

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
  className?: string;
}

export function ChartTypeSelector({
  value,
  onChange,
  className = "",
}: ChartTypeSelectorProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => val && onChange(val as ChartType)}
      variant="outline"
      className={className}
    >
      {chartTypes.map((type) => (
        <ToggleGroupItem
          key={type.value}
          value={type.value}
          aria-label={type.label}
          className="px-3 data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600 dark:data-[state=on]:bg-blue-500 dark:data-[state=on]:text-white dark:data-[state=on]:border-blue-500"
        >
          {type.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
