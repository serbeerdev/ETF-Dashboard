"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, AreaSeries, CandlestickSeries, LineSeries, type IChartApi, type ISeriesApi } from "lightweight-charts";
import { SMA, EMA } from "lightweight-charts-indicators";
import type { Bar } from "oakscriptjs";
import type { HistoryData } from "@/types/etf.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import type { ChartType } from "@/components/chart/chart-type-selector";
import type { MovingAverageType } from "@/components/chart/moving-average-selector";

// Calculate Heikin Ashi data from regular OHLC data
function calculateHeikinAshi(data: { time: number; open: number; high: number; low: number; close: number }[]) {
  if (data.length === 0) return [];

  const heikinAshiData: { time: number; open: number; high: number; low: number; close: number }[] = [];
  let prevHaOpen = data[0].open;
  let prevHaClose = data[0].close;

  data.forEach((candle, index) => {
    const haClose = (candle.open + candle.high + candle.low + candle.close) / 4;
    const haOpen = index === 0
      ? (candle.open + candle.close) / 2
      : (prevHaOpen + prevHaClose) / 2;
    const haHigh = Math.max(candle.high, haOpen, haClose);
    const haLow = Math.min(candle.low, haOpen, haClose);

    heikinAshiData.push({
      time: candle.time,
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose,
    });

    prevHaOpen = haOpen;
    prevHaClose = haClose;
  });

  return heikinAshiData;
}

// Calculate moving averages
function calculateMovingAverages(
  chartData: { time: number; open: number; high: number; low: number; close: number }[],
  types: MovingAverageType[]
) {
  const results = new Map<string, { time: number; value: number }[]>();

  // Transform data to Bar format for the indicator library
  const bars: Bar[] = chartData.map(d => ({
    time: d.time,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
    volume: 0,
  }));

  console.log('calculateMovingAverages - Input bars:', bars.length, 'Types:', types);

  // Calculate each requested moving average
  for (const type of types) {
    try {
      let result;
      switch (type) {
        case "sma20": {
          result = SMA.calculate(bars, { len: 20, src: "close", offset: 0 });
          console.log('SMA 20 calculated - plots:', result.plots.plot0?.length);
          if (result.plots.plot0 && result.plots.plot0.length > 0) {
            results.set("sma20", result.plots.plot0);
          } else {
            console.warn('SMA 20 - No data points calculated');
          }
          break;
        }
        case "sma50": {
          result = SMA.calculate(bars, { len: 50, src: "close", offset: 0 });
          console.log('SMA 50 calculated - plots:', result.plots.plot0?.length);
          if (result.plots.plot0 && result.plots.plot0.length > 0) {
            results.set("sma50", result.plots.plot0);
          } else {
            console.warn('SMA 50 - No data points calculated');
          }
          break;
        }
        case "ema12": {
          result = EMA.calculate(bars, { len: 12, src: "close", offset: 0 });
          console.log('EMA 12 calculated - plots:', result.plots.plot0?.length);
          if (result.plots.plot0 && result.plots.plot0.length > 0) {
            results.set("ema12", result.plots.plot0);
          } else {
            console.warn('EMA 12 - No data points calculated');
          }
          break;
        }
        case "ema26": {
          result = EMA.calculate(bars, { len: 26, src: "close", offset: 0 });
          console.log('EMA 26 calculated - plots:', result.plots.plot0?.length);
          if (result.plots.plot0 && result.plots.plot0.length > 0) {
            results.set("ema26", result.plots.plot0);
          } else {
            console.warn('EMA 26 - No data points calculated');
          }
          break;
        }
      }
    } catch (e) {
      console.error(`Error calculating ${type}:`, e);
    }
  }

  console.log('calculateMovingAverages - Results size:', results.size);
  return results;
}

