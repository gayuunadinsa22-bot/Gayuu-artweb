import { createBrowserClient } from '@supabase/ssr';
import { isSupabaseConfigured } from './config';

/**
 * Browser client for the admin dashboard.
 *
 * The admin UI only renders once middleware has verified Supabase is
 * configured and a session exists; if it is used while Supabase is not
 * configured we fail loudly instead of silently corrupting state.
 * The login page checks `isSupabaseConfigured()` first and shows setup
 * instructions instead of rendering the form.
 */
export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example).',
    );
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
