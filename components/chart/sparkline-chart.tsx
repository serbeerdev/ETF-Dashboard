"use client";

import { useEffect, useRef, useMemo } from "react";
import { createChart, LineSeries, type IChartApi, type ISeriesApi } from "lightweight-charts";
import type { SparklineData } from "@/types/etf.types";
import { useTheme } from "next-themes";

interface SparklineChartProps {
  data: SparklineData;
  height?: number;
  width?: number;
}

export function SparklineChart({ data, height = 60, width }: SparklineChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  // Transform data to lightweight-charts format (memoized)
  const chartData = useMemo(() =>
    data.data.map((point) => ({
      time: point.t,
      value: point.p,
    })),
    [data]
  );

  // Calculate color based on trend (first vs last point) (memoized)
  const lineColor = useMemo(() => {
    if (chartData.length === 0) return "#16a34a";
    const firstPoint = chartData[0];
    const lastPoint = chartData[chartData.length - 1];
    const isPositive = lastPoint.value >= firstPoint.value;
    return isPositive
      ? (currentTheme === "dark" ? "#22c55e" : "#16a34a") // Green
      : (currentTheme === "dark" ? "#ef4444" : "#dc2626"); // Red
  }, [chartData, currentTheme]);

  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: width || chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { type: "solid", color: "transparent" },
        textColor: "transparent",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      leftPriceScale: {
        visible: false,
      },
      rightPriceScale: {
        visible: false,
      },
      timeScale: {
        visible: false,
        borderColor: "transparent",
      },
      crosshair: {
        mode: 0,
      },
      handleScale: false,
      handleScroll: false,
    });

    chartRef.current = chart;

    // Add line series
    const lineSeries = chart.addSeries(LineSeries, {
      color: lineColor,
      lineWidth: 1.5,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    seriesRef.current = lineSeries;
    lineSeries.setData(chartData);

    // Fit content to show all data
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (seriesRef.current) {
        chartRef.current?.removeSeries(seriesRef.current);
      }
      chart.remove();
    };
  }, [chartData, lineColor, height, width]); // Re-create when data or color changes

  return (
    <div
      ref={chartContainerRef}
      className="chart-container"
      style={{ height: `${height}px`, width: width ? `${width}px` : "100%" }}
    />
  );
}
