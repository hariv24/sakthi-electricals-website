import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { getCatalogTreeFromDB, extractMenuData } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Sakthi Electricals — Instrument Transformer People",
  description:
    "ISO 9001 certified manufacturer of instrument transformers up to 33 kV, control transformers, vibratory feeders and EB HT & LT service panels. Engineered and tested to IS & IEC standards.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/logo.png", type: "image/png" },
    ],
  },
  verification: { google: "T6fUyAPXiXJiDlEbzVLzx7Lw18Sok9-K-i-Ko3y1M9A" },
  openGraph: {
    type: "website",
    url: "https://www.sakthielectricals.com",
    siteName: "Sakthi Electricals",
    title: "Sakthi Electricals — Instrument Transformer People",
    description:
      "ISO 9001 certified manufacturer of instrument transformers up to 33 kV, control transformers, vibratory feeders and EB HT & LT service panels. Engineered and tested to IS & IEC standards.",
    images: [{ url: "https://www.sakthielectricals.com/assets/hero-poster.jpg", width: 1200, height: 630 }],
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Manufacturer"],
  name: "Sakthi Electricals",
  alternateName: "Sakthi Instruments",
  description:
    "ISO 9001 certified manufacturer of instrument transformers up to 33 kV, control transformers, vibratory feeders and EB HT & LT service panels.",
  url: "https://www.sakthielectricals.com",
  logo: "https://www.sakthielectricals.com/assets/logo.png",
  image: "https://www.sakthielectricals.com/assets/hero-poster.jpg",
  telephone: ["+91-97152-11788", "+91-73977-26150"],
  email: "sales@sakthielectrical.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot No. 16, SIDCO Industrial Estate, Mathur (New) Mathur",
    addressLocality: "Pudukkottai",
    postalCode: "622515",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  foundingDate: "2006",
  hasMap: "https://maps.google.com/?q=Sakthi+Electricals+Pudukkottai+Tamil+Nadu",
  sameAs: [],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ConditionalLayout menuData={menuData}>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
