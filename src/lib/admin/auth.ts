import { redirect } from "next/navigation";
import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createServerClientSSR } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Server-side authorization guard for admin server components, server
 * actions and route handlers.
 *
 * - Supabase not configured → login page (shows setup instructions)
 * - No session → login page
 * - Signed in but not on the admin allow-list → public homepage
 *
 * Returns the authenticated user and a session-aware Supabase client
 * whose queries run under the caller's session (RLS applies).
 * Deduplicated per request so layout and page don't repeat auth checks.
 */
const requireAdminRequest = cache(async (): Promise<{
  user: User;
  supabase: Awaited<ReturnType<typeof createServerClientSSR>>;
}> => {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?setup=required");
  }

  const supabase = await createServerClientSSR();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRole } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!adminRole) {
    redirect("/");
  }

  return { user, supabase };
});

export async function requireAdmin(): Promise<{
  user: User;
  supabase: Awaited<ReturnType<typeof createServerClientSSR>>;
}> {
  return requireAdminRequest();
}
