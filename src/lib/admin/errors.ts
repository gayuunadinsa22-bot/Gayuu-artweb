/**
 * Translates low-level Supabase/PostgREST errors into actionable admin
 * messages. In particular, a production database that has not had the
 * additive image migrations applied reports cryptic "column … does not
 * exist" / "schema cache" errors — the artist should be told exactly
 * which SQL file to run.
 */

const MISSING_COLUMN =
  /could not find the .*column|column .* does not exist|schema cache|pgrst204/i;
const MISSING_TABLE = /relation .* does not exist/i;
const MISSING_BUCKET = /bucket not found|bucket .* does not exist/i;

function messageOf(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const value = (error as { message?: unknown }).message;
    if (typeof value === "string") return value;
  }
  return "";
}

/** True when the error means a column/table in the code is not in the DB. */
export function isMissingColumnError(error: unknown): boolean {
  const message = messageOf(error);
  return message !== "" && (MISSING_COLUMN.test(message) || MISSING_TABLE.test(message));
}

/** True when the public storage bucket has not been created yet. */
export function isMissingBucketError(error: unknown): boolean {
  const message = messageOf(error);
  return message !== "" && MISSING_BUCKET.test(message);
}

export function describeAdminError(
  error: unknown,
  options: { migration?: string } = {},
): string {
  const message =
    messageOf(error) || "Something went wrong. Please try again.";

  if (isMissingBucketError(error)) {
    return `The "site-media" storage bucket is missing. Run supabase/migrations/20240101000005_site_media_bucket.sql in the Supabase SQL editor, then try again.`;
  }

  if (MISSING_TABLE.test(message)) {
    return `The database schema is not initialised. Run supabase/migrations/20240101000001_initial_schema.sql and the RLS policies, then reload this page. (${message})`;
  }

  if (options.migration && isMissingColumnError(error)) {
    return `The database is missing a required column. Run supabase/migrations/${options.migration} in the Supabase SQL editor, then try again. (${message})`;
  }

  return message;
}
