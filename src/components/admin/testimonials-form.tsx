"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, Star, Quote } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/admin/toast";
import { revalidateStorefront } from "@/lib/admin/actions";

interface Testimonial {
  id: string;
  customer_name: string;
  review: string;
  visible: boolean;
}

export function TestimonialsForm({ testimonials: initialTestimonials }: { testimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [review, setReview] = useState("");
  const supabase = createClient();
  const { toast } = useToast();

  const addTestimonial = async () => {
    if (!customerName || !review) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .insert({
          customer_name: customerName,
          review,
          visible: true,
        })
        .select()
        .single();
      if (error) throw error;
      setTestimonials([data as Testimonial, ...testimonials]);
      setCustomerName("");
      setReview("");
      await revalidateStorefront();
      toast({ title: "Testimonial added", variant: "success" });
    } catch (error) {
      console.error("Error adding testimonial:", error);
      toast({
        title: "Error adding testimonial",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting testimonial", description: error.message, variant: "destructive" });
      return;
    }
    setTestimonials(testimonials.filter((t) => t.id !== id));
    await revalidateStorefront();
  };

  const toggleVisible = async (id: string, visible: boolean) => {
    const { error } = await supabase.from("testimonials").update({ visible }).eq("id", id);
    if (error) {
      toast({ title: "Error updating testimonial", description: error.message, variant: "destructive" });
      return;
    }
    setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, visible } : t)));
    await revalidateStorefront();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Testimonial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              inputVariant="admin"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Nadeesha P."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review">Review</Label>
            <Textarea
              id="review"
              inputVariant="admin"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              placeholder="What did they love about the piece?"
            />
          </div>
          <Button
            onClick={addTestimonial}
            disabled={loading || !customerName.trim() || !review.trim()}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Star className="size-4" strokeWidth={1.6} />
            )}
            Add Testimonial
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Published Testimonials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col gap-3 rounded-xl border border-line bg-ivory/50 p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-ink">{testimonial.customer_name}</h3>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      testimonial.visible
                        ? "border-[#dbe5d7] bg-[#eef2ec] text-[#4d6147]"
                        : "border-line bg-cream text-muted"
                    }`}
                  >
                    {testimonial.visible ? "Visible" : "Hidden"}
                  </span>
                </div>
                <div className="flex gap-2 text-muted">
                  <Quote className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.6} aria-hidden />
                  <p className="text-sm italic leading-relaxed">{testimonial.review}</p>
                </div>
                <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-line"
                    checked={testimonial.visible}
                    onChange={(e) => toggleVisible(testimonial.id, e.target.checked)}
                  />
                  Show on storefront
                </label>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteTestimonial(testimonial.id)}
                aria-label={`Delete testimonial from ${testimonial.customer_name}`}
                className="self-start"
              >
                <Trash2 className="size-4" strokeWidth={1.6} />
                Delete
              </Button>
            </div>
          ))}
          {testimonials.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Star className="size-6 text-faint" strokeWidth={1.4} aria-hidden />
              <p className="text-sm text-muted">No testimonials yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
