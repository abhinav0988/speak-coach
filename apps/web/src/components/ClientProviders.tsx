"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { PWARegister } from "@/components/PWARegister";
import { DailyReminder } from "@/components/DailyReminder";
import { AuthProvider } from "@/components/AuthProvider";
import { SidebarProvider } from "@/components/layout/SidebarContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <PWARegister />
          <DailyReminder />
          {children}
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
