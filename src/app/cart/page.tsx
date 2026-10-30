import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review the artworks in your shopping bag before sending your order inquiry.",
};

export default function CartPage() {
  return <CartView />;
}
