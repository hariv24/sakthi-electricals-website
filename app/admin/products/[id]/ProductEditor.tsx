'use client';
import { useState, useRef } from 'react';
import {
  updateNode, saveSpecs, saveOverview, saveApplications,
  saveVideo, deleteImage, setHeroImage, reorderImages, uploadProductImage,
} from '../../_actions/products';
import {
  Gauge, Shield, Zap, BarChart2, Cable, Factory, Wrench,
  Cpu, Activity, Sun, Layers, Settings, Package, Wind,
  Trash2, Plus, Upload, Check, Loader, Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

/* ── Icon system ────────────────────────────────────────────────────────────── */

const ICONS = [
  { name: 'Zap',      Component: Zap },
  { name: 'Gauge',    Component: Gauge },
  { name: 'Shield',   Component: Shield },
  { name: 'BarChart2',Component: BarChart2 },
  { name: 'Cable',    Component: Cable },
  { name: 'Factory',  Component: Factory },
  { name: 'Wrench',   Component: Wrench },
  { name: 'Cpu',      Component: Cpu },
  { name: 'Activity', Component: Activity },
  { name: 'Sun',      Component: Sun },
  { name: 'Layers',   Component: Layers },
  { name: 'Settings', Component: Settings },
  { name: 'Package',  Component: Package },
  { name: 'Wind',     Component: Wind },
];

function IconEl({ name, size = 22 }: { name: string; size?: number }) {
  const found = ICONS.find(i => i.name === name);
  const C = found ? found.Component : Zap;
  return <C size={size} strokeWidth={1.5} />;
}

/* ── Types ──────────────────────────────────────────────────────────────────── */
type Node = { id: string; name: string; slug: string; is_leaf: boolean; cover_image_url: string | null };
type Img  = { id: string; url: string; order_index: number };
type Spec = { id?: string; label: string; value: string };
type Overview = { heading: string; paragraph_1: string } | null;
type AppRow = { id?: string; icon_name: string; title: string; body: string };
type Video = { youtube_url: string } | null;

/* ── Helpers ────────────────────────────────────────────────────────────────── */

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>{title}</div>
  );
}

