import { z } from "zod";

/* ── Checkout (order enquiry) ─────────────────────────────── */

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{9,16}$/, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Enter your shipping address"),
  city: z.string().trim().min(2, "Enter your city"),
  district: z.string().trim().min(2, "Select your district"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Sri Lankan postal codes are 5 digits"),
  orderNotes: z.string().trim().max(500, "Keep notes under 500 characters").optional(),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;

/* ── Custom commission enquiry ────────────────────────────── */

export const commissionSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[\d\s+-]{9,16}$/, "Enter a valid WhatsApp number"),
  artworkType: z.string().min(1, "Choose the artwork type"),
  dimensions: z.string().trim().max(80).optional(),
  budget: z.string().min(1, "Choose a budget range"),
  description: z.string().trim().min(20, "Tell me a little more (20+ characters)"),
  references: z.string().trim().max(400).optional(),
});

export type CommissionValues = z.infer<typeof commissionSchema>;

/* ── Contact ──────────────────────────────────────────────── */

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  message: z.string().trim().min(10, "Write at least 10 characters"),
});

export type ContactValues = z.infer<typeof contactSchema>;

/* ── Newsletter ───────────────────────────────────────────── */

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;

/* ── Options used by selects ──────────────────────────────── */

export const districts = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya",
] as const;

export const commissionTypes = [
  "Individual portrait",
  "Couple portrait",
  "Pet portrait",
  "Personalized painting",
  "Special gift artwork",
  "Something else",
] as const;

export const budgetRanges = [
  "Under LKR 25,000",
  "LKR 25,000 – 50,000",
  "LKR 50,000 – 100,000",
  "LKR 100,000+",
  "Not sure yet",
] as const;
