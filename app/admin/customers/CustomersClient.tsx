"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, ImageIcon, Loader2, AlertCircle, Check, X, Upload } from "lucide-react";

type Customer = {
  id: string;
  name: string;
  short: string;
  sector: string;
  logo_url: string;
  order_index: number;
  created_at: string;
};

function CustomerRow({ customer, onDeleted }: { customer: Customer; onDeleted: (id: string) => void }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Remove "${customer.name}" from the customers list on the website?`)) return;
    setDeleting(true);
    await fetch(`/api/admin/customers/${customer.id}`, { method: 'DELETE' });
    onDeleted(customer.id);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', borderBottom: '1px solid #f3f4f6' }}>
      {/* Logo */}
      <div style={{ width: 72, height: 40, flexShrink: 0, background: '#f8f9fa', borderRadius: 8, border: '1px solid #e2e5ea', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {customer.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={customer.logo_url} alt="" style={{ maxWidth: 68, maxHeight: 36, objectFit: 'contain' }} />
        ) : (
          <ImageIcon size={18} style={{ color: '#d1d5db' }} />
        )}
      </div>

      {/* Name + sector */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.name}</div>
        <div style={{ fontSize: 12.5, color: '#9ca3af', marginTop: 2 }}>{customer.sector}</div>
      </div>

      {/* Short name badge */}
      {customer.short && (
        <div style={{ fontSize: 11.5, fontWeight: 600, color: '#6b7280', background: '#f3f4f6', borderRadius: 6, padding: '3px 9px', flexShrink: 0 }}>
          {customer.short}
        </div>
      )}

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        title="Remove customer"
        style={{ padding: '7px 9px', background: '#fff', border: '1px solid #fecaca', borderRadius: 8, cursor: deleting ? 'not-allowed' : 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', flexShrink: 0 }}
      >
        {deleting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
      </button>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function AddCustomerModal({ onAdded, onClose }: { onAdded: (c: Customer) => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true); setErr('');
    const fd = new FormData(form);
    const res = await fetch('/api/admin/customers', { method: 'POST', body: fd });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setErr(data.error ?? 'Something went wrong'); return; }
    setSuccess(true);
    onAdded(data as Customer);
    form.reset();
    setTimeout(() => { setSuccess(false); onClose(); }, 1200);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, boxShadow: '0 24px 80px rgba(0,0,0,.2)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e' }}>Add a customer</div>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#6b7280' }}><X size={16} /></button>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {err && (
            <div style={{ display: 'flex', gap: 7, alignItems: 'center', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
              <AlertCircle size={14} /> {err}
            </div>
          )}
          {success && (
            <div style={{ display: 'flex', gap: 7, alignItems: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
              <Check size={14} /> Customer added!
            </div>
          )}

          <div>
            <label style={labelStyle}>Full company name *</label>
            <input name="name" required placeholder="e.g. Tamil Nadu Electricity Board" style={inputStyle} />
            <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 4 }}>This is shown on the Customers page.</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Short name</label>
              <input name="short" placeholder="e.g. TNEB" style={inputStyle} />
              <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 4 }}>Abbreviation shown on the card.</div>
            </div>
            <div>
              <label style={labelStyle}>Sector / industry *</label>
              <input name="sector" required placeholder="e.g. Power Utility" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Company logo *</label>
            <div style={{ border: '2px dashed #e2e5ea', borderRadius: 10, padding: '14px 16px', background: '#fafafa' }}>
              <input type="file" name="logo" accept="image/*" required style={{ fontSize: 13, color: '#374151', cursor: 'pointer', width: '100%' }} />
              <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 6 }}>PNG or JPG. White background logos work best.</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', background: loading || success ? '#9ca3af' : '#1a1a2e', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}
          >
            {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : success ? <Check size={15} /> : <Upload size={15} />}
            {loading ? 'Adding…' : success ? 'Added!' : 'Add customer'}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 13px', border: '1.5px solid #e2e5ea', borderRadius: 9, fontSize: 13.5, color: '#1a1a2e', background: '#fff', boxSizing: 'border-box' };

export default function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', marginBottom: 6, letterSpacing: '-0.01em' }}>Customers</h1>
          <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
            These companies are listed on the <b>Customers page</b> of the website with their logo. Add or remove them here.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
        >
          <Plus size={16} /> Add customer
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>{customers.length}</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 5 }}>Customers listed</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>
            {[...new Set(customers.map(c => c.sector))].length}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 5 }}>Different sectors</div>
        </div>
      </div>

      {/* Customer list */}
      <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '14px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>All customers</span>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>Shown on the website in this order</span>
        </div>

        {customers.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
            No customers added yet. Click &quot;Add customer&quot; to add the first one.
          </div>
        ) : (
          customers.map(c => (
            <CustomerRow key={c.id} customer={c} onDeleted={id => setCustomers(prev => prev.filter(x => x.id !== id))} />
          ))
        )}
      </div>

      <div style={{ marginTop: 16, padding: '12px 16px', background: '#f8f9fa', borderRadius: 10, fontSize: 12.5, color: '#6b7280', lineHeight: 1.6 }}>
        Note: If the customers list here is empty, the website will automatically show the original built-in customer list. Once you add at least one customer here, only the customers in this list will be shown.
      </div>

      {showModal && (
        <AddCustomerModal
          onAdded={c => setCustomers(prev => [...prev, c])}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
