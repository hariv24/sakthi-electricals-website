import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { getCatalogTreeFromDB, extractMenuData } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Sakthi Electricals — Instrument Transformer People",
  description:
    "ISO 9001 certified manufacturer of instrument transformers up to 33 kV, control transformers, vibratory feeders and EB HT & LT service panels. Engineered and tested to IS & IEC standards.",
  icons: { icon: "/assets/logo.png" },
  verification: { google: "T6fUyAPXiXJiDlEbzVLzx7Lw18Sok9-K-i-Ko3y1M9A" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = await getCatalogTreeFromDB();
  const menuData = extractMenuData(tree);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ConditionalLayout menuData={menuData}>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
