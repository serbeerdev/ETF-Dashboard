import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/lib/react-query/providers";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>{children}</main>
      </div>
    </Providers>
  );
}
