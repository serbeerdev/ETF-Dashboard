"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type MovingAverageType = "sma20" | "sma50" | "ema12" | "ema26";

const movingAverageOptions: { value: MovingAverageType; label: string; color: string }[] = [
  { value: "sma20", label: "SMA 20", color: "#2962FF" },
  { value: "sma50", label: "SMA 50", color: "#FF6D00" },
  { value: "ema12", label: "EMA 12", color: "#7E57C2" },
  { value: "ema26", label: "EMA 26", color: "#00BCD4" },
];

interface MovingAverageSelectorProps {
  value: MovingAverageType[];
  onChange: (types: MovingAverageType[]) => void;
  className?: string;
}

export function MovingAverageSelector({
  value,
  onChange,
  className = "",
}: MovingAverageSelectorProps) {
  return (
    <ToggleGroup
      type="multiple"
      value={value}
      onValueChange={(vals) => onChange(vals as MovingAverageType[])}
      variant="outline"
      className={className}
    >
      {movingAverageOptions.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.label}
          className="px-3 data-[state=on]:border-current"
          style={{
            "--toggle-color": option.color,
          } as React.CSSProperties}
        >
          <span
            className="inline-block w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: option.color }}
          />
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
