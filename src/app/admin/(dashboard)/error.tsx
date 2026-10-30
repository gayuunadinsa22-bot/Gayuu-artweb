"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Friendly replacement for the generic Next.js error screen inside the
 * admin dashboard. Data-shape problems (empty tables, missing columns)
 * are handled by each page, so this is only a last-resort safety net.
 */
export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Admin dashboard error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-red-200 bg-white p-8 text-center">
      <AlertCircle className="mx-auto size-6 text-red-600" strokeWidth={1.6} />
      <h2 className="font-serif text-2xl text-ink">This section could not be loaded</h2>
      <p className="text-sm text-muted">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <p className="text-xs text-faint">
        If the message mentions a missing table or column, run the SQL files in
        <code className="mx-1 rounded bg-cream px-1 py-0.5">supabase/migrations</code>
        in the Supabase SQL editor, then try again.
      </p>
      <Button type="button" variant="subtle" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
