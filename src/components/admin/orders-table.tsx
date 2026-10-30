"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/admin/toast";
import { ShoppingBag, Loader2 } from "lucide-react";

const statuses = ["new", "contacted", "confirmed", "completed", "cancelled"];

function statusVariant(status: string) {
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

interface OrderItem {
  id: string;
  artwork_title: string;
  quantity: number;
}

interface OrderRow {
  id: string;
  order_id: string;
  customer_name: string;
  email: string;
  phone: string;
  total_amount: number | string;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

export function OrdersTable({ orders: initialOrders }: { orders: OrderRow[] }) {
  const [orders, setOrders] = useState<OrderRow[]>(initialOrders);
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const updateStatus = async (orderId: string, status: string) => {
    setLoading(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev: OrderRow[]) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      toast({ title: `Order marked ${status}`, variant: "success" });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Could not update order status",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-rose-soft text-[#b06975]">
              <ShoppingBag className="size-6" strokeWidth={1.4} />
            </span>
            <p className="font-serif text-xl text-ink">No orders yet</p>
            <p className="text-sm text-muted">
              New customer inquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="border-b border-line bg-cream/50">
                <tr>
                  <th scope="col" className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">Order</th>
                  <th scope="col" className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">Customer</th>
                  <th scope="col" className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">Items</th>
                  <th scope="col" className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">Total</th>
                  <th scope="col" className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">Status</th>
                  <th scope="col" className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">Date</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {orders.map((order) => (
                  <tr key={order.id} className="align-top transition-colors hover:bg-ivory/70">
                    <td className="whitespace-nowrap px-5 py-4 text-xs font-mono text-ink">
                      {order.order_id}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-ink">{order.customer_name}</p>
                      <p className="mt-0.5 text-xs text-muted">{order.email}</p>
                      <p className="text-xs text-muted">{order.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-ink">
                      {order.order_items && order.order_items.length > 0 ? (
                        <ul className="space-y-1">
                          {order.order_items.map((item) => (
                            <li key={item.id} className="text-sm">
                              {item.artwork_title}
                              <span className="text-muted"> × {item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium tabular-nums text-ink">
                      {formatCurrency(Number(order.total_amount))}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Badge variant={statusVariant(order.status)} className="capitalize">
                        {order.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-muted">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateStatus(order.id, value)}
                          disabled={loading === order.id}
                        >
                          <SelectTrigger
                            variant="admin"
                            className="h-9 w-[152px] text-sm"
                            aria-label={`Update status for ${order.order_id}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status} value={status} className="capitalize">
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {loading === order.id && (
                          <Loader2 className="mt-2.5 ml-2 size-4 animate-spin text-muted" aria-hidden />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