function IconPicker({ selected, onSelect }: { selected: string; onSelect: (n: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button type="button" onClick={() => setOpen(o => !o)} title="Change icon"
        style={{ width: 44, height: 44, background: open ? '#f0f4ff' : '#f8f9fa', border: `1.5px solid ${open ? '#bfdbfe' : '#e2e5ea'}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1a1a2e', transition: 'all 140ms' }}>
        <IconEl name={selected} size={20} />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 50, background: '#fff', border: '1px solid #e2e5ea', borderRadius: 12, padding: 10, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, boxShadow: '0 8px 32px rgba(0,0,0,.12)', width: 252 }}>
            {ICONS.map(({ name, Component }) => (
              <button key={name} type="button" onClick={() => { onSelect(name); setOpen(false); }} title={name}
                style={{ width: 32, height: 32, background: selected === name ? '#eff6ff' : 'transparent', border: selected === name ? '1.5px solid #bfdbfe' : '1.5px solid transparent', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: selected === name ? '#2563eb' : '#374151', transition: 'all 120ms' }}>
                <Component size={16} strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */

export default function ProductEditor({ node, images, specs, overview, applications, video }: {
  node: Node; images: Img[]; specs: Spec[]; overview: Overview;
  applications: (AppRow & { id?: string })[]; video: Video;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Gallery state ─────────────────────────────────────────────────────────
  const [localImages, setLocalImages] = useState<Img[]>(images);
  const [heroUrl, setHeroUrl] = useState(node.cover_image_url ?? images[0]?.url ?? '');
  const [uploading, setUploading] = useState(false);
  const dragIdx = useRef<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  // ── Content state ─────────────────────────────────────────────────────────
  const [nameValue, setNameValue] = useState(node.name);
  const [specRows, setSpecRows] = useState<Spec[]>(specs.length ? specs : [{ label: '', value: '' }]);
  const [videoUrl, setVideoUrl] = useState(video?.youtube_url ?? '');
  const [ov, setOv] = useState({ heading: overview?.heading ?? '', paragraph_1: overview?.paragraph_1 ?? '' });
  const defaultApps: AppRow[] = applications.length
    ? applications.map(a => ({ id: a.id, icon_name: a.icon_name ?? 'Zap', title: a.title, body: a.body }))
    : [{ icon_name: 'Zap', title: '', body: '' }];
  const [apps, setApps] = useState<AppRow[]>(defaultApps);

  // ── Single save state ─────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Drag helpers ──────────────────────────────────────────────────────────
  function handleDragStart(i: number) {
    dragIdx.current = i;
    setDragging(i);
  }

  function handleDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    const from = dragIdx.current;
    if (from === null || from === i) return;
    setLocalImages(prev => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(i, 0, item);
      dragIdx.current = i;
      return arr;
    });
    setDragging(i);
  }

  async function handleDrop() {
    dragIdx.current = null;
    setDragging(null);
    await reorderImages(localImages.map((img, i) => ({ id: img.id, order_index: i })));
  }

  // ── Upload ────────────────────────────────────────────────────────────────
  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('nodeId', node.id);
      fd.append('orderIndex', String(localImages.length));
      const row = await uploadProductImage(fd);
      if (row) setLocalImages(prev => [...prev, row]);
    }
    setUploading(false);
    router.refresh();
  }

  async function handleSetHero(url: string) {
    await setHeroImage(node.id, url);
    setHeroUrl(url);
  }

  async function handleDeleteImage(img: Img) {
    await deleteImage(img.id, node.id);
    setLocalImages(prev => prev.filter(i => i.id !== img.id));
    if (heroUrl === img.url) setHeroUrl(localImages.find(i => i.id !== img.id)?.url ?? '');
  }

  // ── Save all ──────────────────────────────────────────────────────────────
  async function handleSaveAll() {
    setSaving(true);
    const fd = new FormData();
    fd.append('name', nameValue);
    const jobs: Promise<unknown>[] = [
      updateNode(node.id, fd),
    ];
    if (node.is_leaf) {
      jobs.push(
        saveSpecs(node.id, specRows.filter(r => r.label && r.value)),
        saveVideo(node.id, videoUrl),
        saveOverview(node.id, { heading: ov.heading, paragraph_1: ov.paragraph_1, paragraph_2: '' }),
        saveApplications(node.id, apps.filter(a => a.title && a.body)),
      );
    }
    await Promise.all(jobs);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      <style>{`
        .img-card:hover .img-actions { opacity: 1 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 800ms linear infinite; }
      `}</style>

      {/* Name */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
          Product name
        </label>
        <input
          value={nameValue}
          onChange={e => setNameValue(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #d1d5db', borderRadius: 9, fontSize: 15, boxSizing: 'border-box', fontWeight: 600 }}
        />
      </div>

      {node.is_leaf && (
        <>
          {/* ── Two-column: Gallery | Specs ─────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '55% 1fr', gap: 32, alignItems: 'start', marginBottom: 28 }} className="product-editor-grid">

            {/* Left: Gallery */}
            <div>
              <SectionHeader title="Photos" />
              {localImages.length > 0 && (
                <div style={{ aspectRatio: '4/3', background: '#f8f9fa', border: '1.5px solid #e2e5ea', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden', padding: 24 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroUrl || localImages[0]?.url}
                    alt=""
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
                  />
                </div>
              )}
              {localImages.length === 0 && (
                <div style={{ aspectRatio: '4/3', background: '#f8f9fa', border: '2px dashed #d1d5db', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>No photos yet</p>
                </div>
              )}

              {/* Thumbnail strip: draggable */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {localImages.map((img, i) => {
                  const isHero = img.url === heroUrl;
                  const isDragged = dragging === i;
                  return (
                    <div
                      key={img.id}
                      className="img-card"
                      draggable
                      onDragStart={() => handleDragStart(i)}
                      onDragOver={e => handleDragOver(e, i)}
                      onDrop={handleDrop}
                      onDragEnd={() => { dragIdx.current = null; setDragging(null); }}
                      onClick={() => setHeroUrl(img.url)}
                      style={{ position: 'relative', width: 72, height: 72, background: '#f8f9fa', border: `2px solid ${isHero ? '#d81818' : isDragged ? '#bfdbfe' : '#e2e5ea'}`, borderRadius: 9, overflow: 'hidden', cursor: 'grab', flexShrink: 0, opacity: isDragged ? 0.5 : 1, transition: 'opacity 140ms, border-color 140ms' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
                      <div className="img-actions" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, opacity: 0, transition: 'opacity 150ms' }}>
                        <button type="button" onClick={e => { e.stopPropagation(); handleSetHero(img.url); }} title="Set as cover photo"
                          style={{ background: isHero ? '#fbbf24' : 'rgba(255,255,255,.9)', border: 'none', borderRadius: 4, padding: 3, cursor: 'pointer', display: 'flex', color: isHero ? '#fff' : '#374151' }}>
                          <Star size={11} fill={isHero ? 'currentColor' : 'none'} />
                        </button>
                        <button type="button" onClick={e => { e.stopPropagation(); handleDeleteImage(img); }} title="Delete"
                          style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: 3, cursor: 'pointer', display: 'flex', color: '#dc2626' }}>
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  style={{ width: 72, height: 72, background: '#f8f9fa', border: '2px dashed #d1d5db', borderRadius: 9, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, cursor: 'pointer', color: '#9ca3af', fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
                  {uploading ? <Loader size={16} className="spin" /> : <Upload size={16} />}
                  {uploading ? '' : 'Add'}
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleUpload(e.target.files)} />
              {localImages.length > 1 && (
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>Drag thumbnails to reorder · Click thumbnail to preview · Star = cover photo</p>
              )}

              {/* YouTube URL */}
              <div style={{ marginTop: 20 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>YouTube video (optional)</label>
                <input
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }}
                />
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Appears as an embedded video on the product page. Leave blank to remove.</p>
              </div>
            </div>

            {/* Right: Specs */}
            <div>
              <SectionHeader title="Specifications" />
              <div style={{ background: '#fff', border: '1.5px solid #e2e5ea', borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ background: '#f8f9fa', borderBottom: '1px solid #e2e5ea', display: 'grid', gridTemplateColumns: '1fr 1fr 36px' }}>
                  <div style={{ padding: '8px 12px', fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>Label</div>
                  <div style={{ padding: '8px 12px', fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>Value</div>
                  <div />
                </div>
                {specRows.map((row, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 36px', borderBottom: '1px solid #f3f4f6' }}>
                    <input value={row.label} onChange={e => setSpecRows(r => r.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                      placeholder="e.g. Standard"
                      style={{ padding: '9px 12px', border: 'none', borderRight: '1px solid #f3f4f6', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                    <input value={row.value} onChange={e => setSpecRows(r => r.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
                      placeholder="e.g. IS 2705"
                      style={{ padding: '9px 12px', border: 'none', borderRight: '1px solid #f3f4f6', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                    <button type="button" onClick={() => setSpecRows(r => r.filter((_, j) => j !== i))}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setSpecRows(r => [...r, { label: '', value: '' }])}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: '#f3f4f6', border: '1px solid #e2e5ea', borderRadius: 7, fontSize: 12, cursor: 'pointer', color: '#374151' }}>
                <Plus size={12} /> Add row
              </button>
            </div>
          </div>

          {/* ── Overview ──────────────────────────────────────────────── */}
          <div style={{ background: '#fff', border: '1.5px solid #e2e5ea', borderRadius: 12, marginBottom: 20 }}>
            <div style={{ padding: '14px 20px', background: '#f8f9fa', borderBottom: '1px solid #e2e5ea' }}>
              <SectionHeader title="Overview text" />
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Bold heading</label>
                <input value={ov.heading} onChange={e => setOv(o => ({ ...o, heading: e.target.value }))}
                  placeholder="One sentence that leads the overview section…"
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontWeight: 600 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Overview paragraph</label>
                <textarea value={ov.paragraph_1} onChange={e => setOv(o => ({ ...o, paragraph_1: e.target.value }))} rows={5}
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.65 }} />
              </div>
            </div>
          </div>

          {/* ── Applications ──────────────────────────────────────────── */}
          <div style={{ background: '#fff', border: '1.5px solid #e2e5ea', borderRadius: 12, marginBottom: 20 }}>
            <div style={{ padding: '14px 20px', background: '#f8f9fa', borderBottom: '1px solid #e2e5ea' }}>
              <SectionHeader title="Applications (up to 4)" />
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, marginTop: 2 }}>These show as cards on the product page. Click the icon to change it.</p>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                {apps.map((app, i) => (
                  <div key={i} style={{ background: '#f8f9fa', border: '1.5px solid #e2e5ea', borderRadius: 10, padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <IconPicker selected={app.icon_name} onSelect={n => setApps(a => a.map((x, j) => j === i ? { ...x, icon_name: n } : x))} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Application {i + 1}</span>
                      </div>
                      <button type="button" onClick={() => setApps(a => a.filter((_, j) => j !== i))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <input value={app.title} onChange={e => setApps(a => a.map((x, j) => j === i ? { ...x, title: e.target.value } : x))}
                      placeholder="Title (e.g. HT Substations)"
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 7, fontSize: 13, marginBottom: 8, boxSizing: 'border-box' }} />
                    <textarea value={app.body} onChange={e => setApps(a => a.map((x, j) => j === i ? { ...x, body: e.target.value } : x))}
                      placeholder="Description of this application…" rows={3}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 7, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.55 }} />
                  </div>
                ))}
              </div>
              {apps.length < 4 && (
                <button type="button" onClick={() => setApps(a => [...a, { icon_name: 'Zap', title: '', body: '' }])}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', background: '#f3f4f6', border: '1px solid #e2e5ea', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                  <Plus size={13} /> Add application
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {!node.is_leaf && (
        <div style={{ background: '#fff', border: '1.5px solid #e2e5ea', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>This is a folder, not a product. The name above is the only thing to edit. Products inside this folder can be edited individually.</p>
        </div>
      )}

      {/* ── Single save button ────────────────────────────────────────── */}
      <div style={{ paddingTop: 20, borderTop: '1.5px solid #e2e5ea', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: saved ? '#16a34a' : '#d81818',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '12px 28px', fontSize: 15, fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
            transition: 'background 220ms',
          }}
        >
          {saving ? <Loader size={15} className="spin" /> : saved ? <Check size={15} /> : null}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save all changes'}
        </button>
      </div>

      <style>{`@media(max-width:820px){.product-editor-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
