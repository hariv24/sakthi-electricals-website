import { notFound } from "next/navigation";
import { products, getProduct } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetail from "./ProductDetail";

export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return { title: `${p.fullName} — Sakthi Electricals` };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <ProductDetail product={p} />
      </main>
      <Footer />
    </>
  );
}
