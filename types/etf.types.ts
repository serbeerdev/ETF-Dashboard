// ETF Quote/Price (from Yahoo Finance via FetchETF)
export interface EtfQuote {
  symbol: string;
  shortName: string;
  longName?: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  marketCap?: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketPreviousClose: number;
  regularMarketOpen: number;
  currency: string;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
}

// Mapeo a nuestro formato simplificado
export interface EtfPriceSimple {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  dayHigh: number;
  dayLow: number;
  previousClose: number;
  open: number;
  currency: string;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
}

// ETF Info (from FetchETF/Yahoo Finance)
export interface EtfInfo {
  fundProfile: {
    family?: string;
    categoryName?: string;
    legalType?: string;
    feesExpensesInvestment?: {
      annualReportExpenseRatio?: number;
      annualHoldingsTurnover?: number;
      totalNetAssets?: number;
    };
    managementInfo?: {
      managerName?: string;
      managerBio?: string;
    };
  };
  summaryProfile: {
    longBusinessSummary?: string;
    sector?: string;
    industry?: string;
    website?: string;
    address1?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phone?: string;
    companyOfficers?: any[];
    executiveTeam?: any[];
  };
  price: EtfQuote;
}

// History Data
export interface HistoryData {
  meta: {
    currency: string;
    symbol: string;
    exchangeName: string;
    instrumentType: string;
    firstTradeDate: string;
    dataGranularity: string;
    range: string;
  };
  timestamps: number[];
  indicators: {
    quote: Array<{
      open: number[];
      high: number[];
      low: number[];
      close: number[];
      volume: number[];
    }>;
    adjclose?: Array<{
      adjclose: number[];
    }>;
  };
}

// Holdings
export interface Holding {
  symbol: string;
  name: string;
  shares?: number;
  weight: number;
  value?: number;
}

export interface Holdings {
  topHoldings: Holding[];
  sectorAllocation: Array<{ sector: string; weight: number; value?: number }>;
  performance: {
    ytd: number;
    oneYear: number;
    threeYear?: number;
    fiveYear?: number;
  };
}

// Insights
export interface Insights {
  technicalSignals: {
    trend: "bullish" | "bearish" | "neutral";
    strength?: number;
    signals: string[];
  };
  supportResistance?: {
    support1: number;
    support2?: number;
    support3?: number;
    resistance1: number;
    resistance2?: number;
    resistance3?: number;
  };
  movingAverages?: {
    sma20?: number;
    sma50?: number;
    sma200?: number;
    ema12?: number;
    ema26?: number;
  };
}

// News
export interface NewsArticle {
  uuid: string;
  title: string;
  publisher: string;
  link: string;
  providerPublishTime: number;
  type: string;
  thumbnail?: {
    resolutions: Array<{ url: string; width: number; height: number }>;
  };
}

// Recommendations
export interface Recommendation {
  symbol: string;
  name: string;
  score?: number;
  reason?: string;
}

// Dividends
export interface Dividend {
  date: string;
  amount: number;
  frequency?: "monthly" | "quarterly" | "annual";
}

// Search Result
export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type?: string;
  matchScore?: number;
}

// Full Report
export interface FullReport {
  symbol: string;
  generatedAt: string;
  details: EtfInfo;
  price: EtfPrice;
  news: NewsArticle[];
  holdings: Holdings;
  insights: Insights;
  recommendations: Recommendation[];
}

// ETF Price extended
export interface EtfPrice extends EtfQuote {
  lastPrice?: number;
  bid?: number;
  ask?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
}
