import { requireAdmin } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { ToastProvider } from "@/components/admin/toast";
import { getSiteSettings } from "@/lib/data/storefront";

/**
 * The admin dashboard is session-scoped (reads the auth cookie + role on
 * every request) and must never be prerendered. `instant = false` opts
 * this route out of static prerendering under `cacheComponents`.
 */
export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ user }, settings] = await Promise.all([
    requireAdmin(),
    getSiteSettings(),
  ]);

  return (
    <ToastProvider>
      <AdminShell userEmail={user.email} brandName={settings.brandName}>
        {children}
      </AdminShell>
    </ToastProvider>
  );
}
