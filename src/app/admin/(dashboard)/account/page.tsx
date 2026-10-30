
import { AccountForm } from "@/components/admin/account-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AccountPage() {
  const { user } = await requireAdmin();

  return (
    <div className="space-y-7">
      <PageHeader
        title="Account Settings"
        description="Your sign-in email and admin password."
      />
      <AccountForm user={user} />
    </div>
  );
}