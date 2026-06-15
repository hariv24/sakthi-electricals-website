import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { getCatalogTree, extractMenuData } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Sakthi Electricals — Instrument Transformer People",
  description:
    "ISO 9001 certified manufacturer of instrument transformers up to 33 kV, control transformers, vibratory feeders and EB HT & LT service panels. Engineered and tested to IS & IEC standards.",
  icons: { icon: "/assets/logo.png" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = await getCatalogTree();
  const menuData = extractMenuData(tree);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ScrollToTop />
        <Header menuData={menuData} />
        {children}
        <Footer menuData={menuData} />
      </body>
    </html>
  );
}
