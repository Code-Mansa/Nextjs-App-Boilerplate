"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/context/AuthProvider";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      enableSystem
      disableTransitionOnChange>
      <SessionProvider>
        <AuthProvider>{children}</AuthProvider>
      </SessionProvider>
      <Toaster />
    </ThemeProvider>
  );
}
