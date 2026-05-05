import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import "@/lib/utils/server-local-storage-polyfill";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"]
});

const body = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"]
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "SmallBiz IQ — A quiet operating studio for the hands-on business.",
  description:
    "Inventory, orders, and material purchasing — written by hand, measured by machine. Made for makers, studios, and small teams who care about the work."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
