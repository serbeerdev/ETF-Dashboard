import { Skeleton } from "@/components/ui/skeleton";

export default function EtfPageLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      {/* Price Section */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Key Metrics Grid */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>

      {/* Fund Family */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-40 mb-1" />
        <Skeleton className="h-3 w-32" />
      </div>

      {/* About Section */}
      <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
        <Skeleton className="h-8 w-48 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-5 w-32 mt-4" />
      </div>
    </div>
  );
}
