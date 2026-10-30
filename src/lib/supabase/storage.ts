import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Helpers for the public `site-media` bucket.
 *
 * Uploads use the signed-in admin's access token — never the service
 * role key. RLS on `storage.objects` is the security boundary: only
 * allow-listed admins can insert, update or delete files.
 */

export const SITE_MEDIA_BUCKET = "site-media";
export const SITE_MEDIA_MAX_BYTES = 10 * 1024 * 1024;
export const SITE_MEDIA_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const SITE_MEDIA_ACCEPT = SITE_MEDIA_MIME_TYPES.join(",");
export const SITE_MEDIA_MAX_LABEL = "10 MB";

/** Returns a human-readable validation error, or `null` when valid. */
export function validateSiteMediaFile(file: File): string | null {
  if (!SITE_MEDIA_MIME_TYPES.includes(file.type as (typeof SITE_MEDIA_MIME_TYPES)[number])) {
    return "Please choose a JPG, PNG or WEBP image.";
  }
  if (file.size > SITE_MEDIA_MAX_BYTES) {
    return `That image is too large. Please keep it under ${SITE_MEDIA_MAX_LABEL}.`;
  }
  if (file.size === 0) {
    return "That image file appears to be empty.";
  }
  return null;
}

function extensionFor(file: File): string {
  switch (file.type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

/** Unique, URL-safe storage path, e.g. `homepage/hero/1712345-uuid.jpg`. */
export function createSiteMediaPath(file: File, folder = "homepage"): string {
  const safeFolder = folder.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9/_-]/gi, "-");
  const unique =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${safeFolder}/${Date.now()}-${unique}.${extensionFor(file)}`;
}

function encodeStoragePath(path: string): string {
  return path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
}

interface ProgressUploadOptions {
  url: string;
  file: File;
  token: string;
  anonKey: string;
  onProgress: (percent: number) => void;
}

/**
 * Multipart XHR upload matching the Supabase Storage REST API. Using
 * XHR (rather than fetch) is what makes real upload progress possible.
 */
function uploadWithProgress({
  url,
  file,
  token,
  anonKey,
  onProgress,
}: ProgressUploadOptions): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const form = new FormData();
    form.append("cacheControl", "31536000");
    form.append("", file, file.name);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("apikey", anonKey);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("x-upsert", "false");

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress(
          Math.min(99, Math.max(1, Math.round((event.loaded / event.total) * 100))),
        );
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
        return;
      }

      let message = `Upload failed (${xhr.status}).`;
      try {
        const body = JSON.parse(xhr.responseText) as {
          message?: string;
          error?: string;
        };
        message = body.message || body.error || message;
      } catch {
        // Keep the generic status message when the body isn't JSON.
      }
      reject(new Error(message));
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error while uploading the image."));
    });
    xhr.addEventListener("abort", () => {
      reject(new Error("Image upload was cancelled."));
    });

    xhr.send(form);
  });
}

export interface UploadedSiteMedia {
  path: string;
  publicUrl: string;
}

/**
 * Uploads one image to `site-media` and returns its path + public URL.
 * Throws (and never returns a partial URL) when validation, auth or the
 * storage request fails.
 */
export async function uploadSiteMedia(
  supabase: SupabaseClient,
  file: File,
  options: {
    folder?: string;
    onProgress?: (percent: number) => void;
  } = {},
): Promise<UploadedSiteMedia> {
  const validationError = validateSiteMediaFile(file);
  if (validationError) throw new Error(validationError);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase storage is not configured.");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Your admin session has expired. Please sign in again.");
  }

  const path = createSiteMediaPath(file, options.folder ?? "homepage");
  const url = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${SITE_MEDIA_BUCKET}/${encodeStoragePath(path)}`;

  await uploadWithProgress({
    url,
    file,
    token: session.access_token,
    anonKey,
    onProgress: options.onProgress ?? (() => {}),
  });

  const { data } = supabase.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

/** Extracts a `site-media` object path from a public URL. */
export function siteMediaPathFromUrl(value: string): string | null {
  const marker = `/storage/v1/object/public/${SITE_MEDIA_BUCKET}/`;
  const index = value.indexOf(marker);
  if (index === -1) return null;

  const raw = value.slice(index + marker.length).split("?")[0];
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** Removes specific object paths (best-effort cleanup). */
export async function removeSiteMediaPaths(
  supabase: SupabaseClient,
  paths: string[],
): Promise<void> {
  const clean = Array.from(new Set(paths.map((path) => path.trim()).filter(Boolean)));
  if (clean.length === 0) return;
  await supabase.storage.from(SITE_MEDIA_BUCKET).remove(clean);
}

/**
 * Deletes a previously uploaded image when its public URL belongs to the
 * `site-media` bucket. Local placeholder paths are ignored.
 */
export async function deleteSiteMedia(
  supabase: SupabaseClient,
  url: string,
): Promise<void> {
  const path = siteMediaPathFromUrl(url);
  if (!path) return;
  await removeSiteMediaPaths(supabase, [path]);
}
