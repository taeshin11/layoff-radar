import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  verification: {
    google: "WddgcbVJsL2BGHNAje5m6DK56IcR0Mw5UOqozI2Xtrc",
  },
  title: "Tech Layoffs Tracker 2025 — Real-Time Dashboard | LayoffRadar",
  description:
    "Track tech layoffs in real time. Updated daily. Filter by company, sector, and month. 50+ events tracked.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
