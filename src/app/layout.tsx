import type { Metadata } from "next";
import "@/lib/utils/server-local-storage-polyfill";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmallBiz IQ — A quiet operating studio for the hands-on business.",
  description:
    "Inventory, orders, and material purchasing — written by hand, measured by machine. Made for makers, studios, and small teams who care about the work."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
