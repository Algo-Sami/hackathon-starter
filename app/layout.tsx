import type { Metadata } from "next";
import { Suspense } from "react";
import { Noto_Nastaliq_Urdu } from "next/font/google";
import { siteConfig } from "@/config/site";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { HeaderServer } from "@/components/layout/HeaderServer";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/ai/ChatWidget";
import { SelectionSpeaker } from "@/components/voice/SelectionSpeaker";
import "./globals.css";

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-urdu",
  weight: ["400", "500", "600", "700"],
  fallback: ["Noto Naskh Arabic", "Tahoma", "sans-serif"],
});

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
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`h-full ${notoNastaliqUrdu.variable}`}
    >
      <head>
        {/*
          Zero-flash head script: synchronously reads active language from
          cookie or localStorage before first paint and applies lang, dir,
          and font class immediately.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=document.cookie.match(/(?:^|; )app_lang=([^;]+)/);var l=m?decodeURIComponent(m[1]):(localStorage.getItem('app_lang')||'en');if(l==='ur'){document.documentElement.lang='ur';document.documentElement.dir='rtl';document.documentElement.classList.add('font-urdu');if(document.body){document.body.classList.add('font-urdu');}}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-primary-light selection:text-foreground">
        <LanguageProvider initialLanguage={DEFAULT_LANGUAGE}>
          {/*
            Suspense wraps HeaderServer so that the dynamic Supabase auth check
            does not block static prerendering of the shell.
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
          <SelectionSpeaker />
        </LanguageProvider>
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
