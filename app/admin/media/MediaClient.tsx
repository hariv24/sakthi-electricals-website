"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, RotateCcw, Plus, Trash2, ImageIcon, Video, Check, Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

type MediaSlot = {
  key: string;
  url: string;
  updatedAt: string | null;
  isCustom: boolean;
  label: string;
  hint: string;
  isVideo: boolean;
  defaultUrl: string;
};

type Customer = {
  id: string;
  name: string;
  short: string;
  sector: string;
  logo_url: string;
  order_index: number;
  created_at: string;
};

function MediaCard({ slot, onUpdated }: { slot: MediaSlot; onUpdated: (key: string, url: string, isCustom: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState('');
  const [current, setCurrent] = useState(slot);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setLoading(true); setErr(''); setSuccess(false);
    const fd = new FormData();
    fd.append('key', slot.key);
    fd.append('file', file);
    const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setErr(data.error ?? 'Upload failed'); return; }
    setSuccess(true);
    const updated = { ...current, url: data.url, isCustom: true, updatedAt: new Date().toISOString() };
    setCurrent(updated);
    onUpdated(slot.key, data.url, true);
    setTimeout(() => setSuccess(false), 3000);
  }

  async function handleReset() {
    if (!confirm('Reset this to the original default file?')) return;
    setLoading(true); setErr('');
    const res = await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: slot.key }) });
    setLoading(false);
    if (!res.ok) { setErr('Reset failed'); return; }
    const updated = { ...current, url: slot.defaultUrl, isCustom: false, updatedAt: null };
    setCurrent(updated);
    onUpdated(slot.key, slot.defaultUrl, false);
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, overflow: 'hidden' }}>
      {/* Preview */}
      <div style={{ position: 'relative', background: '#f3f4f6', height: 160, overflow: 'hidden' }}>
        {current.isVideo ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 8 }}>
            <Video size={32} style={{ color: '#6b7280' }} />
            <span style={{ fontSize: 12, color: '#9ca3af' }}>Video file</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.url}
            alt={current.label}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        {current.isCustom && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: '#16a34a', color: '#fff', fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 99, letterSpacing: '.05em' }}>
            CUSTOM
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{current.label}</div>
        <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5, marginBottom: 12 }}>{slot.hint}</div>

        {err && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '8px 12px', fontSize: 12.5, marginBottom: 10 }}>
            <AlertCircle size={13} /> {err}
          </div>
        )}
        {success && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', borderRadius: 8, padding: '8px 12px', fontSize: 12.5, marginBottom: 10 }}>
            <Check size={13} /> Uploaded successfully
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            ref={inputRef}
            type="file"
            accept={current.isVideo ? 'video/mp4,video/*' : 'image/*'}
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
            {loading ? 'Uploading…' : 'Upload new'}
          </button>
          {current.isCustom && (
            <button
              onClick={handleReset}
              disabled={loading}
              title="Reset to default"
              style={{ padding: '9px 10px', background: '#f3f4f6', border: '1px solid #e2e5ea', borderRadius: 9, cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function CustomerRow({ customer, onDeleted }: { customer: Customer; onDeleted: (id: string) => void }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Remove "${customer.name}" from the customers list?`)) return;
    setLoading(true);
    await fetch(`/api/admin/customers/${customer.id}`, { method: 'DELETE' });
    setLoading(false);
    onDeleted(customer.id);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: '1px solid #f3f4f6' }}>
      <div style={{ width: 56, height: 32, flexShrink: 0, background: '#f8f9fa', borderRadius: 6, border: '1px solid #e2e5ea', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {customer.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={customer.logo_url} alt="" style={{ maxWidth: 54, maxHeight: 30, objectFit: 'contain' }} />
        ) : (
          <ImageIcon size={16} style={{ color: '#d1d5db' }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.name}</div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>{customer.sector}</div>
      </div>
      <button
        onClick={handleDelete}
        disabled={loading}
        style={{ padding: '6px 8px', background: 'transparent', border: '1px solid #fecaca', borderRadius: 7, cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}
      >
        {loading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={13} />}
      </button>
    </div>
  );
}

function AddCustomerForm({ onAdded }: { onAdded: (c: Customer) => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true); setErr('');
    const fd = new FormData(form);
    const res = await fetch('/api/admin/customers', { method: 'POST', body: fd });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setErr(data.error ?? 'Failed to add customer'); return; }
    onAdded(data as Customer);
    form.reset();
    setOpen(false);
  }

  return (
    <div style={{ borderTop: '1px solid #f3f4f6' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '14px 20px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: '#2563eb' }}
      >
        {open ? <ChevronUp size={15} /> : <Plus size={15} />}
        {open ? 'Cancel' : 'Add customer'}
      </button>
      {open && (
        <form onSubmit={handleSubmit} style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {err && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '8px 12px', fontSize: 12.5 }}>
              <AlertCircle size={13} /> {err}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Company name *</label>
              <input name="name" required placeholder="e.g. TNEB" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Short name</label>
              <input name="short" placeholder="e.g. TNEB" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Sector *</label>
            <input name="sector" required placeholder="e.g. Power Utility" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Logo image *</label>
            <input ref={fileRef} type="file" name="logo" accept="image/*" required style={{ ...inputStyle, padding: '8px 12px', cursor: 'pointer' }} />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 16px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />}
            {loading ? 'Adding…' : 'Add customer'}
          </button>
        </form>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 5 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1.5px solid #e2e5ea', borderRadius: 8, fontSize: 13.5, color: '#1a1a2e', background: '#fff', boxSizing: 'border-box' };

export default function MediaClient({ initialSlots, initialCustomers }: { initialSlots: MediaSlot[]; initialCustomers: Customer[] }) {
  const [slots, setSlots] = useState(initialSlots);
  const [customers, setCustomers] = useState(initialCustomers);

  const handleSlotUpdated = useCallback((key: string, url: string, isCustom: boolean) => {
    setSlots(prev => prev.map(s => s.key === key ? { ...s, url, isCustom, updatedAt: new Date().toISOString() } : s));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', marginBottom: 6, letterSpacing: '-0.01em' }}>Site Media</h1>
        <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>Manage all images and videos across the website. Upload a new file to replace the current one.</p>
      </div>

      {/* Media grid */}
      <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e5ea' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Images &amp; Video</span>
          <span style={{ marginLeft: 8, fontSize: 12, color: '#9ca3af' }}>{slots.filter(s => s.isCustom).length} of {slots.length} customised</span>
        </div>
        <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {slots.map(slot => (
            <MediaCard key={slot.key} slot={slot} onUpdated={handleSlotUpdated} />
          ))}
        </div>
      </div>

      {/* Customers */}
      <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e5ea', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Customers</span>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{customers.length} listed</span>
        </div>
        {customers.length === 0 && (
          <p style={{ padding: '20px 20px 0', fontSize: 13.5, color: '#9ca3af', margin: 0 }}>No customers yet — add them below. They will appear on the Customers page of the website.</p>
        )}
        {customers.map(c => (
          <CustomerRow key={c.id} customer={c} onDeleted={id => setCustomers(prev => prev.filter(x => x.id !== id))} />
        ))}
        <AddCustomerForm onAdded={c => setCustomers(prev => [...prev, c])} />
      </div>

      <div style={{ marginTop: 20, padding: '14px 18px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>
        <b>Note:</b> After uploading a new image or video, the live website will show it within a few seconds — no redeployment needed. If you don&apos;t see the change, try a hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac).
      </div>
    </div>
  );
}
