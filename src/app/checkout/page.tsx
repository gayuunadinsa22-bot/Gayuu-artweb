import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout — Order Inquiry",
  description:
    "Send your artwork order to the studio via WhatsApp. Availability, delivery and payment are confirmed personally by the artist.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
