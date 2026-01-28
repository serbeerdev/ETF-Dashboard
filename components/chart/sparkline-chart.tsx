"use client";

import { useEffect, useRef } from "react";
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

  // Transform data to lightweight-charts format
  const chartData = data.data.map((point) => ({
    time: point.t,
    value: point.p,
  }));

  // Calculate color based on trend (first vs last point)
  const firstPoint = chartData[0];
  const lastPoint = chartData[chartData.length - 1];
  const isPositive = lastPoint.value >= firstPoint.value;
  const lineColor = isPositive
    ? (currentTheme === "dark" ? "#22c55e" : "#16a34a") // Green
    : (currentTheme === "dark" ? "#ef4444" : "#dc2626"); // Red

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
  }, []); // Only run on mount/unmount

  // Update data when it changes
  useEffect(() => {
    if (seriesRef.current && chartData.length > 0) {
      seriesRef.current.setData(chartData);
    }
  }, [chartData, lineColor]);

  return (
    <div
      ref={chartContainerRef}
      style={{ height: `${height}px`, width: width ? `${width}px` : "100%" }}
    />
  );
}
