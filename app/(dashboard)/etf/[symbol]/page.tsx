import { notFound } from "next/navigation";
import { etfApi } from "@/lib/api/etf-api";
import { EtfHeader } from "@/components/etf/etf-header";
import { MetricCard } from "@/components/etf/metric-card";
import { EtfChartSection } from "@/components/chart/etf-chart-section";
import { transformQuote, formatPercent, formatNumber } from "@/lib/utils";

export default async function EtfPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;

  try {
    const info = await etfApi.getEtfInfo(symbol);
    const price = transformQuote(info.price);

    return (
      <div className="container mx-auto py-6 space-y-6">
        <EtfHeader symbol={symbol} info={info} />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {info.fundProfile.feesExpensesInvestment?.annualReportExpenseRatio && (
            <MetricCard
              title="Expense Ratio"
              value={`${(info.fundProfile.feesExpensesInvestment.annualReportExpenseRatio * 100).toFixed(2)}%`}
              description="Annual fund expense"
            />
          )}
          {info.fundProfile.feesExpensesInvestment?.totalNetAssets && (
            <MetricCard
              title="Assets"
              value={`$${formatNumber(info.fundProfile.feesExpensesInvestment.totalNetAssets)}M`}
              description="Total net assets"
            />
          )}
          <MetricCard
            title="Category"
            value={info.fundProfile.categoryName || "N/A"}
            description="Fund category"
          />
          <MetricCard
            title="Legal Type"
            value={info.fundProfile.legalType || "ETF"}
            description="Fund type"
          />
        </div>

        {/* Price Chart */}
        <EtfChartSection symbol={symbol} />

        {/* Fund Information */}
        {info.fundProfile.family && (
          <MetricCard
            title="Fund Family"
            value={info.fundProfile.family}
            description="Fund provider"
          />
        )}

        {/* Business Summary */}
        {info.summaryProfile.longBusinessSummary && (
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-3">About {symbol}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {info.summaryProfile.longBusinessSummary}
            </p>
            {info.summaryProfile.website && (
              <a
                href={info.summaryProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Visit website →
              </a>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error(`Failed to load ETF ${symbol}:`, error);
    notFound();
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;

  try {
    const info = await etfApi.getEtfInfo(symbol);
    const price = transformQuote(info.price);
    const summary = info.summaryProfile.longBusinessSummary || "";
    const truncatedSummary = summary.slice(0, 100);

    return {
      title: `${symbol} - ${price.name} | ETF Dashboard`,
      description: truncatedSummary,
    };
  } catch {
    return {
      title: `${symbol} | ETF Dashboard`,
      description: `View detailed information about ${symbol} ETF`,
    };
  }
}
