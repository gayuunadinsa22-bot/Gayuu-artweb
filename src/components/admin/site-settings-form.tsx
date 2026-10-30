"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/admin/toast";
import { revalidateStorefront } from "@/lib/admin/actions";
import { defaultSiteSettings } from "@/lib/settings";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { describeAdminError } from "@/lib/admin/errors";

interface SettingsField {
  key: string;
  label: string;
  section: "branding" | "contact" | "store";
  type?: string;
  textarea?: boolean;
  /** Blank when the row is missing — do not prefill a placeholder number. */
  emptyByDefault?: boolean;
}

const settingsFields: SettingsField[] = [
  { key: "brandName", label: "Brand Name", section: "branding" },
  { key: "tagline", label: "Tagline", section: "branding" },
  { key: "artistName", label: "Artist Name", section: "branding" },
  { key: "artistFullName", label: "Artist Full Name", section: "branding" },
  { key: "contactEmail", label: "Email Address", section: "contact" },
  {
    key: "whatsappNumber",
    label: "WhatsApp Number (digits only, e.g. 94721404162)",
    section: "contact",
    emptyByDefault: true,
  },
  {
    key: "whatsappDisplay",
    label: "WhatsApp Display (leave blank to auto-format)",
    section: "contact",
    emptyByDefault: true,
  },
  { key: "instagram", label: "Instagram URL", section: "contact" },
  { key: "pinterest", label: "Pinterest URL", section: "contact" },
  { key: "tiktok", label: "TikTok URL", section: "contact" },
  { key: "location", label: "Location", section: "contact" },
  { key: "currency", label: "Currency", section: "store" },
  { key: "currencySymbol", label: "Currency Symbol", section: "store" },
  { key: "freeShippingOver", label: "Free Shipping Over", section: "store", type: "number" },
  { key: "deliveryFeeFrom", label: "Delivery Fee From", section: "store", type: "number" },
  { key: "about", label: "About (Footer)", section: "branding", textarea: true },
];

type SettingsValues = Record<string, string>;

/** Stored value, falling back to the built-in default for blank/missing rows. */
function defaultValueFor(key: string, settings: Record<string, string>): string {
  const stored = settings[key];
  if (typeof stored === "string" && stored.trim() !== "") return stored;

  const field = settingsFields.find((item) => item.key === key);
  if (field?.emptyByDefault) return "";

  const fallback = (defaultSiteSettings as unknown as Record<string, unknown>)[key];
  if (fallback === undefined || fallback === null) return "";
  return String(fallback);
}

export function SiteSettingsForm({ settings }: { settings: Record<string, string> }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const form = useForm<SettingsValues>({
    defaultValues: settingsFields.reduce<SettingsValues>((acc, field) => {
      acc[field.key] = defaultValueFor(field.key, settings);
      return acc;
    }, {}),
  });

  const onSubmit = async (values: SettingsValues) => {
    setLoading(true);
    try {
      const entries = Object.entries(values).map(([key, value]) => ({
        key,
        value:
          key === "whatsappNumber"
            ? normalizeWhatsAppNumber(value)
            : String(value).trim(),
      }));

      const { error } = await supabase
        .from("site_settings")
        .upsert(entries, { onConflict: "key" });
      if (error) throw error;

      // Read the values back so we never report success for a write that
      // the database (or RLS) silently rejected.
      const { data: saved, error: readError } = await supabase
        .from("site_settings")
        .select("key, value")
        .in(
          "key",
          entries.map((entry) => entry.key),
        );
      if (readError) throw readError;

      const savedMap = new Map(
        (saved ?? []).map((row) => [row.key, String(row.value ?? "")]),
      );
      const mismatch = entries.find(
        (entry) => savedMap.get(entry.key) !== entry.value,
      );
      if (mismatch) {
        throw new Error(
          `The database did not keep the new value for "${mismatch.key}". Please try again.`,
        );
      }

      await revalidateStorefront();
      router.refresh();
      toast({ title: "Settings saved successfully!", variant: "success" });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: describeAdminError(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const brandingFields = settingsFields.filter((f) => f.section === "branding");
  const contactFields = settingsFields.filter((f) => f.section === "contact");
  const storeFields = settingsFields.filter((f) => f.section === "store");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {brandingFields.map((field) => (
              <div
                key={field.key}
                className={`space-y-2 ${field.textarea ? "md:col-span-2" : ""}`}
              >
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.textarea ? (
                  <Textarea
                    id={field.key}
                    inputVariant="admin"
                    {...form.register(field.key)}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={field.key}
                    inputVariant="admin"
                    {...form.register(field.key)}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {contactFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                inputVariant="admin"
                {...form.register(field.key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Store Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {storeFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                inputVariant="admin"
                type={field.type || "text"}
                {...form.register(field.key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Settings
      </Button>
    </form>
  );
}