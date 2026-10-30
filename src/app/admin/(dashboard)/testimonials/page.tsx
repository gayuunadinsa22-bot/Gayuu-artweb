import { TestimonialsForm } from "@/components/admin/testimonials-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/auth";

export default async function TestimonialsPage() {
  const { supabase } = await requireAdmin();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, customer_name, review, visible")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-7">
      <PageHeader
        title="Testimonials"
        description="Publish kind words from collectors on the storefront."
      />
      <TestimonialsForm testimonials={testimonials || []} />
    </div>
  );
}