export function PriceChartLightweight({
  data,
  height = 400,
  title,
  chartType = "area",
  movingAverages = [],
}: {
  data: HistoryData;
  height?: number;
  title?: string;
  chartType?: ChartType;
  movingAverages?: MovingAverageType[];
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area" | "Candlestick"> | null>(null);
  const maSeriesRef = useRef<Map<string, ISeriesApi<"Line">>>(new Map());
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
        rightOffset: 25,
        barSpacing: 10,
        minBarSpacing: 3,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
    });

    chartRef.current = chart;
    isChartReadyRef.current = true;

    // Hide TradingView logo
    const hideTradingViewLogo = () => {
      const logoElement = document.getElementById('tv-attr-logo');
      if (logoElement) {
        logoElement.setAttribute('hidden', 'true');
      }
    };

    // Try to hide immediately and also on interval
    hideTradingViewLogo();
    const logoCheckInterval = setInterval(hideTradingViewLogo, 100);

    // Stop checking after 2 seconds
    setTimeout(() => {
      clearInterval(logoCheckInterval);
    }, 2000);

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
      clearInterval(logoCheckInterval);
      maSeriesRef.current.clear();
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

    // Remove existing moving average series
    maSeriesRef.current.forEach((series) => {
      try {
        chartRef.current?.removeSeries(series);
      } catch (e) {
        console.warn("Failed to remove MA series:", e);
      }
    });
    maSeriesRef.current.clear();

    // Filter and transform data
    const filteredQuotes = data.quotes
      .filter((quote) => {
        const date = new Date(quote.date);
        return !isNaN(date.getTime()) && quote.open && quote.high && quote.low && quote.close;
      })
      .map((quote) => {
        const date = new Date(quote.date);
        // Use Unix timestamp in seconds - works for both intraday and daily data
        return {
          time: Math.floor(date.getTime() / 1000) as any,
          open: quote.open,
          high: quote.high,
          low: quote.low,
          close: quote.close,
        };
      })
      .sort((a, b) => a.time - b.time);

    // Detect if this is intraday data by checking if any points are on the same day
    const isIntraday = filteredQuotes.length > 1 &&
      filteredQuotes.some((point, idx) => {
        if (idx === 0) return false;
        // Check if current and previous points are on the same calendar day
        const currentDay = Math.floor(point.time / 86400);
        const prevDay = Math.floor(filteredQuotes[idx - 1].time / 86400);
        return currentDay === prevDay;
      });

    // Calculate average time gap between points to detect granularity
    const avgTimeGap = filteredQuotes.length > 1
      ? (filteredQuotes[filteredQuotes.length - 1].time - filteredQuotes[0].time) / (filteredQuotes.length - 1)
      : 0;

    // Limit to last 400 points only for high-frequency intraday data (< 15min intervals)
    // Hourly data (1h) should not be limited as it provides good granularity without overcrowding
    const isHighFrequencyData = isIntraday && avgTimeGap < 900; // Less than 15 minutes
    let chartData = filteredQuotes;
    if (isHighFrequencyData && chartData.length > 400) {
      chartData = chartData.slice(-400);
      console.log('Lightweight Charts - Limited to last 400 points (high-frequency data)');
    }

    console.log('Lightweight Charts - Data points:', chartData.length, 'First time:', chartData[0]?.time, 'Last time:', chartData[chartData.length - 1]?.time);

    // Calculate Heikin Ashi if needed
    let finalChartData = chartData;
    if (chartType === "heikin_ashi") {
      finalChartData = calculateHeikinAshi(chartData);
      console.log('Lightweight Charts - Heikin Ashi calculated');
    }

    // Double-check chart still exists and is ready before adding series
    if (!chartRef.current || !isChartReadyRef.current) return;

    try {
      // Add series based on chart type
      if (chartType === "area") {
        // For area chart, we only need close prices
        const areaData = finalChartData.map(d => ({
          time: d.time,
          value: d.close,
        }));

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
        areaSeries.setData(areaData);
      } else {
        // Candlestick or Heikin Ashi
        const candlestickSeries = chartRef.current.addSeries(CandlestickSeries, {
          lastValueVisible: true,
          priceLineVisible: true,
          priceFormat: {
            type: "price",
            precision: 2,
            minMove: 0.01,
          },
          upColor: currentTheme === "dark" ? "#22c55e" : "#22c55e",
          downColor: currentTheme === "dark" ? "#ef4444" : "#ef4444",
          borderVisible: false,
          wickUpColor: currentTheme === "dark" ? "#22c55e" : "#22c55e",
          wickDownColor: currentTheme === "dark" ? "#ef4444" : "#ef4444",
        });

        seriesRef.current = candlestickSeries;
        candlestickSeries.setData(finalChartData);
      }

    // Final check before operations
    if (!chartRef.current || !isChartReadyRef.current) return;

    // Determine if this is intraday data (same logic as before, re-calculated for clarity)
    const isIntraday = finalChartData.length > 1 &&
      finalChartData.some((point, idx) => {
        if (idx === 0) return false;
        const currentDay = Math.floor(point.time / 86400);
        const prevDay = Math.floor(finalChartData[idx - 1].time / 86400);
        return currentDay === prevDay;
      });

    console.log('Lightweight Charts - Is intraday:', isIntraday, 'Data length:', finalChartData.length, 'Chart type:', chartType);

    if (isIntraday) {
      // For intraday data with lots of points, scroll to end instead of fitting
      if (finalChartData.length > 1000) {
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

    // Calculate and add moving averages
    if (movingAverages.length > 0) {
      const maData = calculateMovingAverages(finalChartData, movingAverages);

      // Define colors for each MA type
      const maColors: Record<MovingAverageType, string> = {
        sma20: "#2962FF",
        sma50: "#FF6D00",
        ema12: "#7E57C2",
        ema26: "#00BCD4",
      };

      // Add each moving average as a line series
      for (const [type, data] of maData) {
        if (!chartRef.current || !isChartReadyRef.current) break;

        try {
          // Filter out NaN values that occur at the beginning of SMA calculations
          const validData = data.filter(point =>
            point !== null &&
            point !== undefined &&
            !isNaN(point.value) &&
            point.value !== null &&
            point.value !== undefined
          );

          if (validData.length === 0) {
            console.warn(`No valid data points for ${type}`);
            continue;
          }

          const maSeries = chartRef.current.addSeries(LineSeries, {
            color: maColors[type as MovingAverageType],
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: true,
            title: "", // Ocultar título para no tapar el gráfico
          });

          maSeries.setData(validData);
          maSeriesRef.current.set(type, maSeries);
          console.log(`Successfully added ${type} series with ${validData.length} points`);
        } catch (e) {
          console.warn(`Failed to add ${type} series:`, e);
        }
      }
    }
    } catch (e) {
      console.warn("Failed to update chart data:", e);
    }
  }, [data, currentTheme, chartType, movingAverages]);

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
