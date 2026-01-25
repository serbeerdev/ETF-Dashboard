"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, AreaSeries, type IChartApi, type ISeriesApi } from "lightweight-charts";
import type { HistoryData } from "@/types/etf.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

export function PriceChartLightweight({
  data,
  height = 400,
  title,
}: {
  data: HistoryData;
  height?: number;
  title?: string;
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const isChartReadyRef = useRef(false);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Mark as not ready during initialization
    isChartReadyRef.current = false;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { type: "solid", color: "transparent" },
        textColor: currentTheme === "dark" ? "#9ca3af" : "#6b7280",
      },
      grid: {
        vertLines: {
          color: currentTheme === "dark" ? "#374151" : "#e5e7eb",
          style: 2,
          visible: true,
        },
        horzLines: {
          color: currentTheme === "dark" ? "#374151" : "#e5e7eb",
          style: 2,
          visible: true,
        },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: currentTheme === "dark" ? "#374151" : "#e5e7eb",
      },
      timeScale: {
        borderColor: currentTheme === "dark" ? "#374151" : "#e5e7eb",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
        barSpacing: 10,
        minBarSpacing: 3,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
    });

    chartRef.current = chart;
    isChartReadyRef.current = true;

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
      isChartReadyRef.current = false;
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [height, currentTheme]);

  // Update chart data
  useEffect(() => {
    // Only proceed if chart is ready
    if (!chartRef.current || !isChartReadyRef.current) return;

    // Remove existing series
    if (seriesRef.current) {
      try {
        chartRef.current.removeSeries(seriesRef.current);
      } catch (e) {
        // Chart might have been destroyed, ignore error
        console.warn("Failed to remove series:", e);
      }
      seriesRef.current = null;
    }

    // Filter and transform data
    let chartData = data.quotes
      .filter((quote) => {
        const date = new Date(quote.date);
        return !isNaN(date.getTime());
      })
      .map((quote) => {
        const date = new Date(quote.date);
        // Use Unix timestamp in seconds - works for both intraday and daily data
        return {
          time: Math.floor(date.getTime() / 1000) as any,
          value: quote.close,
        };
      })
      .sort((a, b) => a.time - b.time);

    // Limit to last 400 points for intraday data to avoid overcrowding
    const isIntraday = chartData.length > 0 && chartData[0].time % 86400 !== 0;
    if (isIntraday && chartData.length > 400) {
      chartData = chartData.slice(-400);
      console.log('Lightweight Charts - Limited to last 400 points');
    }

    console.log('Lightweight Charts - Data points:', chartData.length, 'First time:', chartData[0]?.time, 'Last time:', chartData[chartData.length - 1]?.time);

    // Double-check chart still exists and is ready before adding series
    if (!chartRef.current || !isChartReadyRef.current) return;

    try {
      // Add area series
      const areaSeries = chartRef.current.addSeries(AreaSeries, {
      lastValueVisible: true,
      priceLineVisible: true,
      priceFormat: {
        type: "price",
        precision: 2,
        minMove: 0.01,
      },
      lineColor: currentTheme === "dark" ? "#60a5fa" : "#3b82f6",
      topColor: currentTheme === "dark" ? "rgba(96, 165, 250, 0.4)" : "rgba(59, 130, 246, 0.3)",
      bottomColor: currentTheme === "dark" ? "rgba(96, 165, 250, 0)" : "rgba(59, 130, 246, 0)",
    });

    seriesRef.current = areaSeries;
    areaSeries.setData(chartData);

    // Final check before operations
    if (!chartRef.current || !isChartReadyRef.current) return;

    // Determine if this is intraday data
    const isIntraday = chartData.length > 0 && chartData[0].time % 86400 !== 0;

    console.log('Lightweight Charts - Is intraday:', isIntraday, 'Data length:', chartData.length);

    if (isIntraday) {
      // For intraday data with lots of points, scroll to end instead of fitting
      if (chartData.length > 1000) {
        chartRef.current.timeScale().scrollToPosition(0, false);
      } else {
        chartRef.current.timeScale().fitContent();
      }
    } else {
      // For daily data, scroll to the end to show most recent data
      chartRef.current.timeScale().scrollToPosition(0, false);
    }

    // Set price scale range
    chartRef.current.priceScale("right").applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.2,
      },
    });
    } catch (e) {
      console.warn("Failed to update chart data:", e);
    }
  }, [data, currentTheme]);

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div ref={chartContainerRef} style={{ height: `${height}px` }} />
      </CardContent>
    </Card>
  );
}
