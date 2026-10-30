import Link from "next/link";
import {
  Plus,
  Palette,
  Eye,
  Settings,
  Star,
  ShoppingBag,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/auth";
import { formatCurrency } from "@/lib/utils";

function orderStatusVariant(status: string) {
  switch (status) {
    case "completed":
      return "success" as const;
    case "confirmed":
      return "info" as const;
    case "contacted":
      return "warning" as const;
    case "cancelled":
      return "danger" as const;
    default:
      return "muted" as const;
  }
}

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const [
    { count: totalArtworks },
    { count: availableArtworks },
    { count: soldArtworks },
    { count: featuredArtworks },
    { count: totalOrders },
    { data: recentOrders },
    { data: recentArtworks },
  ] = await Promise.all([
    supabase.from("artworks").select("id", { count: "exact", head: true }),
    supabase.from("artworks").select("id", { count: "exact", head: true }).eq("availability", "available"),
    supabase.from("artworks").select("id", { count: "exact", head: true }).eq("availability", "sold"),
    supabase.from("artworks").select("id", { count: "exact", head: true }).eq("featured", true),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id, customer_name, order_id, total_amount, status").order("created_at", { ascending: false }).limit(5),
    supabase.from("artworks").select("id, title, price, category").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { title: "Total Paintings", value: totalArtworks || 0, icon: Palette, tone: "bg-rose-soft text-[#b06975]" },
    { title: "Available", value: availableArtworks || 0, icon: Eye, tone: "bg-[#eef2ec] text-[#5b7054]" },
    { title: "Sold Out", value: soldArtworks || 0, icon: ShoppingBag, tone: "bg-cream text-muted" },
    { title: "Featured", value: featuredArtworks || 0, icon: Star, tone: "bg-[#f0edfb] text-[#675d94]" },
    { title: "Total Orders", value: totalOrders || 0, icon: Clock, tone: "bg-[#eef0f7] text-[#4f5b82]" },
  ];

  return (
    <div className="space-y-7">
      <PageHeader
        title="Dashboard"
        description="A calm overview of your studio — collections, orders and recent activity."
        actions={
          <>
            <Button asChild>
              <Link href="/admin/artworks/new" prefetch={true}>
                <Plus className="size-4" strokeWidth={1.75} />
                Add New Painting
              </Link>
            </Button>
            <Button asChild variant="subtle">
              <Link href="/admin/homepage" prefetch={true}>
                <Settings className="size-4" strokeWidth={1.6} />
                Edit Homepage
              </Link>
            </Button>
            <Button asChild variant="subtle">
              <Link href="/" target="_blank" rel="noreferrer">
                <Eye className="size-4" strokeWidth={1.6} />
                View Website
              </Link>
            </Button>
          </>
        }
      />

      <section aria-label="Studio statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-line bg-white p-5 shadow-admin transition-shadow duration-300 hover:shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
                {stat.title}
              </p>
              <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${stat.tone}`}>
                <stat.icon className="size-4" strokeWidth={1.6} aria-hidden />
              </span>
            </div>
            <p className="mt-3 font-serif text-4xl leading-none tracking-tight text-ink">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>Recent Orders</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-muted hover:text-ink">
              <Link href="/admin/orders" prefetch={true}>
                View all
                <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <ul className="divide-y divide-line/70">
                {recentOrders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {order.customer_name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {order.order_id} · {formatCurrency(Number(order.total_amount))}
                      </p>
                    </div>
                    <Badge variant={orderStatusVariant(order.status)} className="shrink-0 capitalize">
                      {order.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <ShoppingBag className="size-6 text-faint" strokeWidth={1.4} aria-hidden />
                <p className="text-sm text-muted">No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>Recently Added Paintings</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-muted hover:text-ink">
              <Link href="/admin/artworks" prefetch={true}>
                View all
                <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentArtworks && recentArtworks.length > 0 ? (
              <ul className="divide-y divide-line/70">
                {recentArtworks.map((artwork) => (
                  <li
                    key={artwork.id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {artwork.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {formatCurrency(Number(artwork.price))} · {artwork.category}
                      </p>
                    </div>
                    <Button asChild variant="subtle" size="sm" className="shrink-0">
                      <Link href={`/admin/artworks/${artwork.id}/edit`} prefetch={true}>Edit</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Palette className="size-6 text-faint" strokeWidth={1.4} aria-hidden />
                <p className="text-sm text-muted">No paintings yet</p>
                <Button asChild size="sm" className="mt-1">
                  <Link href="/admin/artworks/new">
                    <Plus className="size-3.5" strokeWidth={1.75} />
                    Add your first painting
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
