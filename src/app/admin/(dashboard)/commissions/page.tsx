
import { CommissionsForm } from "@/components/admin/commissions-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/auth";

export default async function CommissionsPage() {
  const { supabase } = await requireAdmin();
  const { data: commissionTypes } = await supabase
    .from("commission_types")
    .select("id, name, description, starting_price, available");

  return (
    <div className="space-y-7">
      <PageHeader
        title="Commissions Management"
        description="Manage the commission types and starting prices you offer."
      />
      <CommissionsForm commissionTypes={commissionTypes || []} />
    </div>
  );
}