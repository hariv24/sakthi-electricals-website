import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sakthi Electricals — Instrument Transformer People",
  description:
    "ISO 9001 certified manufacturer of instrument transformers up to 33 kV, control transformers, vibratory feeders and EB HT & LT service panels. Engineered and tested to IS & IEC standards.",
  icons: { icon: "/assets/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
