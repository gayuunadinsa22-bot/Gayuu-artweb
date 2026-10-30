"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Palette,
  Image as ImageIcon,
  Home,
  UserRound,
  MessageCircle,
  ShoppingBag,
  Star,
  Settings2,
  ShieldCheck,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navGroups = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Studio",
    items: [
      { title: "Artworks", href: "/admin/artworks", icon: Palette },
      { title: "Gallery", href: "/admin/gallery", icon: ImageIcon },
      { title: "Homepage", href: "/admin/homepage", icon: Home },
      { title: "About Artist", href: "/admin/about", icon: UserRound },
      { title: "Commissions", href: "/admin/commissions", icon: MessageCircle },
    ],
  },
  {
    label: "Store",
    items: [{ title: "Orders", href: "/admin/orders", icon: ShoppingBag }],
  },
  {
    label: "Community",
    items: [{ title: "Testimonials", href: "/admin/testimonials", icon: Star }],
  },
  {
    label: "Settings",
    items: [
      { title: "Site Settings", href: "/admin/settings", icon: Settings2 },
      { title: "Account Settings", href: "/admin/account", icon: ShieldCheck },
    ],
  },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Shared navigation body used by the fixed desktop rail and the mobile
 * drawer, so both stay in sync.
 */
export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <nav
        aria-label="Admin navigation"
        className="flex-1 space-y-6 overflow-y-auto px-3 py-5"
      >
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={true}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                        active
                          ? "bg-rose-soft text-ink ring-1 ring-inset ring-rose-line/80"
                          : "text-ink/75 hover:bg-rose-soft/60 hover:text-ink",
                      )}
                    >
                      <item.icon
                        aria-hidden
                        strokeWidth={1.6}
                        className={cn(
                          "size-[18px] shrink-0 transition-colors duration-200",
                          active
                            ? "text-[#b06975]"
                            : "text-faint group-hover:text-ink/80",
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                      {active && (
                        <span
                          aria-hidden
                          className="ml-auto size-1.5 rounded-full bg-rose"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-2 border-t border-line p-3">
        <Button asChild variant="subtle" size="sm" className="w-full justify-start">
          <Link href="/" target="_blank" rel="noreferrer" prefetch={false} onClick={onNavigate}>
            <ExternalLink className="size-4" strokeWidth={1.6} />
            View Website
          </Link>
        </Button>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="size-4" strokeWidth={1.6} />
          Logout
        </Button>
      </div>
    </div>
  );
}

/** Fixed desktop sidebar. */
export function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] border-r border-line bg-white lg:block">
      <div className="flex h-16 items-center border-b border-line px-5">
        <Link
          href="/admin"
          className="font-serif text-xl tracking-tight text-ink"
        >
          Gayuu
          <span
            className="ml-1 font-hand text-lg text-rose"
            aria-hidden
          >
            ♡
          </span>
        </Link>
        <span className="ml-auto rounded-full border border-line bg-ivory px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-faint">
          Admin
        </span>
      </div>
      <div className="h-[calc(100%-4rem)]">
        <AdminNav />
      </div>
    </aside>
  );
}
