import { etfApi } from "@/lib/api/etf-api";
import { EtfCard } from "@/components/etf/etf-card";
import { EtfListItem } from "@/components/etf/etf-list-item";

async function FeaturedEtfs() {
  try {
    const etfs = await etfApi.getFeaturedEtfs();

    return (
      <>
        {/* Mobile: List view */}
        <div className="md:hidden space-y-2">
          {etfs.map((etf) => (
            <EtfListItem key={etf.symbol} etf={etf} />
          ))}
        </div>

        {/* Tablet and Desktop: Grid view */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {etfs.map((etf) => (
            <EtfCard key={etf.symbol} etf={etf} />
          ))}
        </div>
      </>
    );
  } catch (error) {
    return (
      <div className="p-8 text-center border rounded-lg bg-red-50 dark:bg-red-900/20">
        <p className="text-red-900 dark:text-red-100 font-medium">Failed to load featured ETFs</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Make sure the FetchETF backend is running at http://localhost:3000
        </p>
      </div>
    );
  }
}

export default function HomePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Featured ETFs</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Explore popular and top-performing Exchange Traded Funds
        </p>
      </div>

      <FeaturedEtfs />
    </div>
  );
}
