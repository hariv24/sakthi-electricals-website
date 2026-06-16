'use client';
import { useTransition } from 'react';
import { Trash2, Loader } from 'lucide-react';

export default function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => action())}
      disabled={pending}
      title="Reject & delete"
      className="admin-icon-btn"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 32, height: 32,
        background: pending ? '#f3f4f6' : '#fef2f2',
        border: `1px solid ${pending ? '#e5e7eb' : '#fecaca'}`,
        borderRadius: 8,
        cursor: pending ? 'not-allowed' : 'pointer',
        color: pending ? '#9ca3af' : '#dc2626',
        transition: 'all 140ms ease',
      }}
    >
      {pending
        ? <Loader size={14} style={{ animation: 'spin 700ms linear infinite' }} />
        : <Trash2 size={14} />
      }
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </button>
  );
}
