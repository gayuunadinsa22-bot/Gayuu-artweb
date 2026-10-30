"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/admin/toast";
import { revalidateStorefront } from "@/lib/admin/actions";
import Image from "next/image";

/**
 * `<input type="number">` submits strings, so every numeric field must be
 * coerced — otherwise the resolver rejects the payload before `onSubmit`
 * ever runs and the form appears to do nothing.
 *
 * An empty input arrives as `""`, which `z.coerce.number()` would happily
 * turn into `0`. Mapping blank values to `NaN` makes them fail the check so
 * the field is genuinely required.
 */
const requiredNumber = (label: string, minimum = 0) =>
  z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? NaN : value),
    z.coerce.number({ message: `${label} is required` }).min(minimum, `${label} cannot be negative`),
  );

const optionalPositiveInt = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? null : value),
  z.coerce.number().int("Must be a whole number").positive("Must be more than 0").nullable(),
);

const artworkSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  price: requiredNumber("Price"),
  price_from: z.boolean().optional(),
  category: z.string().min(1, "Category is required"),
  dimensions: z.string().optional(),
  medium: z.string().optional(),
  materials: z.string().optional(),
  availability: z.enum(["available", "made-to-order", "sold"]),
  max_quantity: z.coerce
    .number({ message: "Max quantity is required" })
    .int("Must be a whole number")
    .min(1, "At least 1"),
  featured: z.boolean().optional(),
  is_new: z.boolean().optional(),
  edition_size: optionalPositiveInt,
  story: z.string().optional(),
  accent: z.string().optional(),
});

type ArtworkFormValues = z.infer<typeof artworkSchema>;

/** Module-scope helper so the React Compiler purity rule doesn't flag `Date.now()` inside the component. */
function timestamp(): number {
  return Date.now();
}

interface ArtworkImage {
  id: string;
  image_url: string;
  position: number;
  is_cover: boolean;
}

interface ArtworkRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  availability: string;
  [key: string]: unknown;
}

interface ArtworkFormProps {
  artwork?: ArtworkRow;
  artworkImages?: ArtworkImage[];
}

