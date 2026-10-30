"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/admin/toast";
import {
  SITE_MEDIA_ACCEPT,
  SITE_MEDIA_MAX_LABEL,
  uploadSiteMedia,
  validateSiteMediaFile,
} from "@/lib/supabase/storage";
import { resolveMediaUrl } from "@/lib/site-images";
import { describeAdminError } from "@/lib/admin/errors";

interface ImageUploadFieldProps {
  label: string;
  description?: string;
  value: string;
  fallback: string;
  ratio?: string;
  folder?: string;
  onChange: (url: string) => void;
  onUploaded?: (url: string) => void;
}

export function ImageUploadField({
  label,
  description,
  value,
  fallback,
  ratio = "aspect-square",
  folder = "homepage",
  onChange,
  onUploaded,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const displayUrl = resolveMediaUrl(value, fallback);

  const handleFile = async (file: File) => {
    setError(null);
    const validationError = validateSiteMediaFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setProgress(1);
    try {
      const uploaded = await uploadSiteMedia(supabase, file, {
        folder,
        onProgress: setProgress,
      });
      onChange(uploaded.publicUrl);
      onUploaded?.(uploaded.publicUrl);
      toast({
        title: "Image uploaded",
        description: "Click Save to publish the new image on the website.",
        variant: "success",
      });
    } catch (err) {
      console.error("Image upload failed:", err);
      const message = describeAdminError(err);
      setError(message);
      toast({
        title: "Image upload failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (uploading) return;
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const clearImage = () => {
    if (uploading) return;
    onChange("");
    setError(null);
  };

  return (
    <div className="space-y-3 rounded-xl border border-line bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <Label className="text-base font-medium">{label}</Label>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
        {value?.trim() && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearImage}
            disabled={uploading}
            className="text-muted hover:text-ink"
          >
            <X className="size-4" strokeWidth={1.6} />
            Use default image
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-[220px_1fr] sm:items-start">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-faint">
            Preview
          </p>
          <div className={`relative overflow-hidden rounded-xl border border-line bg-cream ${ratio}`}>
            <Image
              src={displayUrl}
              alt={`${label} preview`}
              fill
              sizes="220px"
              className="object-cover"
              unoptimized={displayUrl.startsWith("http")}
            />
          </div>
          <p className="text-xs text-faint">
            {value?.trim() ? "Using uploaded image" : "Using default placeholder"}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-faint">
            Upload replacement
          </p>
          <label
            htmlFor={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`group flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line-strong/70 bg-ivory/40 p-6 text-center transition-colors hover:border-rose/70 hover:bg-rose-soft/30 ${
              uploading ? "pointer-events-none opacity-70" : ""
            }`}
          >
            <input
              ref={inputRef}
              id={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
              type="file"
              accept={SITE_MEDIA_ACCEPT}
              onChange={handleInputChange}
              className="sr-only"
              disabled={uploading}
            />
            <span className="grid size-11 place-items-center rounded-full bg-white text-[#b06975] ring-1 ring-line">
              {uploading ? (
                <Loader2 className="size-5 animate-spin" strokeWidth={1.5} />
              ) : (
                <Upload className="size-5" strokeWidth={1.5} />
              )}
            </span>
            <span className="text-sm font-medium text-ink">
              {uploading ? `Uploading… ${progress}%` : "Click to upload or drag and drop"}
            </span>
            <span className="text-xs text-faint">JPG, PNG or WEBP · max {SITE_MEDIA_MAX_LABEL}</span>
            {uploading && (
              <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-line">
                <div
                  className="h-full bg-[#b06975] transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </label>
          {error && (
            <p className="text-xs font-medium text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
