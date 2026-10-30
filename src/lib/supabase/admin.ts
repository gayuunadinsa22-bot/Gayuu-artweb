import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from './config';

/**
 * Service-role server client — bypasses RLS. MUST only ever be imported
 * by server code (route handlers, server actions, scripts); never bundle
 * it for the browser. Returns `null` when Supabase isn't configured so
 * callers can degrade honestly.
 */
export function createAdminClient() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
