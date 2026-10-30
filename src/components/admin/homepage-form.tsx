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
import {
  homepageImageDefaults,
  homepageImageDefinitions,
  type HomepageImageKey,
} from "@/lib/site-images";
import { describeAdminError, isMissingColumnError } from "@/lib/admin/errors";

interface HomepageFormProps {
  sections: Record<string, Record<string, string>>;
  featuredArtworks?: unknown[];
  images?: Partial<Record<HomepageImageKey, string | null>>;
}

interface HomepageFormValues {
  heroHeading: string;
  heroSubheading: string;
  heroDescription: string;
  heroCta1: string;
  heroCta2: string;
  artistHeading: string;
  artistDescription: string;
  behindHeading: string;
  behindDescription: string;
  instagramHeading: string;
  newsletterHeading: string;
  newsletterDescription: string;
  heroImageUrl: string;
  heroFloatingImageUrl: string;
  artistIntroImageUrl: string;
}

export function HomepageForm({ sections, images = {} }: HomepageFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const form = useForm<HomepageFormValues>({
    defaultValues: {
      heroHeading: sections.hero?.heading || "",
      heroSubheading: sections.hero?.subheading || "",
      heroDescription: sections.hero?.description || "",
      heroCta1: sections.hero?.cta1 || "",
      heroCta2: sections.hero?.cta2 || "",
      artistHeading: sections.artist?.heading || "",
      artistDescription: sections.artist?.description || "",
      behindHeading: sections.behind?.heading || "",
      behindDescription: sections.behind?.description || "",
      instagramHeading: sections.instagram?.heading || "",
      newsletterHeading: sections.newsletter?.heading || "",
      newsletterDescription: sections.newsletter?.description || "",
      heroImageUrl: images.hero_image_url || "",
      heroFloatingImageUrl: images.hero_floating_image_url || "",
      artistIntroImageUrl: images.artist_intro_image_url || "",
    },
  });

  const heroImageUrl = useWatch({ control: form.control, name: "heroImageUrl" });
  const heroFloatingImageUrl = useWatch({
    control: form.control,
    name: "heroFloatingImageUrl",
  });
  const artistIntroImageUrl = useWatch({
    control: form.control,
    name: "artistIntroImageUrl",
  });

  const onSubmit = async (values: HomepageFormValues) => {
    setLoading(true);
    try {
      // Preserve any extra keys already stored for a section so saving one
      // form never deletes content written elsewhere. Image URLs are also
      // mirrored into JSONB so they keep working before the additive image
      // columns migration has been applied.
      const heroContent = {
        ...(sections.hero ?? {}),
        heading: values.heroHeading,
        subheading: values.heroSubheading,
        description: values.heroDescription,
        cta1: values.heroCta1,
        cta2: values.heroCta2,
        heroImageUrl: values.heroImageUrl.trim(),
        heroFloatingImageUrl: values.heroFloatingImageUrl.trim(),
        artistIntroImageUrl: values.artistIntroImageUrl.trim(),
      };
      const artistContent = {
        ...(sections.artist ?? {}),
        heading: values.artistHeading,
        description: values.artistDescription,
      };
      const behindContent = {
        ...(sections.behind ?? {}),
        heading: values.behindHeading,
        description: values.behindDescription,
      };
      const instagramContent = {
        ...(sections.instagram ?? {}),
        heading: values.instagramHeading,
      };
      const newsletterContent = {
        ...(sections.newsletter ?? {}),
        heading: values.newsletterHeading,
        description: values.newsletterDescription,
      };

      const heroImages = {
        hero_image_url: values.heroImageUrl.trim() || null,
        hero_floating_image_url: values.heroFloatingImageUrl.trim() || null,
        artist_intro_image_url: values.artistIntroImageUrl.trim() || null,
      };

      const results = await Promise.all([
        supabase
          .from("homepage_sections")
          .upsert(
            { section_key: "hero", content: heroContent, ...heroImages },
            { onConflict: "section_key" },
          ),
        supabase
          .from("homepage_sections")
          .upsert({ section_key: "artist", content: artistContent }, { onConflict: "section_key" }),
        supabase
          .from("homepage_sections")
          .upsert({ section_key: "behind", content: behindContent }, { onConflict: "section_key" }),
        supabase
          .from("homepage_sections")
          .upsert({ section_key: "instagram", content: instagramContent }, { onConflict: "section_key" }),
        supabase
          .from("homepage_sections")
          .upsert(
            { section_key: "newsletter", content: newsletterContent },
            { onConflict: "section_key" },
          ),
      ]);

      const failedIndex = results.findIndex((result) => result.error);
      let imagesSaved = true;

      // If only the hero row failed because the additive image migration
      // has not been applied, retry the hero copy without image columns so
      // text edits still save. The artist is told what to run below.
      if (
        failedIndex === 0 &&
        results[0].error &&
        isMissingColumnError(results[0].error)
      ) {
        imagesSaved = false;
        const heroRetry = await supabase
          .from("homepage_sections")
          .upsert({ section_key: "hero", content: heroContent }, { onConflict: "section_key" });
        if (heroRetry.error) throw heroRetry.error;

        const otherFailed = results.find((result, index) => index > 0 && result.error);
        if (otherFailed?.error) throw otherFailed.error;
      } else if (failedIndex !== -1) {
        throw results[failedIndex].error;
      }

      // Read the hero row back so a silent write failure is never reported
      // as a success. The JSONB mirror is checked even when the dedicated
      // columns exist, which also catches an update that affected 0 rows.
      const { data: savedHero, error: readError } = await supabase
        .from("homepage_sections")
        .select("*")
        .eq("section_key", "hero")
        .maybeSingle();
      if (readError) throw readError;
      if (!savedHero) {
        throw new Error(
          "The homepage row could not be read back after saving. Please try again.",
        );
      }

      const savedContent =
        savedHero.content && typeof savedHero.content === "object"
          ? (savedHero.content as Record<string, unknown>)
          : {};
      const expectedMirror = {
        heroImageUrl: values.heroImageUrl.trim(),
        heroFloatingImageUrl: values.heroFloatingImageUrl.trim(),
        artistIntroImageUrl: values.artistIntroImageUrl.trim(),
      };
      const mirrorMismatch = Object.entries(expectedMirror).find(
        ([key, value]) => (savedContent[key] ?? "") !== value,
      );
      if (mirrorMismatch) {
        throw new Error(
          "The database did not keep the homepage images. Please try again.",
        );
      }

      if (imagesSaved) {
        const savedRow = savedHero as Record<string, unknown>;
        if (
          savedRow.hero_image_url !== heroImages.hero_image_url ||
          savedRow.hero_floating_image_url !== heroImages.hero_floating_image_url ||
          savedRow.artist_intro_image_url !== heroImages.artist_intro_image_url
        ) {
          throw new Error(
            "The database did not keep the homepage images. Make sure the homepage image migration has been applied.",
          );
        }
      }

      await revalidateStorefront();
      router.refresh();

      if (imagesSaved) {
        toast({ title: "Homepage updated successfully!", variant: "success" });
      } else {
        toast({
          title: "Homepage saved",
          description:
            "Images were stored in the page content because the image columns are missing. Run supabase/migrations/20240101000004_homepage_images.sql in the Supabase SQL editor to use the dedicated columns.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error saving homepage:", error);
      toast({
        title: "Error saving homepage",
        description: describeAdminError(error, {
          migration: "20240101000004_homepage_images.sql",
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
          <CardTitle>Homepage Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploadField
            label={homepageImageDefinitions[0].label}
            description={homepageImageDefinitions[0].description}
            value={heroImageUrl}
            fallback={homepageImageDefaults.hero_image_url}
            ratio={homepageImageDefinitions[0].ratio}
            folder="homepage/hero"
            onChange={(url) => form.setValue("heroImageUrl", url, { shouldDirty: true })}
          />
          <ImageUploadField
            label={homepageImageDefinitions[1].label}
            description={homepageImageDefinitions[1].description}
            value={heroFloatingImageUrl}
            fallback={homepageImageDefaults.hero_floating_image_url}
            ratio={homepageImageDefinitions[1].ratio}
            folder="homepage/floating"
            onChange={(url) =>
              form.setValue("heroFloatingImageUrl", url, { shouldDirty: true })
            }
          />
          <ImageUploadField
            label={homepageImageDefinitions[2].label}
            description={homepageImageDefinitions[2].description}
            value={artistIntroImageUrl}
            fallback={homepageImageDefaults.artist_intro_image_url}
            ratio={homepageImageDefinitions[2].ratio}
            folder="homepage/artist"
            onChange={(url) =>
              form.setValue("artistIntroImageUrl", url, { shouldDirty: true })
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroHeading">Main Heading</Label>
            <Input id="heroHeading" {...form.register("heroHeading")} inputVariant="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubheading">Highlighted Heading Text</Label>
            <Input id="heroSubheading" {...form.register("heroSubheading")} inputVariant="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroDescription">Description</Label>
            <Textarea id="heroDescription" {...form.register("heroDescription")} rows={3} inputVariant="admin" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heroCta1">CTA Button 1 Label</Label>
              <Input id="heroCta1" {...form.register("heroCta1")} inputVariant="admin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroCta2">CTA Button 2 Label</Label>
              <Input id="heroCta2" {...form.register("heroCta2")} inputVariant="admin" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Artist Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="artistHeading">Heading</Label>
            <Input id="artistHeading" {...form.register("artistHeading")} inputVariant="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="artistDescription">Description</Label>
            <Textarea id="artistDescription" {...form.register("artistDescription")} rows={4} inputVariant="admin" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Behind the Canvas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="behindHeading">Heading</Label>
            <Input id="behindHeading" {...form.register("behindHeading")} inputVariant="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="behindDescription">Description</Label>
            <Textarea id="behindDescription" {...form.register("behindDescription")} rows={4} inputVariant="admin" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instagram Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instagramHeading">Heading</Label>
            <Input id="instagramHeading" {...form.register("instagramHeading")} inputVariant="admin" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Newsletter Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newsletterHeading">Heading</Label>
            <Input id="newsletterHeading" {...form.register("newsletterHeading")} inputVariant="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newsletterDescription">Description</Label>
            <Textarea id="newsletterDescription" {...form.register("newsletterDescription")} rows={3} inputVariant="admin" />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Homepage Content
      </Button>
    </form>
  );
}