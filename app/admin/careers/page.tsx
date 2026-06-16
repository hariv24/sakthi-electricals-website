export const dynamic = 'force-dynamic';

import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { Mail, Phone, Briefcase, Clock, User, FileText } from 'lucide-react';
import DeleteButton from './DeleteButton';

type Application = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  experience: string | null;
  message: string | null;
  resume_url: string | null;
  created_at: string;
};

async function deleteApplication(id: string) {
  'use server';
  const admin = await createSupabaseAdminClient();
  await admin.from('career_applications').delete().eq('id', id);
  revalidatePath('/admin/careers');
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default async function CareersAdminPage() {
  console.log('[GET /admin/careers] loading applications');

  const admin = await createSupabaseAdminClient();
  const { data, error } = await admin
    .from('career_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('[GET /admin/careers] error:', error.message);

  const applications = (data ?? []) as Application[];

  console.log('[GET /admin/careers] loaded', applications.length, 'applications');

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Career Applications</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4, marginBottom: 0 }}>
          {applications.length} {applications.length === 1 ? 'application' : 'applications'} received
        </p>
      </div>

      {/* Empty state */}
      {applications.length === 0 && (
        <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, padding: 64, textAlign: 'center' }}>
          <Briefcase size={40} color="#d1d5db" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>No applications yet</h2>
          <p style={{ fontSize: 14, color: '#6b7280' }}>When someone submits the careers form, it will appear here.</p>
        </div>
      )}

      {/* Application cards */}
      {applications.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {applications.map(app => (
            <div key={app.id} style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 14, padding: '20px 24px' }}>

              {/* Top row — name + date + delete */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0f4ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={18} color="#2563eb" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>{app.name}</div>
                    <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: '#fef2f2', color: '#d81818', border: '1px solid #fecaca', textTransform: 'uppercase', letterSpacing: '.04em', marginTop: 3 }}>
                      {app.role}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#9ca3af', fontSize: 12 }}>
                    <Clock size={12} />
                    {formatDate(app.created_at)}
                  </div>
                  <DeleteButton action={deleteApplication.bind(null, app.id)} />
                </div>
              </div>

              {/* Contact + experience + resume row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: app.message ? 14 : 0 }}>
                <a href={`mailto:${app.email}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>
                  <Mail size={13} /> {app.email}
                </a>
                <a href={`tel:${app.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151', textDecoration: 'none' }}>
                  <Phone size={13} /> {app.phone}
                </a>
                {app.experience && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
                    <Briefcase size={13} /> {app.experience}
                  </span>
                )}
                {app.resume_url && (
                  <a href={app.resume_url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#16a34a', textDecoration: 'none', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '3px 10px' }}>
                    <FileText size={13} /> Download resume
                  </a>
                )}
              </div>

              {/* Message */}
              {app.message && (
                <div style={{ background: '#f8f9fa', border: '1px solid #e2e5ea', borderRadius: 8, padding: '12px 14px' }}>
                  <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.65, margin: 0 }}>{app.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
