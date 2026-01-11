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
} from "@/types/etf.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class EtfApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

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
}

// Singleton instance
export const etfApi = new EtfApiService();
