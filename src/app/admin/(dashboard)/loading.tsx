import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-line bg-white p-5 shadow-admin"
          >
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="size-9 rounded-xl" />
            </div>
            <Skeleton className="mt-3 h-10 w-16" />
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white shadow-admin">
          <div className="flex items-center justify-between border-b border-line/70 p-5">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-7 w-16" />
          </div>
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white shadow-admin">
          <div className="flex items-center justify-between border-b border-line/70 p-5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-7 w-16" />
          </div>
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-7 w-14" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
