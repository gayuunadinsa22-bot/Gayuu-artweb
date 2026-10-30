/**
 * POST /api/orders — saves a customer's order inquiry.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { checkoutSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";

const lineSchema = z.object({
  slug: z.string().min(1).max(255),
  title: z.string().min(1).max(255),
  price: z.number().nonnegative(),
  quantity: z.number().int().min(1).max(99),
});

const orderSchema = z.object({
  clientOrderId: z.string().min(3).max(50),
  customer: checkoutSchema,
  lines: z.array(lineSchema).min(1).max(50),
  subtotal: z.number().nonnegative(),
});

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  let body: z.infer<typeof orderSchema>;
  try {
    body = orderSchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "Some order details were missing or invalid. Please review the form." },
      { status: 400 }
    );
  }

  const limit = checkRateLimit(`orders:${clientIp(request)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many order attempts. Please wait ${limit.retryAfterSec} seconds and try again.`,
      },
      { status: 429 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error: "Order saving is not set up on this site yet.",
      },
      { status: 503 }
    );
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Order saving is temporarily unavailable. Please try again." },
      { status: 503 }
    );
  }

  const slugs = [...new Set(body.lines.map((l) => l.slug))];
  const { data: artworks, error: artworksError } = await supabase
    .from("artworks")
    .select("id, slug, title, price, availability, max_quantity")
    .in("slug", slugs);

  if (artworksError) {
    return NextResponse.json(
      { ok: false, error: "Could not verify availability. Please try again." },
      { status: 500 }
    );
  }

  const bySlug = new Map((artworks ?? []).map((a) => [a.slug, a]));
  const problems: string[] = [];

  for (const line of body.lines) {
    const artwork = bySlug.get(line.slug);
    if (!artwork) {
      problems.push(`"${line.title}" is no longer available.`);
      continue;
    }
    if (artwork.availability === "sold") {
      problems.push(`"${artwork.title}" has already sold.`);
      continue;
    }
    const max = artwork.max_quantity ?? 1;
    if (line.quantity > max) {
      problems.push(
        max === 1
          ? `"${artwork.title}" is a one-of-one original (quantity 1).`
          : `"${artwork.title}" has at most ${max} available.`
      );
    }
  }

  if (problems.length > 0) {
    return NextResponse.json(
      { ok: false, error: problems.join(" "), problems },
      { status: 409 }
    );
  }

  const totalAmount = body.lines.reduce((sum, line) => {
    const artwork = bySlug.get(line.slug)!;
    return sum + Number(artwork.price) * line.quantity;
  }, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_id: body.clientOrderId,
      customer_name: body.customer.name,
      email: body.customer.email,
      phone: body.customer.phone,
      total_amount: totalAmount,
      shipping_address: {
        address: body.customer.address,
        city: body.customer.city,
        district: body.customer.district,
        postalCode: body.customer.postalCode,
      },
      order_notes: body.customer.orderNotes ?? null,
      status: "new",
    })
    .select("id, order_id")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { ok: false, error: "We could not save your order. Please try again." },
      { status: 500 }
    );
  }

  const itemRows = body.lines.map((line) => {
    const artwork = bySlug.get(line.slug)!;
    return {
      order_id: order.id,
      artwork_id: artwork.id,
      artwork_title: artwork.title,
      price: Number(artwork.price),
      quantity: line.quantity,
    };
  });

  const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json(
      { ok: false, error: "We could not save your order. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    orderId: order.order_id,
    total: totalAmount,
  });
}
