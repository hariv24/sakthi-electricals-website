"use client";

import { useState, useRef } from "react";
import {
  Upload, RotateCcw, Video, Check, Loader2, AlertCircle,
  ImageIcon, X, RefreshCw, Info,
} from "lucide-react";
import { MEDIA_ASPECTS } from "@/lib/mediaAspects";
import ImageCropModal from "./ImageCropModal";

// ─── Types ───────────────────────────────────────────────────────────────────

type MediaSlot = {
  key: string;
  url: string;
  isCustom: boolean;
  isVideo: boolean;
  defaultUrl: string;
};

type SlotDef = {
  key: string;
  label: string;
  desc: string;
  isVideo?: boolean;
};

type PageSection = {
  page: string;
  description: string;
  slots: SlotDef[];
};

type GalleryItem = { name: string; url: string };

// ─── Page sections — the human-readable structure ───────────────────────────

const PAGE_SECTIONS: PageSection[] = [
  {
    page: "Homepage",
    description: "The first page visitors see when they open the website.",
    slots: [
      {
        key: "hero_video",
        label: "Background Video",
        desc: "The video playing in the background at the very top of the homepage. Upload an MP4 file.",
        isVideo: true,
      },
      {
        key: "about_home",
        label: "About Section — Photo",
        desc: 'The photo on the right side of the "About Sakthi Electricals" block on the homepage.',
      },
    ],
  },
  {
    page: "About Page",
    description: 'The "About Us" page at /about.',
    slots: [
      {
        key: "about_banner",
        label: "Top Banner Photo",
        desc: "The full-width photo at the very top of the About page.",
      },
      {
        key: "cpri_image",
        label: "CPRI Quality Section — Photo",
        desc: 'The photo next to the "Tested by CPRI, Bangalore" block on the About page.',
      },
    ],
  },
  {
    page: "Products Page",
    description: "The page listing all product families at /products.",
    slots: [
      {
        key: "products_banner",
        label: "Top Banner Photo",
        desc: "The full-width photo at the very top of the Products page.",
      },
    ],
  },
  {
    page: "Facilities Page",
    description: "The factory and testing page at /facilities.",
    slots: [
      {
        key: "facilities_banner",
        label: "Top Banner Photo",
        desc: "The full-width photo at the very top of the Facilities page.",
      },
      {
        key: "facilities_floor",
        label: "Manufacturing Floor Photo",
        desc: 'The photo of your factory floor in the "Five bays. Everything in-house." section.',
      },
      {
        key: "facilities_sol1",
        label: "Manufacturing Solutions Photo",
        desc: 'The left photo in the "Built to your specification" section.',
      },
      {
        key: "facilities_sol2",
        label: "R&D Section Photo",
        desc: 'The right photo in the "32 years of engineering" section.',
      },
    ],
  },
  {
    page: "Customers Page",
    description: "The page listing your customers at /customers.",
    slots: [
      {
        key: "customers_banner",
        label: "Top Banner Photo",
        desc: "The full-width photo at the very top of the Customers page.",
      },
    ],
  },
  {
    page: "Careers Page",
    description: "The job applications page at /careers.",
    slots: [
      {
        key: "careers_banner",
        label: "Top Banner Photo",
        desc: "The full-width photo at the very top of the Careers page.",
      },
    ],
  },
  {
    page: "Contact Page",
    description: "The enquiry form page at /contact.",
    slots: [
      {
        key: "contact_banner",
        label: "Top Banner Photo",
        desc: "The full-width photo at the very top of the Contact page.",
      },
    ],
  },
];

// ─── Gallery modal ────────────────────────────────────────────────────────────

