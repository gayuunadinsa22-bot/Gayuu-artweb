"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminHeaderProps {
  userEmail?: string | null;
  brandName: string;
  onOpenMenu: () => void;
}

export function AdminHeader({
  userEmail,
  brandName,
  onOpenMenu,
}: AdminHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/85 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMenu}
          aria-label="Open navigation"
          className="-ml-2 text-ink hover:bg-cream lg:hidden"
        >
          <Menu className="size-5" strokeWidth={1.6} />
        </Button>

        <Link href="/admin" className="flex min-w-0 items-baseline gap-2">
          <span className="truncate font-serif text-xl tracking-tight text-ink sm:text-2xl">
            {brandName}
            <span className="ml-1 font-hand text-lg text-rose" aria-hidden>
              ♡
            </span>
          </span>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-faint sm:inline">
            Admin Studio
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
          {userEmail && (
            <span className="hidden max-w-[220px] items-center gap-2 rounded-full border border-line bg-ivory px-3 py-1.5 text-xs text-muted md:inline-flex">
              <span aria-hidden className="size-1.5 rounded-full bg-sage" />
              <span className="truncate">{userEmail}</span>
            </span>
          )}
          <Button asChild variant="subtle" size="sm" className="hidden sm:inline-flex">
            <Link href="/" target="_blank" rel="noreferrer" prefetch={false}>
              <ExternalLink className="size-4" strokeWidth={1.6} />
              View Website
            </Link>
          </Button>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-muted hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="size-4" strokeWidth={1.6} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