export function ArtworkForm({ artwork, artworkImages = [] }: ArtworkFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState(artworkImages);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  const isEditing = !!artwork;

  const form = useForm<ArtworkFormValues>({
    // zod v4 + resolvers v5: the input type of z.coerce fields is
    // `unknown`, so the resolver needs a cast to the output type.
    resolver: zodResolver(artworkSchema) as Resolver<ArtworkFormValues>,
    defaultValues: artwork
      ? ({
          ...artwork,
          price: Number(artwork.price),
          max_quantity: artwork.max_quantity ?? 1,
          edition_size: artwork.edition_size ?? null,
          price_from: artwork.price_from || false,
          featured: artwork.featured || false,
          is_new: artwork.is_new || false,
          materials: Array.isArray(artwork.materials)
            ? (artwork.materials as string[]).join(", ")
            : (artwork.materials as string) || "",
        } as unknown as Partial<ArtworkFormValues>)
      : {
          title: "",
          slug: "",
          category: "",
          availability: "available" as const,
          max_quantity: 1,
          edition_size: null,
          featured: false,
          is_new: false,
          price_from: false,
        },
  });

  const categoryValue = useWatch({ control: form.control, name: "category" });
  const availabilityValue = useWatch({
    control: form.control,
    name: "availability",
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string) => {
    if (!confirm("Remove this image?")) return;
    await supabase.from("artwork_images").delete().eq("id", imageId);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const uploadImages = async (artworkId: string, baseTime: number): Promise<string[]> => {
    if (images.length === 0) return [];

    setUploading(true);
    const failures: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${artworkId}-${baseTime}-${i}.${fileExt}`;
      const filePath = `artworks/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("artwork-images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        failures.push(`${file.name}: ${uploadError.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("artwork-images")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("artwork_images").insert({
        artwork_id: artworkId,
        image_url: urlData.publicUrl,
        position: existingImages.length + i + 1,
        is_cover: existingImages.length === 0 && i === 0,
      });

      if (insertError) {
        console.error("Image record error:", insertError);
        failures.push(`${file.name}: ${insertError.message}`);
      }
    }
    setUploading(false);
    return failures;
  };

  const onSubmit = async (values: ArtworkFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const materialsArray = values.materials
        ? values.materials.split(",").map((m) => m.trim()).filter(Boolean)
        : [];

      const artworkData = {
        ...values,
        materials: materialsArray,
        price_from: values.price_from || false,
        featured: values.featured || false,
        is_new: values.is_new || false,
        edition_size: values.edition_size ?? null,
      };

      let artworkId: string;

      if (isEditing) {
        const { error } = await supabase
          .from("artworks")
          .update(artworkData)
          .eq("id", artwork.id);
        if (error) throw error;
        artworkId = artwork.id;
      } else {
        const { data, error } = await supabase
          .from("artworks")
          .insert(artworkData)
          .select()
          .single();
        if (error) throw error;
        artworkId = data.id;
      }

      const failures = await uploadImages(artworkId, timestamp());

      // Bust the cached storefront queries so the new/updated artwork shows
      // up on /shop and the homepage right away instead of on the next
      // revalidation window.
      await revalidateStorefront();

      if (failures.length > 0) {
        toast({
          title: "Saved, but some images failed",
          description: failures.join("\n"),
          variant: "destructive",
        });
      } else {
        toast({
          title: isEditing ? "Artwork updated" : "Artwork created",
          variant: "success",
        });
      }
      router.push("/admin/artworks");
      router.refresh();
    } catch (error) {
      console.error("Error saving artwork:", error);
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : "Something went wrong while saving.";
      setError(message);
      toast({ title: "Error saving artwork", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
            >
              {error}
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...form.register("title", {
                  onChange: (e) => {
                    if (!isEditing) {
                      const slug = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "");
                      form.setValue("slug", slug, { shouldValidate: true, shouldDirty: true });
                    }
                  },
                })}
                inputVariant="admin"
                aria-invalid={!!form.formState.errors.title}
              />
              {form.formState.errors.title && (
                <p className="text-xs font-medium text-red-600" role="alert">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" {...form.register("slug")} inputVariant="admin" />
              {form.formState.errors.slug && (
                <p className="text-xs font-medium text-red-600" role="alert">{form.formState.errors.slug.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" {...form.register("tagline")} inputVariant="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} rows={4} inputVariant="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="story">Story</Label>
            <Textarea id="story" {...form.register("story")} rows={3} inputVariant="admin" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price (LKR) *</Label>
              <Input
                id="price"
                type="number"
                step="any"
                min="0"
                {...form.register("price")}
                inputVariant="admin"
              />
              {form.formState.errors.price && (
                <p className="text-xs font-medium text-red-600" role="alert">{form.formState.errors.price.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                onValueChange={(value) =>
                  form.setValue("category", value, { shouldValidate: true, shouldDirty: true })
                }
                value={categoryValue || undefined}
              >
                <SelectTrigger variant="admin">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original-paintings">Original Paintings</SelectItem>
                  <SelectItem value="sketches-drawings">Sketches & Drawings</SelectItem>
                  <SelectItem value="custom-portraits">Custom Portraits</SelectItem>
                  <SelectItem value="art-prints">Art Prints</SelectItem>
                  <SelectItem value="mini-artworks">Mini Artworks</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-xs font-medium text-red-600" role="alert">{form.formState.errors.category.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability">Availability *</Label>
              <Select
                onValueChange={(value) =>
                  form.setValue("availability", value as "available" | "made-to-order" | "sold", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                value={availabilityValue}
              >
                <SelectTrigger variant="admin">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="made-to-order">Made to Order</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.availability && (
                <p className="text-xs font-medium text-red-600" role="alert">{form.formState.errors.availability.message}</p>
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input id="dimensions" {...form.register("dimensions")} inputVariant="admin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medium">Medium</Label>
              <Input id="medium" {...form.register("medium")} inputVariant="admin" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="materials">Materials (comma-separated)</Label>
            <Input id="materials" {...form.register("materials")} inputVariant="admin" placeholder="e.g., Acrylic, Canvas, Varnish" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="max_quantity">Max Quantity</Label>
              <Input
                id="max_quantity"
                type="number"
                min="1"
                step="1"
                {...form.register("max_quantity")}
                inputVariant="admin"
              />
              {form.formState.errors.max_quantity && (
                <p className="text-xs font-medium text-red-600" role="alert">{form.formState.errors.max_quantity.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edition_size">Edition Size (for prints)</Label>
              <Input
                id="edition_size"
                type="number"
                min="1"
                step="1"
                {...form.register("edition_size")}
                inputVariant="admin"
                placeholder="Leave empty for open edition"
              />
              {form.formState.errors.edition_size && (
                <p className="text-xs font-medium text-red-600" role="alert">{form.formState.errors.edition_size.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent">Accent Color</Label>
              <Input id="accent" {...form.register("accent")} inputVariant="admin" placeholder="#E8B4B8" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-ivory/50 px-3.5 py-2.5 text-sm text-ink transition-colors hover:bg-cream">
              <input type="checkbox" className="size-4 rounded border-line" {...form.register("price_from")} />
              <span>Price from</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-ivory/50 px-3.5 py-2.5 text-sm text-ink transition-colors hover:bg-cream">
              <input type="checkbox" className="size-4 rounded border-line" {...form.register("featured")} />
              <span>Featured</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-ivory/50 px-3.5 py-2.5 text-sm text-ink transition-colors hover:bg-cream">
              <input type="checkbox" className="size-4 rounded border-line" {...form.register("is_new")} />
              <span>New</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {existingImages.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-faint">
                Current Images
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {existingImages.map((img) => (
                  <div
                    key={img.id}
                    className="group relative overflow-hidden rounded-xl border border-line bg-cream"
                  >
                    <Image
                      src={img.image_url}
                      alt="Artwork image"
                      width={200}
                      height={200}
                      className="aspect-square w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.id)}
                      aria-label="Remove image"
                      className="absolute right-2 top-2 grid size-8 place-items-center rounded-full border border-line bg-white/95 text-muted shadow-sm backdrop-blur transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <X className="size-4" strokeWidth={1.6} />
                    </button>
                    {img.is_cover && (
                      <span className="absolute bottom-2 left-2 rounded-md bg-ink px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="images">Upload New Images</Label>
            <div className="mt-2 rounded-xl border-2 border-dashed border-line-strong/70 bg-ivory/40 p-8 text-center transition-colors hover:border-rose/70 hover:bg-rose-soft/30">
              <input
                id="images"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                className="sr-only"
              />
              <label htmlFor="images" className="flex cursor-pointer flex-col items-center gap-2">
                <span className="grid size-11 place-items-center rounded-full bg-white text-[#b06975] ring-1 ring-line">
                  <Upload className="size-5" strokeWidth={1.5} />
                </span>
                <span className="text-sm font-medium text-ink">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-faint">JPG, PNG or WEBP · max 10MB each</span>
              </label>
            </div>
          </div>

          {previewUrls.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-faint">
                New Images Preview
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {previewUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-xl border border-line bg-cream"
                  >
                    <Image
                      src={url}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="aspect-square w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      aria-label="Remove preview image"
                      className="absolute right-2 top-2 grid size-8 place-items-center rounded-full border border-line bg-white/95 text-muted shadow-sm backdrop-blur transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <X className="size-4" strokeWidth={1.6} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
        <Button
          type="submit"
          disabled={loading || uploading}
        >
          {(loading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Update Artwork" : "Create Artwork"}
        </Button>
        <Button type="button" variant="subtle" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}