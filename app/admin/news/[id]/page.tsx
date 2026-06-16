import { createSupabaseServerClient } from '@/lib/supabase/server';
import { updateNewsItem } from '../../_actions/news';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await createSupabaseServerClient();
  const { data: item } = await sb.from('news_items').select('*').eq('id', id).single();
  if (!item) notFound();

  const action = async (formData: FormData) => {
    'use server';
    await updateNewsItem(id, formData);
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Link href="/admin/news" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← News</Link>
        <span style={{ color: '#d1d5db' }}>/</span>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>Edit article</h1>
      </div>
      <form action={action} encType="multipart/form-data" style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Title</label>
          <input name="title" required defaultValue={item.title}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Date</label>
          <input name="published_date" type="date" required defaultValue={item.published_date}
            style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Content</label>
          <textarea name="content" required rows={5} defaultValue={item.content}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Photo <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span></label>
          {item.image_url && (
            <div style={{ marginBottom: 8 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt="" style={{ maxWidth: 200, maxHeight: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e5ea', display: 'block' }} />
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0' }}>Current photo — upload a new one below to replace it.</p>
            </div>
          )}
          <input name="image" type="file" accept="image/*"
            style={{ fontSize: 13, color: '#374151' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
          <button type="submit" style={{ background: '#d81818', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Save changes
          </button>
          <Link href="/admin/news" style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: '#f3f4f6', borderRadius: 8, textDecoration: 'none', fontSize: 14, color: '#374151' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
