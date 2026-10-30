"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/admin/toast";
import { revalidateStorefront } from "@/lib/admin/actions";
import { formatCurrency } from "@/lib/utils";

interface CommissionType {
  id: string;
  name: string;
  description: string | null;
  starting_price: number | null;
  available: boolean;
}

export function CommissionsForm({ commissionTypes: initialTypes }: { commissionTypes: CommissionType[] }) {
  const [types, setTypes] = useState<CommissionType[]>(initialTypes);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const supabase = createClient();
  const { toast } = useToast();

  const addType = async () => {
    if (!name) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("commission_types")
        .insert({
          name,
          description,
          starting_price: startingPrice ? parseFloat(startingPrice) : null,
          available: true,
        })
        .select()
        .single();
      if (error) throw error;
      setTypes([...types, data as CommissionType]);
      setName("");
      setDescription("");
      setStartingPrice("");
      await revalidateStorefront();
      toast({ title: "Commission type added", variant: "success" });
    } catch (error) {
      console.error("Error adding commission type:", error);
      toast({
        title: "Error adding commission type",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteType = async (id: string) => {
    if (!confirm("Delete this commission type?")) return;
    const { error } = await supabase.from("commission_types").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting commission type", description: error.message, variant: "destructive" });
      return;
    }
    setTypes(types.filter((t) => t.id !== id));
    await revalidateStorefront();
  };

  const toggleAvailable = async (id: string, available: boolean) => {
    const { error } = await supabase.from("commission_types").update({ available }).eq("id", id);
    if (error) {
      toast({ title: "Error updating commission type", description: error.message, variant: "destructive" });
      return;
    }
    setTypes(types.map((t) => (t.id === id ? { ...t, available } : t)));
    await revalidateStorefront();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Commission Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                inputVariant="admin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Custom portrait"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startingPrice">Starting Price</Label>
              <Input
                id="startingPrice"
                inputVariant="admin"
                type="number"
                min="0"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              inputVariant="admin"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What’s included, size options, turnaround…"
            />
          </div>
          <Button onClick={addType} disabled={loading || !name.trim()}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MessageCircle className="size-4" strokeWidth={1.6} />
            )}
            Add Commission Type
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Commission Offerings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {types.map((type) => (
            <div
              key={type.id}
              className="flex flex-col gap-3 rounded-xl border border-line bg-ivory/50 p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-ink">{type.name}</h3>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      type.available
                        ? "border-[#dbe5d7] bg-[#eef2ec] text-[#4d6147]"
                        : "border-line bg-cream text-muted"
                    }`}
                  >
                    {type.available ? "Available" : "Hidden"}
                  </span>
                </div>
                {type.description && (
                  <p className="text-sm text-muted">{type.description}</p>
                )}
                {type.starting_price != null && (
                  <p className="text-sm text-ink">
                    From {formatCurrency(Number(type.starting_price))}
                  </p>
                )}
                <label className="mt-1 flex w-fit cursor-pointer items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-line"
                    checked={type.available}
                    onChange={(e) => toggleAvailable(type.id, e.target.checked)}
                  />
                  Available for commissions
                </label>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteType(type.id)}
                aria-label={`Delete ${type.name}`}
                className="self-start"
              >
                <Trash2 className="size-4" strokeWidth={1.6} />
                Delete
              </Button>
            </div>
          ))}
          {types.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <MessageCircle className="size-6 text-faint" strokeWidth={1.4} aria-hidden />
              <p className="text-sm text-muted">No commission types yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
