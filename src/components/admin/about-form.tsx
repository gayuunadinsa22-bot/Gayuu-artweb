"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/admin/toast";
import { revalidateStorefront } from "@/lib/admin/actions";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { aboutImageDefaults, aboutImageDefinitions } from "@/lib/site-images";
import { describeAdminError, isMissingColumnError } from "@/lib/admin/errors";

interface AboutValues {
  artistName: string;
  heroHeading: string;
  heroDescription: string;
  shortBiography: string;
  fullBiography: string;
  creativeJourney: string;
  artisticInspiration: string;
  paintingPhilosophy: string;
  location: string;
  contactCTA: string;
  heroImageUrl: string;
  portraitImageUrl: string;
  studioImage1Url: string;
  studioImage2Url: string;
  studioImage3Url: string;
}

type AboutImageValues = Pick<
  AboutValues,
  | "heroImageUrl"
  | "portraitImageUrl"
  | "studioImage1Url"
  | "studioImage2Url"
  | "studioImage3Url"
>;

interface AboutFormProps {
  rowId: string | null;
  content: Partial<Record<keyof AboutValues, unknown>>;
  images?: Partial<Record<keyof AboutImageValues, string | null>> | null;
}

const text = (value: unknown): string =>
  typeof value === "string" ? value : value === null || value === undefined ? "" : String(value);

