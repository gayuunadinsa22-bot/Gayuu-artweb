"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar, AdminNav } from "@/components/admin/admin-sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

interface AdminShellProps {
  userEmail?: string | null;
  brandName: string;
  children: ReactNode;
}

/**
 * Admin chrome: fixed desktop rail, sticky header and a mobile drawer that
 * closes on navigation. The main column is offset by the rail width so
 * content can never slide underneath it.
 */
export function AdminShell({ userEmail, brandName, children }: AdminShellProps) {
  const pathname = usePathname();
  // Store the route the drawer was opened on. When the route changes the
  // drawer is derived closed automatically — no setState-in-effect needed.
  const [mobileNavPath, setMobileNavPath] = useState<string | null>(null);
  const mobileNavOpen = mobileNavPath === pathname;

  return (
    <div className="admin-scope min-h-screen overflow-x-clip bg-ivory">
      <AdminSidebar />

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-[264px]">
        <AdminHeader
          userEmail={userEmail}
          brandName={brandName}
          onOpenMenu={() => setMobileNavPath(pathname)}
        />

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      <Sheet
        open={mobileNavOpen}
        onOpenChange={(open) => setMobileNavPath(open ? pathname : null)}
      >
        <SheetContent
          side="left"
          className="w-[280px] max-w-[85vw] border-line bg-white p-0"
        >
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <SheetDescription>Navigate the Gayuu admin studio.</SheetDescription>
          <div className="flex h-16 items-center border-b border-line px-5">
            <span className="font-serif text-xl tracking-tight text-ink">
              {brandName}
              <span className="ml-1 font-hand text-lg text-rose" aria-hidden>
                ♡
              </span>
            </span>
          </div>
          <div className="h-[calc(100%-4rem)]">
            <AdminNav onNavigate={() => setMobileNavPath(null)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
