import type { Metadata } from "next";
import "@/lib/utils/server-local-storage-polyfill";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmallBiz IQ",
  description: "Formula-based operations software for managing products, orders, and material purchasing."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
