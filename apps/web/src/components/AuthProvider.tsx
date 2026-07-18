"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { api, setCsrf, type AuthUser } from "@/lib/api";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (data: { email: string; password: string; rememberMe?: boolean }) => Promise<string>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<{ email: string; next: string; devOtp?: string }>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (patch: Partial<AuthUser>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_PREFIXES = ["/auth", "/sign-in", "/sign-up"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    try {
      const me = await api.me();
      if (me.csrfToken) setCsrf(me.csrfToken);
      setUser(me.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await api.refresh().catch(() => null);
        const me = await api.me();
        if (cancelled) return;
        if (me.csrfToken) setCsrf(me.csrfToken);
        setUser(me.user);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (data: { email: string; password: string; rememberMe?: boolean }) => {
      const res = await api.login(data);
      setUser(res.user);
      return res.next;
    },
    []
  );

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      const res = await api.register(data);
      return { email: res.email, next: res.next, devOtp: res.devOtp };
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      /* ignore */
    }
    setUser(null);
    setCsrf(null);
    router.push("/auth/login");
  }, [router]);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, signOut: logout, refreshUser, updateUser }),
    [user, loading, login, register, logout, refreshUser, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useAuthOptional() {
  return useContext(AuthContext);
}

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = isPublicPath(pathname);

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublic) {
      router.replace("/auth/login");
      return;
    }
    if (user && (pathname === "/auth/login" || pathname === "/auth/register" || pathname === "/sign-in" || pathname === "/sign-up")) {
      router.replace(user.profileComplete ? "/dashboard" : "/profile/setup");
      return;
    }
    if (user && !user.emailVerified && !pathname.startsWith("/auth/verify-email")) {
      router.replace(`/auth/verify-email?email=${encodeURIComponent(user.email)}`);
      return;
    }
    if (
      user &&
      user.emailVerified &&
      !user.profileComplete &&
      !pathname.startsWith("/profile/setup") &&
      !pathname.startsWith("/auth/")
    ) {
      router.replace("/profile/setup");
    }
  }, [loading, user, isPublic, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user && !isPublic) return null;
  if (user && (pathname === "/auth/login" || pathname === "/auth/register" || pathname === "/sign-in" || pathname === "/sign-up")) {
    return null;
  }

  return <>{children}</>;
}

export function getInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}
