import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/lib/react-query/providers";
import { ErrorBoundary } from "@/components/error/error-boundary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
          <Navbar />
          <main>{children}</main>
        </div>
      </ErrorBoundary>
    </Providers>
  );
}
