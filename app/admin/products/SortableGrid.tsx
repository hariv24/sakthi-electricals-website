'use client';
import { useState, useRef, useTransition } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, FolderOpen, GripVertical } from 'lucide-react';
import { deleteNode, reorderNodes } from '../_actions/products';

type DBNode = {
  id: string; parent_id: string | null; name: string; slug: string;
  is_leaf: boolean; order_index: number; cover_image_url: string | null;
};

const PLACEHOLDER = '/placeholder-product.svg';

export default function SortableGrid({ nodes }: { nodes: DBNode[] }) {
  const [items, setItems] = useState(nodes);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [savePending, startSave] = useTransition();
  const dragId = useRef<string | null>(null);

  function handleDragStart(id: string) {
    dragId.current = id;
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (dragId.current !== id) setDragOver(id);
  }

  function handleDrop(targetId: string) {
    setDragOver(null);
    if (!dragId.current || dragId.current === targetId) return;
    const from = items.findIndex(i => i.id === dragId.current);
    const to = items.findIndex(i => i.id === targetId);
    if (from === -1 || to === -1) return;
    const next = [...items];
    next.splice(to, 0, next.splice(from, 1)[0]);
    setItems(next);
    startSave(() => reorderNodes(next.map(i => i.id)));
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 16,
        opacity: savePending ? 0.65 : 1,
        transition: 'opacity 200ms',
      }}
    >
      {items.map(node => {
        const isOver = dragOver === node.id;
        return (
          <div
            key={node.id}
            draggable
            onDragStart={() => handleDragStart(node.id)}
            onDragOver={e => handleDragOver(e, node.id)}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => handleDrop(node.id)}
            onDragEnd={() => { setDragOver(null); dragId.current = null; }}
            style={{
              background: '#fff',
              border: `1px solid ${isOver ? '#d81818' : '#e2e5ea'}`,
              borderRadius: 14,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'grab',
              boxShadow: isOver ? '0 0 0 3px rgba(216,24,24,.12)' : 'none',
              transition: 'border-color 120ms, box-shadow 120ms',
            }}
          >
            {/* Drag handle */}
            <div style={{ padding: '7px 10px 0', display: 'flex', justifyContent: 'flex-end' }}>
              <GripVertical size={13} color="#c4c9d0" />
            </div>

            {/* Thumbnail */}
            {node.is_leaf ? (
              <Link href={`/admin/products/${node.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={node.cover_image_url ?? PLACEHOLDER}
                  alt={node.name}
                  style={{ width: '100%', aspectRatio: '4/3', objectFit: 'contain', background: '#f8f9fa', padding: 16, display: 'block' }}
                />
              </Link>
            ) : (
              <Link href={`/admin/products?parent=${node.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ width: '100%', aspectRatio: '4/3', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {node.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={node.cover_image_url} alt={node.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} />
                  ) : (
                    <FolderOpen size={40} color="#3b82f6" strokeWidth={1.5} />
                  )}
                </div>
              </Link>
            )}

            {/* Card body */}
            <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{
                display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 7px',
                borderRadius: 99,
                background: node.is_leaf ? '#f0fdf4' : '#eff6ff',
                color: node.is_leaf ? '#16a34a' : '#2563eb',
                border: `1px solid ${node.is_leaf ? '#bbf7d0' : '#bfdbfe'}`,
                textTransform: 'uppercase', letterSpacing: '.04em',
              }}>
                {node.is_leaf ? 'Product' : 'Folder'}
              </span>

              <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', margin: 0, lineHeight: 1.3 }}>
                {node.name}
              </p>

              <div style={{ display: 'flex', gap: 6, marginTop: 'auto', alignItems: 'stretch' }}>
                {node.is_leaf ? (
                  <Link href={`/admin/products/${node.id}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: '#1a1a2e', color: '#fff', borderRadius: 7, padding: '7px 10px', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                    <Pencil size={11} /> Edit product
                  </Link>
                ) : (
                  <Link href={`/admin/products?parent=${node.id}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 7, padding: '7px 10px', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                    <FolderOpen size={11} /> Open folder
                  </Link>
                )}
                <form action={deleteNode.bind(null, node.id)} style={{ display: 'flex' }}>
                  <button type="submit" className="admin-icon-btn" style={{ display: 'flex', alignItems: 'center', padding: '0 8px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 7, cursor: 'pointer', color: '#dc2626' }}>
                    <Trash2 size={12} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
