import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { getRequestLanguage } from "@/lib/i18n-server";
import "@/lib/utils/server-local-storage-polyfill";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmallBiz IQ — A quiet operating studio for the hands-on business.",
  description:
    "Inventory, orders, and material purchasing — written by hand, measured by machine. Made for makers, studios, and small teams who care about the work."
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const language = await getRequestLanguage();

  return (
    <html lang={language}>
      <body>
        <AppProviders initialLanguage={language}>{children}</AppProviders>
      </body>
    </html>
  );
}
