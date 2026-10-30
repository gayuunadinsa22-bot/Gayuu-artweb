/**
 * Current year for copyright lines.
 *
 * Deliberately lives in its own module rather than `lib/settings.ts`:
 * `settings.ts` is imported by the admin layout (via `admin-header.tsx`), and
 * evaluating `new Date()` while prerendering admin routes makes Next.js raise
 * `blocking-prerender-current-time`. Keeping this module import-scoped to the
 * storefront footer keeps it out of the admin module graph.
 *
 * It must stay module-scope. Moving the call into a component body (client or
 * server) makes it a render-time value, which fails `next build` outright.
 */
export const currentYear = new Date().getFullYear();
