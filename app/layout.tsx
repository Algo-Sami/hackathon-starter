import type { Metadata } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { HeaderServer } from "@/components/layout/HeaderServer";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/ai/ChatWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-primary-light selection:text-foreground">
        {/*
          Suspense wraps HeaderServer so that the cookie-based Supabase auth check
          (which is dynamic) does not block static prerendering of the shell.
          The header streams in immediately on first byte.
        */}
        <Suspense fallback={<HeaderFallback />}>
          <HeaderServer />
        </Suspense>
        <Suspense fallback={<div className="flex-1" />}>
          <main className="flex-1 flex flex-col">{children}</main>
        </Suspense>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}

/** Minimal skeleton shown during SSR streaming of the header */
function HeaderFallback() {
  return (
    <div className="sticky top-0 z-40 w-full h-16 bg-background border-b border-border" />
  );
}
