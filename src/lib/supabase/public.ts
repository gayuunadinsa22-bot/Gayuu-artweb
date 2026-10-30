import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./config";

/**
 * Cookie-less anon client for reading public storefront content from
 * server components and cached data functions.
 *
 * Never use this (or the service-role key) to write — public visitors
 * cannot write anything; RLS enforces that.
 *
 * Returns `null` when Supabase isn't configured so callers can fall
 * back to the local content that ships with the site.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null;

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );
}
