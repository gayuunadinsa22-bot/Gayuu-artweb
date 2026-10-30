"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "./auth";

/** Cache tags used by the storefront data layer (`"use cache"` fns). */
const STOREFRONT_TAGS = [
  "artworks",
  "settings",
  "homepage",
  "about",
  "gallery",
  "commissions",
  "testimonials",
] as const;

/**
 * Invalidates every storefront cache entry after an admin mutation so
 * public pages show the change immediately. Call from any admin form
 * after a successful save.
 */
export async function revalidateStorefront(): Promise<void> {
  for (const tag of STOREFRONT_TAGS) {
    updateTag(tag);
  }
  revalidatePath("/", "layout");
}

/**
 * Deletes an artwork plus its image records (and best-effort storage
 * files). Verifies the caller's admin session server-side; RLS applies
 * a second check inside the database.
 */
export async function deleteArtwork(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "Missing artwork id." };

  const { supabase } = await requireAdmin();

  // Collect storage paths so the files can be cleaned up too.
  const { data: images } = await supabase
    .from("artwork_images")
    .select("image_url")
    .eq("artwork_id", id);

  const { error: deleteError } = await supabase
    .from("artworks")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { ok: false, error: deleteError.message };
  }

  // Best-effort storage cleanup — the rows are already gone.
  const storagePaths = (images ?? [])
    .map((img) => {
      const marker = "/object/public/artwork-images/";
      const idx = img.image_url?.indexOf?.(marker) ?? -1;
      return idx === -1 ? null : decodeURIComponent(img.image_url.slice(idx + marker.length));
    })
    .filter((p): p is string => Boolean(p));

  if (storagePaths.length > 0) {
    await supabase.storage.from("artwork-images").remove(storagePaths);
  }

  await revalidateStorefront();
  return { ok: true };
}
