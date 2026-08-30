import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SiteHeader } from "./components/site-header";
import { cn } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

export const metadata: Metadata = {
  title: {
    default: "论文伴读",
    template: "%s · Gongzhui"
  },
  description: "一次一块，一块十分钟。",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171717",
  colorScheme: "dark"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={cn("dark", geistSans.variable)}>
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-8">{children}</div>
      </body>
    </html>
  );
}