function GalleryPicker({
  slotKey,
  slotLabel,
  isVideo,
  aspect,
  onSelect,
  onClose,
}: {
  slotKey: string;
  slotLabel: string;
  isVideo: boolean;
  aspect: number;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [gallery, setGallery] = useState<GalleryItem[] | null>(null);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const [cropFile, setCropFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadGallery() {
    setLoadingGallery(true);
    const res = await fetch('/api/admin/media/gallery');
    const data = await res.json();
    // Filter to images only (not videos) unless this slot is video
    const items: GalleryItem[] = data.urls ?? [];
    setGallery(isVideo ? items.filter((i: GalleryItem) => /\.(mp4|mov|webm)$/i.test(i.name)) : items.filter((i: GalleryItem) => !/\.(mp4|mov|webm)$/i.test(i.name)));
    setLoadingGallery(false);
  }

  // Load gallery on mount
  if (gallery === null && !loadingGallery) loadGallery();

  async function handleUpload(file: File) {
    setUploading(true); setUploadErr('');
    const fd = new FormData();
    fd.append('key', slotKey);
    fd.append('file', file);
    const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setUploadErr(data.error ?? 'Upload failed'); return; }
    onSelect(data.url);
  }

  async function selectExisting(url: string) {
    await fetch('/api/admin/media', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: slotKey, url }),
    });
    onSelect(url);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 760, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,.25)' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e' }}>Change: {slotLabel}</div>
            <div style={{ fontSize: 12.5, color: '#9ca3af', marginTop: 2 }}>Upload a new file, or click a previously uploaded image to use it.</div>
          </div>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6b7280' }}><X size={16} /></button>
        </div>

        {!isVideo && (
          <div style={{ margin: '16px 24px 0', display: 'flex', gap: 9, alignItems: 'flex-start', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '11px 14px', fontSize: 12.5, color: '#1e40af', lineHeight: 1.55 }}>
            <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            <span><b>Note for whoever supplies the photos:</b> please use the highest-resolution image available (at least 2000px on the longer side), well-lit and in focus, with good contrast and natural colour. Low-res, dark, or washed-out photos get stretched to fill the banner and will look noticeably lower quality than the rest of the site — it&apos;s the fastest way to make an otherwise premium-looking site look cheap.</span>
          </div>
        )}

        {/* Upload button row */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            ref={fileRef}
            type="file"
            accept={isVideo ? 'video/mp4,video/*' : 'image/*'}
            style={{ display: 'none' }}
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) { isVideo ? handleUpload(f) : setCropFile(f); }
              e.target.value = '';
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}
          >
            {uploading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={15} />}
            {uploading ? 'Uploading…' : `Upload new ${isVideo ? 'video' : 'image'}`}
          </button>
          <button onClick={loadGallery} disabled={loadingGallery} title="Refresh gallery" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 12px', background: '#f3f4f6', border: 'none', borderRadius: 9, cursor: 'pointer', color: '#6b7280', fontSize: 13 }}>
            <RefreshCw size={14} style={{ animation: loadingGallery ? 'spin 1s linear infinite' : 'none' }} /> Refresh
          </button>
          {uploadErr && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: '#dc2626', fontSize: 12.5 }}>
              <AlertCircle size={13} /> {uploadErr}
            </div>
          )}
        </div>

        {/* Gallery grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {loadingGallery ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af', fontSize: 13.5 }}>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} /><br />
              Loading your uploads…
            </div>
          ) : gallery && gallery.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af', fontSize: 13.5 }}>
              No uploads yet. Use the button above to upload your first image.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {(gallery ?? []).map(item => (
                <button
                  key={item.url}
                  onClick={() => selectExisting(item.url)}
                  style={{ border: '2px solid #e2e5ea', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', background: '#f8f9fa', padding: 0, transition: 'border-color 150ms, transform 150ms', position: 'relative' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1a1a2e'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e5ea'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                >
                  {isVideo ? (
                    <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                      <Video size={28} style={{ color: '#6b7280' }} />
                      <span style={{ fontSize: 11, color: '#9ca3af', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 8px' }}>{item.name}</span>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt="" style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
                  )}
                  <div style={{ padding: '7px 10px', textAlign: 'left', borderTop: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: 11, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name.replace(/^\d+_/, '')}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {cropFile && (
        <ImageCropModal
          file={cropFile}
          aspect={aspect}
          onCancel={() => setCropFile(null)}
          onConfirm={croppedFile => { setCropFile(null); handleUpload(croppedFile); }}
        />
      )}
    </div>
  );
}

// ─── Individual slot card ─────────────────────────────────────────────────────

function SlotCard({
  def,
  slot,
  onUpdated,
}: {
  def: SlotDef;
  slot: MediaSlot;
  onUpdated: (key: string, url: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  async function handleSelect(url: string) {
    setPickerOpen(false);
    onUpdated(slot.key, url);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  }

  async function handleReset() {
    if (!confirm('Reset to the original default image?')) return;
    setResetting(true);
    await fetch('/api/admin/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: slot.key }),
    });
    setResetting(false);
    onUpdated(slot.key, slot.defaultUrl);
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 20, padding: '20px 0', borderTop: '1px solid #f3f4f6', alignItems: 'flex-start' }}>
        {/* Thumbnail */}
        <div style={{ width: 160, flexShrink: 0, borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e5ea', background: '#f8f9fa', position: 'relative' }}>
          {def.isVideo ? (
            <div style={{ height: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Video size={24} style={{ color: '#9ca3af' }} />
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Video file</span>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slot.url}
              alt={def.label}
              style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          {slot.isCustom && (
            <div style={{ position: 'absolute', top: 5, left: 5, background: '#16a34a', color: '#fff', fontSize: 9.5, fontWeight: 700, padding: '2px 6px', borderRadius: 99, letterSpacing: '.05em' }}>
              CUSTOM
            </div>
          )}
        </div>

        {/* Info + actions */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{def.label}</div>
          <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.55, marginBottom: 14 }}>{def.desc}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setPickerOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}
            >
              <ImageIcon size={14} /> Change {def.isVideo ? 'video' : 'image'}
            </button>
            {slot.isCustom && (
              <button
                onClick={handleReset}
                disabled={resetting}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: '#fff', color: '#6b7280', border: '1px solid #e2e5ea', borderRadius: 9, fontSize: 13, cursor: 'pointer' }}
              >
                {resetting ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <RotateCcw size={13} />}
                Reset to default
              </button>
            )}
            {justSaved && (
              <div style={{ display: 'flex', gap: 5, alignItems: 'center', color: '#16a34a', fontSize: 13, fontWeight: 600 }}>
                <Check size={14} /> Saved!
              </div>
            )}
          </div>
        </div>
      </div>

      {pickerOpen && (
        <GalleryPicker
          slotKey={slot.key}
          slotLabel={def.label}
          isVideo={def.isVideo ?? false}
          aspect={MEDIA_ASPECTS[slot.key] ?? 16 / 9}
          onSelect={handleSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  );
}

// ─── Page section card ────────────────────────────────────────────────────────

function PageSectionCard({
  section,
  slots,
  onUpdated,
}: {
  section: PageSection;
  slots: Record<string, MediaSlot>;
  onUpdated: (key: string, url: string) => void;
}) {
  const customCount = section.slots.filter(s => slots[s.key]?.isCustom).length;

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
      {/* Section header */}
      <div style={{ padding: '18px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.01em' }}>{section.page}</div>
          <div style={{ fontSize: 12.5, color: '#9ca3af', marginTop: 3 }}>{section.description}</div>
        </div>
        {customCount > 0 && (
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 99, padding: '3px 10px' }}>
            {customCount} custom
          </div>
        )}
      </div>

      {/* Slots */}
      <div style={{ padding: '0 24px' }}>
        {section.slots.map(def => (
          <SlotCard
            key={def.key}
            def={def}
            slot={slots[def.key] ?? { key: def.key, url: '', isCustom: false, isVideo: def.isVideo ?? false, defaultUrl: '' }}
            onUpdated={onUpdated}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function MediaClient({ initialSlots }: { initialSlots: MediaSlot[] }) {
  const [slotMap, setSlotMap] = useState<Record<string, MediaSlot>>(() => {
    const m: Record<string, MediaSlot> = {};
    for (const s of initialSlots) m[s.key] = s;
    return m;
  });

  function handleUpdated(key: string, url: string) {
    setSlotMap(prev => ({
      ...prev,
      [key]: { ...prev[key], url, isCustom: url !== prev[key]?.defaultUrl },
    }));
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', marginBottom: 6, letterSpacing: '-0.01em' }}>Site Images &amp; Video</h1>
        <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
          Change any photo or video on the website — organised by page so you know exactly what you&apos;re editing.
        </p>
      </div>

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '13px 18px', fontSize: 13, color: '#92400e', lineHeight: 1.6, marginBottom: 24 }}>
        <b>How it works:</b> Click <b>&quot;Change image&quot;</b> on any slot below. Upload a new photo and you&apos;ll get a framing screen to drag/zoom to exactly what will show on the site, or pick one you&apos;ve already uploaded from the gallery. Changes show on the live website within a few seconds.
      </div>

      {PAGE_SECTIONS.map(section => (
        <PageSectionCard
          key={section.page}
          section={section}
          slots={slotMap}
          onUpdated={handleUpdated}
        />
      ))}
    </div>
  );
}
