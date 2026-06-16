import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { deleteNewsItem } from '../_actions/news';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default async function NewsPage() {
  const sb = await createSupabaseServerClient();
  const { data: items } = await sb.from('news_items').select('*').order('published_date', { ascending: false });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e' }}>News</h1>
        <Link href="/admin/news/new" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#d81818', color: '#fff', padding: '9px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          <Plus size={15} /> Add news
        </Link>
      </div>

      {!items?.length ? (
        <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 12, padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
          No news items yet. Click "Add news" to create your first one.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1a2e' }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>{new Date(item.published_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8, lineHeight: 1.5 }}>{item.content.slice(0, 120)}{item.content.length > 120 ? '…' : ''}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Link href={`/admin/news/${item.id}`} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: '#f3f4f6', border: '1px solid #e2e5ea', borderRadius: 7, textDecoration: 'none', fontSize: 13, color: '#374151' }}>
                  <Pencil size={13} /> Edit
                </Link>
                <form action={async () => { 'use server'; await deleteNewsItem(item.id); }}>
                  <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 7, fontSize: 13, color: '#dc2626', cursor: 'pointer' }}>
                    <Trash2 size={13} /> Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
