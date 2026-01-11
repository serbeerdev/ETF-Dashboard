import { useQuery } from "@tanstack/react-query";
import { etfApi } from "@/lib/api/etf-api";
import type {
  EtfInfo,
  EtfPrice,
  HistoryData,
  Holdings,
  Insights,
  NewsArticle,
  Recommendation,
} from "@/types/etf.types";

// Query keys factory
export const etfQueryKeys = {
  all: ["etf"] as const,
  search: (query: string) => ["etf", "search", query] as const,
  info: (symbol: string) => ["etf", "info", symbol] as const,
  price: (symbol: string) => ["etf", "price", symbol] as const,
  dailyHistory: (symbol: string, params?: any) =>
    ["etf", "history", "daily", symbol, params] as const,
  intradayHistory: (symbol: string, params?: any) =>
    ["etf", "history", "intraday", symbol, params] as const,
  dividends: (symbol: string) => ["etf", "dividends", symbol] as const,
  insights: (symbol: string) => ["etf", "insights", symbol] as const,
  holdings: (symbol: string) => ["etf", "holdings", symbol] as const,
  recommendations: (symbol: string) =>
    ["etf", "recommendations", symbol] as const,
  news: (symbol: string) => ["etf", "news", symbol] as const,
  report: (symbol: string) => ["etf", "report", symbol] as const,
  featured: () => ["etf", "featured"] as const,
};

// Hook: Featured ETFs
export function useFeaturedEtfs() {
  return useQuery({
    queryKey: etfQueryKeys.featured(),
    queryFn: () => etfApi.getFeaturedEtfs(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Hook: ETF Info
export function useEtfInfo(symbol: string) {
  return useQuery({
    queryKey: etfQueryKeys.info(symbol),
    queryFn: () => etfApi.getEtfInfo(symbol),
    enabled: !!symbol,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Hook: ETF Price (real-time)
export function useEtfPrice(symbol: string, refetchInterval?: number) {
  return useQuery({
    queryKey: etfQueryKeys.price(symbol),
    queryFn: () => etfApi.getEtfPrice(symbol),
    enabled: !!symbol,
    refetchInterval: refetchInterval || 60 * 1000, // Default: 1 minute
    staleTime: 10 * 1000, // 10 seconds
  });
}

// Hook: Daily History
export function useDailyHistory(symbol: string, params?: any) {
  return useQuery({
    queryKey: etfQueryKeys.dailyHistory(symbol, params),
    queryFn: () => etfApi.getDailyHistory(symbol, params),
    enabled: !!symbol,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Hook: Intraday History
export function useIntradayHistory(symbol: string, params?: any) {
  return useQuery({
    queryKey: etfQueryKeys.intradayHistory(symbol, params),
    queryFn: () => etfApi.getIntradayHistory(symbol, params),
    enabled: !!symbol,
    refetchInterval: 60 * 1000, // 1 minute
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Hook: Holdings
export function useHoldings(symbol: string) {
  return useQuery({
    queryKey: etfQueryKeys.holdings(symbol),
    queryFn: () => etfApi.getHoldings(symbol),
    enabled: !!symbol,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Hook: Insights
export function useInsights(symbol: string) {
  return useQuery({
    queryKey: etfQueryKeys.insights(symbol),
    queryFn: () => etfApi.getInsights(symbol),
    enabled: !!symbol,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Hook: News
export function useNews(symbol: string) {
  return useQuery({
    queryKey: etfQueryKeys.news(symbol),
    queryFn: () => etfApi.getNews(symbol),
    enabled: !!symbol,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook: Full Report
export function useFullReport(symbol: string) {
  return useQuery({
    queryKey: etfQueryKeys.report(symbol),
    queryFn: () => etfApi.getFullReport(symbol),
    enabled: !!symbol,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Hook: Search
export function useSearchEtfs(query: string) {
  return useQuery({
    queryKey: etfQueryKeys.search(query),
    queryFn: () => etfApi.searchEtfs(query),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook: Recommendations
export function useRecommendations(symbol: string) {
  return useQuery({
    queryKey: etfQueryKeys.recommendations(symbol),
    queryFn: () => etfApi.getRecommendations(symbol),
    enabled: !!symbol,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
