import type { Metadata } from "next";
import { Inter, Manrope, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SunsetCustomCursor } from "@/modules/ui/SunsetCustomCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FleetVision AI - Intelligent Fleet Management & Predictive Analytics Platform",
  description: "AI-powered fleet management platform with predictive analytics, vehicle health monitoring, driver behavior analysis, and route optimization.",
  keywords: ["FleetVision", "fleet management", "AI", "predictive analytics", "vehicle tracking", "logistics"],
  authors: [{ name: "FleetVision AI" }],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} ${orbitron.variable} ${rajdhani.variable} antialiased bg-background text-foreground`}
      >
        <SunsetCustomCursor />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