export function AboutForm({ rowId, content, images }: AboutFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const form = useForm<AboutValues>({
    defaultValues: {
      artistName: text(content.artistName),
      heroHeading: text(content.heroHeading),
      heroDescription: text(content.heroDescription),
      shortBiography: text(content.shortBiography),
      fullBiography: text(content.fullBiography),
      creativeJourney: text(content.creativeJourney),
      artisticInspiration: text(content.artisticInspiration),
      paintingPhilosophy: text(content.paintingPhilosophy),
      location: text(content.location),
      contactCTA: text(content.contactCTA),
      heroImageUrl: text(images?.heroImageUrl ?? content.heroImageUrl),
      portraitImageUrl: text(images?.portraitImageUrl ?? content.portraitImageUrl),
      studioImage1Url: text(images?.studioImage1Url ?? content.studioImage1Url),
      studioImage2Url: text(images?.studioImage2Url ?? content.studioImage2Url),
      studioImage3Url: text(images?.studioImage3Url ?? content.studioImage3Url),
    },
  });

  const heroImageUrl = useWatch({ control: form.control, name: "heroImageUrl" });
  const portraitImageUrl = useWatch({ control: form.control, name: "portraitImageUrl" });
  const studioImage1Url = useWatch({ control: form.control, name: "studioImage1Url" });
  const studioImage2Url = useWatch({ control: form.control, name: "studioImage2Url" });
  const studioImage3Url = useWatch({ control: form.control, name: "studioImage3Url" });

  const onSubmit = async (values: AboutValues) => {
    setLoading(true);
    try {
      const {
        heroImageUrl: heroImg,
        portraitImageUrl: portraitImg,
        studioImage1Url: studio1,
        studioImage2Url: studio2,
        studioImage3Url: studio3,
        ...copy
      } = values;

      const imageValues = {
        heroImageUrl: heroImg.trim() || null,
        portraitImageUrl: portraitImg.trim() || null,
        studioImage1Url: studio1.trim() || null,
        studioImage2Url: studio2.trim() || null,
        studioImage3Url: studio3.trim() || null,
      };

      type WriteResult = { error: unknown; id?: string };

      const writeRow = async (payload: {
        content: Record<string, string | null>;
        heroImageUrl?: string | null;
        portraitImageUrl?: string | null;
        studioImage1Url?: string | null;
        studioImage2Url?: string | null;
        studioImage3Url?: string | null;
      }): Promise<WriteResult> => {
        if (rowId) {
          const { data, error } = await supabase
            .from("about_content")
            .update(payload)
            .eq("id", rowId)
            .select("id");
          if (error) return { error };
          if (!data || data.length === 0) {
            return {
              error: new Error(
                "The about content row could not be updated. It may have been removed — reload and try again.",
              ),
            };
          }
          return { error: null, id: data[0]?.id };
        }

        // Never invent an id: the column is a UUID with a database default.
        const { data, error } = await supabase
          .from("about_content")
          .insert(payload)
          .select("id");
        if (error) return { error };
        if (!data || data.length === 0) {
          return {
            error: new Error(
              "The about content row was not created. Please try again.",
            ),
          };
        }
        return { error: null, id: data[0]?.id };
      };

      // Mirror image URLs into the existing `content` JSONB as well. This
      // lets the public page keep showing images even before the additive
      // image columns migration has been applied.
      const mirroredContent = { ...copy, ...imageValues };

      let result = await writeRow({ content: mirroredContent, ...imageValues });
      let imagesSaved = true;

      // The additive image migration may not have been applied to this
      // database yet. Everything must still be saveable — retry without
      // the image columns (the JSONB mirror above still holds the URLs)
      // and tell the artist what to run.
      if (result.error && isMissingColumnError(result.error)) {
        imagesSaved = false;
        result = await writeRow({ content: mirroredContent });
      }
      if (result.error) throw result.error;

      // Read the saved row back and compare every field so a silent write
      // failure (or a mismatched mapping) is never reported as success.
      if (!result.id) {
        throw new Error(
          "The about content row was saved but could not be verified. Reload and check the page.",
        );
      }
      const { data: savedRow, error: readError } = await supabase
        .from("about_content")
        .select("*")
        .eq("id", result.id)
        .maybeSingle();
      if (readError) throw readError;

      const savedContent =
        savedRow?.content && typeof savedRow.content === "object"
          ? (savedRow.content as Record<string, unknown>)
          : {};
      const contentMismatch = Object.entries(mirroredContent).find(
        ([key, value]) => (savedContent[key] ?? "") !== (value ?? ""),
      );
      if (!savedRow || contentMismatch) {
        throw new Error(
          "The database did not keep the about content. Please try again.",
        );
      }

      if (imagesSaved && savedRow) {
        const saved = savedRow as Record<string, unknown>;
        const getSaved = (camel: string, snake: string) =>
          saved[camel] !== undefined ? saved[camel] : saved[snake];
        if (
          getSaved("heroImageUrl", "hero_image_url") !== imageValues.heroImageUrl ||
          getSaved("portraitImageUrl", "portrait_image_url") !== imageValues.portraitImageUrl ||
          getSaved("studioImage1Url", "studio_image1_url") !== imageValues.studioImage1Url ||
          getSaved("studioImage2Url", "studio_image2_url") !== imageValues.studioImage2Url ||
          getSaved("studioImage3Url", "studio_image3_url") !== imageValues.studioImage3Url
        ) {
          throw new Error(
            "The database did not keep the about images. Please try again.",
          );
        }
      }

      await revalidateStorefront();
      router.refresh();

      if (imagesSaved) {
        toast({ title: "About page updated successfully!", variant: "success" });
      } else {
        toast({
          title: "About page saved",
          description:
            "Images were stored in the page content because the image columns are missing. Run supabase/migrations/20240101000006_about_images.sql in the Supabase SQL editor to use the dedicated columns.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error saving about content:", error);
      toast({
        title: "Error saving about content",
        description: describeAdminError(error, {
          migration: "20240101000006_about_images.sql",
        }),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About Page Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploadField
            label={aboutImageDefinitions[0].label}
            description={aboutImageDefinitions[0].description}
            value={heroImageUrl}
            fallback={aboutImageDefaults.heroImageUrl}
            ratio={aboutImageDefinitions[0].ratio}
            folder="about/hero"
            onChange={(url) => form.setValue("heroImageUrl", url, { shouldDirty: true })}
          />
          <ImageUploadField
            label={aboutImageDefinitions[1].label}
            description={aboutImageDefinitions[1].description}
            value={portraitImageUrl}
            fallback={aboutImageDefaults.portraitImageUrl}
            ratio={aboutImageDefinitions[1].ratio}
            folder="about/portrait"
            onChange={(url) => form.setValue("portraitImageUrl", url, { shouldDirty: true })}
          />
          <ImageUploadField
            label={aboutImageDefinitions[2].label}
            description={aboutImageDefinitions[2].description}
            value={studioImage1Url}
            fallback={aboutImageDefaults.studioImage1Url}
            ratio={aboutImageDefinitions[2].ratio}
            folder="about/studio"
            onChange={(url) => form.setValue("studioImage1Url", url, { shouldDirty: true })}
          />
          <ImageUploadField
            label={aboutImageDefinitions[3].label}
            description={aboutImageDefinitions[3].description}
            value={studioImage2Url}
            fallback={aboutImageDefaults.studioImage2Url}
            ratio={aboutImageDefinitions[3].ratio}
            folder="about/studio"
            onChange={(url) => form.setValue("studioImage2Url", url, { shouldDirty: true })}
          />
          <ImageUploadField
            label={aboutImageDefinitions[4].label}
            description={aboutImageDefinitions[4].description}
            value={studioImage3Url}
            fallback={aboutImageDefaults.studioImage3Url}
            ratio={aboutImageDefinitions[4].ratio}
            folder="about/studio"
            onChange={(url) => form.setValue("studioImage3Url", url, { shouldDirty: true })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Artist Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="artistName">Artist Name</Label>
            <Input id="artistName" {...form.register("artistName")} inputVariant="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...form.register("location")} inputVariant="admin" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroHeading">Hero Heading</Label>
            <Input id="heroHeading" {...form.register("heroHeading")} inputVariant="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroDescription">Hero Description</Label>
            <Textarea id="heroDescription" {...form.register("heroDescription")} rows={3} inputVariant="admin" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Biography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shortBiography">Short Biography</Label>
            <Textarea id="shortBiography" {...form.register("shortBiography")} rows={3} inputVariant="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullBiography">Full Biography</Label>
            <Textarea id="fullBiography" {...form.register("fullBiography")} rows={6} inputVariant="admin" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Artistic Journey</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="creativeJourney">Creative Journey</Label>
            <Textarea id="creativeJourney" {...form.register("creativeJourney")} rows={4} inputVariant="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="artisticInspiration">Artistic Inspiration</Label>
            <Textarea id="artisticInspiration" {...form.register("artisticInspiration")} rows={4} inputVariant="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paintingPhilosophy">Painting Philosophy</Label>
            <Textarea id="paintingPhilosophy" {...form.register("paintingPhilosophy")} rows={4} inputVariant="admin" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactCTA">Contact CTA</Label>
            <Input id="contactCTA" {...form.register("contactCTA")} inputVariant="admin" />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save About Content
      </Button>
    </form>
  );
}