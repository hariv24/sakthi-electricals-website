'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import VisitorTracker from './VisitorTracker';
import type { MenuFamily } from '@/lib/catalog';

export default function ConditionalLayout({
  children,
  menuData,
}: {
  children: React.ReactNode;
  menuData: MenuFamily[];
}) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return <>{children}</>;
  return (
    <>
      <ScrollToTop />
      <VisitorTracker />
      <Header menuData={menuData} />
      {children}
      <Footer menuData={menuData} />
    </>
  );
}
