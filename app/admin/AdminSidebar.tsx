'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { LayoutDashboard, Newspaper, Package, Users, LogOut } from 'lucide-react';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/news',      label: 'News',        icon: Newspaper },
  { href: '/admin/products',  label: 'Products',    icon: Package },
  { href: '/admin/careers',   label: 'Careers',     icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  async function signOut() {
    const sb = createSupabaseBrowserClient();
    await sb.auth.signOut();
    router.push('/admin');
  }

  return (
    <aside className="admin-sidebar" style={{ width: 220, background: '#1a1a2e', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 28px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="" style={{ height: 30 }} />
          <div>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Sakthi</div>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 11 }}>Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, textDecoration: 'none',
              color: active ? '#fff' : 'rgba(255,255,255,.5)',
              background: active ? 'rgba(255,255,255,.1)' : 'transparent',
              fontSize: 14, fontWeight: active ? 600 : 400,
              transition: 'all 120ms',
            }}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <button onClick={signOut} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          width: '100%', padding: '9px 12px', borderRadius: 8,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,.4)', fontSize: 14,
          transition: 'color 120ms',
        }}>
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
