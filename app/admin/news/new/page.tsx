import { createNewsItem } from '../../_actions/news';
import Link from 'next/link';

export default function NewNewsPage() {
  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Link href="/admin/news" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← News</Link>
        <span style={{ color: '#d1d5db' }}>/</span>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>New article</h1>
      </div>
      <form action={createNewsItem} encType="multipart/form-data" style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <NewsFormFields />
        <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
          <button type="submit" style={{ background: '#d81818', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Publish
          </button>
          <Link href="/admin/news" style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: '#f3f4f6', borderRadius: 8, textDecoration: 'none', fontSize: 14, color: '#374151' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export function NewsFormFields({ defaultValues }: { defaultValues?: { title: string; published_date: string; content: string } }) {
  return (
    <>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Title</label>
        <input name="title" required defaultValue={defaultValues?.title}
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Date</label>
        <input name="published_date" type="date" required defaultValue={defaultValues?.published_date ?? new Date().toISOString().split('T')[0]}
          style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Content</label>
        <textarea name="content" required rows={5} defaultValue={defaultValues?.content}
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Photo <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span></label>
        <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8, marginTop: 0 }}>This image appears at the top of the article when someone opens it.</p>
        <input name="image" type="file" accept="image/*"
          style={{ fontSize: 13, color: '#374151' }} />
      </div>
    </>
  );
}
