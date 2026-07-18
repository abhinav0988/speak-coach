"use client";

import Link from "next/link";
import { ChevronDown, LogOut, Settings, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { useAuth, getInitials } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

export function UserMenu({ variant = "mobile" }: { variant?: "mobile" | "desktop" }) {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/sign-up"
          className="rounded-2xl border border-primary/30 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
        >
          Sign up
        </Link>
        <Link
          href="/sign-in"
          className="rounded-2xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const initials = getInitials(user.name);
  const isDesktop = variant === "desktop";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-2xl transition",
          isDesktop
            ? "px-2 py-1.5 hover:bg-white/50 dark:hover:bg-white/10"
            : "p-1.5 hover:bg-white/50 dark:hover:bg-white/10"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-xs font-bold text-white shadow-md ring-2 ring-white/50">
          {initials}
        </div>
        {isDesktop && (
          <>
            <div className="hidden text-left xl:block">
              <p className="max-w-[120px] truncate text-[13px] font-bold leading-tight text-foreground">
                {user.name.split(" ")[0]}
              </p>
              <p className="flex items-center gap-1 text-[10px] font-semibold text-muted">
                <Sparkles className="h-3 w-3 text-violet-500" />
                Premium
              </p>
            </div>
            <ChevronDown className={cn("hidden h-4 w-4 text-muted transition xl:block", open && "rotate-180")} />
          </>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div
            className={cn(
              "absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-[20px] border py-2 shadow-glass backdrop-blur-xl",
              "border-white/60 bg-white/90 dark:border-white/10 dark:bg-slate-900/95"
            )}
            role="menu"
          >
            <div className="border-b border-white/40 px-4 py-3 dark:border-white/10">
              <p className="truncate font-bold text-foreground">{user.name}</p>
              {user.email && <p className="truncate text-xs text-muted">{user.email}</p>}
            </div>
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-white/50 dark:hover:bg-white/10"
            >
              <User className="h-4 w-4 text-primary" />
              Profile
            </Link>
            <Link
              href="/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-white/50 dark:hover:bg-white/10"
            >
              <Settings className="h-4 w-4 text-primary" />
              Settings
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/5"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
