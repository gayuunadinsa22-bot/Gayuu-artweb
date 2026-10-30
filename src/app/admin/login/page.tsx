"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteSettings } from "@/lib/settings";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const configured = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "That email and password combination didn't work. Please try again."
            : error.message,
        );
        return;
      }

      if (data.user) {
        // Only the allow-listed admin role gets into the dashboard.
        const { data: adminRole, error: adminError } = await supabase
          .from("admin_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (adminError || !adminRole) {
          setError("This account does not have admin access.");
          await supabase.auth.signOut();
          return;
        }

        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!configured) {
    return (
      <div className="admin-scope flex min-h-screen items-center justify-center bg-ivory px-4 py-10">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-3xl">
              {siteSettings.brandName}
              <span className="font-hand text-2xl text-blush-deep" aria-hidden>
                ♡
              </span>
            </CardTitle>
            <CardDescription className="font-serif text-lg">
              Admin dashboard — setup required
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted">
            <div className="flex items-start gap-3 rounded-xl border border-line bg-cream/60 p-4">
              <Database className="mt-0.5 size-4 shrink-0 text-ink" strokeWidth={1.5} />
              <p>
                Supabase isn&apos;t connected yet, so the dashboard can&apos;t
                sign you in. The website itself works fine with its built-in
                content.
              </p>
            </div>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Create a file named <code className="text-ink">.env.local</code>{" "}
                in the project root (copy{" "}
                <code className="text-ink">.env.example</code>).
              </li>
              <li>
                Fill in your Supabase project URL and anon key, plus the
                service-role key for server-side tasks.
              </li>
              <li>
                Apply the SQL migrations in{" "}
                <code className="text-ink">supabase/migrations/</code> and
                create your admin account.
              </li>
              <li>Restart the server, then sign in here.</li>
            </ol>
            <p className="text-xs">
              Full step-by-step instructions are in{" "}
              <code className="text-ink">SETUP.md</code>.
            </p>
            <div className="pt-2 text-center">
              <Link
                href="/"
                className="text-sm text-ink underline-offset-4 hover:underline"
              >
                ← Back to Website
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="admin-scope flex min-h-screen items-center justify-center bg-ivory px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-3xl">
            {siteSettings.brandName}
            <span className="ml-1 font-hand text-2xl text-blush-deep" aria-hidden>
              ♡
            </span>
          </CardTitle>
          <CardDescription className="text-center font-serif text-lg">
            Admin Dashboard Login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                inputVariant="admin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  inputVariant="admin"
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition-colors hover:text-ink"
                  disabled={loading}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Sign In
            </Button>
            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-muted transition-colors hover:text-ink"
              >
                ← Back to Website
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
