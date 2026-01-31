import type {
  SearchResult,
  EtfQuote,
  EtfInfo,
  EtfPrice,
  HistoryData,
  Holdings,
  Insights,
  NewsArticle,
  Recommendation,
  Dividend,
  FullReport,
  SparklineData,
} from "@/types/etf.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class EtfApiService {
  private backendUrl: string;

  constructor() {
    this.backendUrl = API_BASE_URL; 
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    // Server components use backend directly, client uses backend too (via API routes proxy)
    // But we need to check if we're in a server component context
    const isServer = typeof window === "undefined";

    let url: string;
    if (isServer) {
      // Server component: call backend directly
      url = `${this.backendUrl}${endpoint}`;
    } else {
      // Client component: use Next.js API routes as proxy (avoid CORS)
      url = `/api${endpoint}`;
    }
  console.log(url)
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control for server components
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Discovery & Search
  async searchEtfs(query: string): Promise<SearchResult[]> {
    return this.fetch<SearchResult[]>(`/etf/search/${encodeURIComponent(query)}`);
  }

  async getFeaturedEtfs(): Promise<EtfQuote[]> {
    return this.fetch<EtfQuote[]>("/etf/discover/featured");
  }

  // Core Data
  async getEtfInfo(symbol: string): Promise<EtfInfo> {
    return this.fetch<EtfInfo>(`/etf/${symbol}`);
  }

  async getEtfPrice(symbol: string): Promise<EtfPrice> {
    return this.fetch<EtfPrice>(`/etf/${symbol}/price`);
  }

  // History
  async getDailyHistory(
    symbol: string,
    params?: {
      interval?: string;
      range?: string;
      from?: string;
      to?: string;
    }
  ): Promise<HistoryData> {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.fetch<HistoryData>(`/etf/${symbol}/history/daily${queryString}`);
  }

  async getIntradayHistory(
    symbol: string,
    params?: {
      interval?: string;
      from?: string;
      to?: string;
    }
  ): Promise<HistoryData> {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.fetch<HistoryData>(`/etf/${symbol}/history/intraday${queryString}`);
  }

  // Insights
  async getHoldings(symbol: string): Promise<Holdings> {
    return this.fetch<Holdings>(`/etf/${symbol}/holdings`);
  }

  async getInsights(symbol: string): Promise<Insights> {
    return this.fetch<Insights>(`/etf/${symbol}/insights`);
  }

  async getNews(symbol: string): Promise<NewsArticle[]> {
    return this.fetch<NewsArticle[]>(`/etf/${symbol}/news`);
  }

  async getRecommendations(symbol: string): Promise<Recommendation[]> {
    return this.fetch<Recommendation[]>(`/etf/${symbol}/recommendations`);
  }

  async getDividends(symbol: string): Promise<Dividend[]> {
    return this.fetch<Dividend[]>(`/etf/${symbol}/dividends`);
  }

  // Full Report
  async getFullReport(symbol: string): Promise<FullReport> {
    return this.fetch<FullReport>(`/etf/${symbol}/report`);
  }

  // Sparkline for mini charts
  async getSparkline(
    symbol: string,
    params?: {
      period?: string;
      points?: number;
    }
  ): Promise<SparklineData> {
    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";
    return this.fetch<SparklineData>(`/etf/${symbol}/sparkline${queryString}`);
  }
}

// Singleton instance
export const etfApi = new EtfApiService();
