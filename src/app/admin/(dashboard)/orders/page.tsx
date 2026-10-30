
import { requireAdmin } from "@/lib/admin/auth";
import { OrdersTable } from "@/components/admin/orders-table";
import { PageHeader } from "@/components/admin/page-header";

export default async function OrdersPage() {
  const { supabase } = await requireAdmin();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_id, customer_name, email, phone, total_amount, status, created_at, order_items(id, artwork_id, artwork_title, quantity, price)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-7">
      <PageHeader
        title="Orders"
        description="Review customer inquiries and keep fulfilment status up to date."
      />
      <OrdersTable orders={orders || []} />
    </div>
  );
}