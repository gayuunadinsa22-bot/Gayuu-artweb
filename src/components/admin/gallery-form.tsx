"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/admin/toast";
import { revalidateStorefront } from "@/lib/admin/actions";

interface GalleryItem {
  id: string;
  image_url: string;
  position: number;
}

export function GalleryForm({ galleryItems: initialItems }: { galleryItems: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const supabase = createClient();
  const { toast } = useToast();

  const addItem = async () => {
    if (!imageUrl) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .insert({ image_url: imageUrl, position: items.length })
        .select()
        .single();
      if (error) throw error;
      setItems([...items, data as GalleryItem]);
      setImageUrl("");
      await revalidateStorefront();
      toast({ title: "Gallery item added", variant: "success" });
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Error adding gallery item",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this gallery item?")) return;
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting gallery item", description: error.message, variant: "destructive" });
      return;
    }
    setItems(items.filter((item) => item.id !== id));
    await revalidateStorefront();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Gallery Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              inputVariant="admin"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
            />
            <p className="text-xs text-faint">
              Paste a hosted image URL. Uploaded artwork images can be copied
              from an artwork&apos;s edit page.
            </p>
          </div>
          <Button onClick={addItem} disabled={loading || !imageUrl.trim()}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" strokeWidth={1.75} />
            )}
            Add Item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl border border-line bg-cream"
              >
                <Image
                  src={item.image_url}
                  alt="Gallery item"
                  width={200}
                  height={200}
                  className="aspect-square w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  aria-label="Delete gallery item"
                  className="absolute right-2 top-2 grid size-8 place-items-center rounded-full border border-line bg-white/95 text-muted shadow-sm backdrop-blur transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="size-4" strokeWidth={1.6} />
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full flex flex-col items-center gap-2 py-10 text-center">
                <ImageIcon className="size-6 text-faint" strokeWidth={1.4} aria-hidden />
                <p className="text-sm text-muted">No gallery items yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
