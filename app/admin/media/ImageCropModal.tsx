"use client";

import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Check, X, ZoomIn } from "lucide-react";
import { getCroppedImageFile, PixelCrop } from "./cropImage";

export default function ImageCropModal({
  file,
  aspect,
  onConfirm,
  onCancel,
}: {
  file: File;
  aspect: number;
  onConfirm: (cropped: File) => void;
  onCancel: () => void;
}) {
  const [imageSrc] = useState(() => URL.createObjectURL(file));
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixelCrop, setPixelCrop] = useState<PixelCrop | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setPixelCrop(croppedAreaPixels);
  }, []);

  async function handleConfirm() {
    if (!pixelCrop) return;
    setSaving(true);
    try {
      const cropped = await getCroppedImageFile(imageSrc, pixelCrop, file.name);
      onConfirm(cropped);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.7)', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 640, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,.3)' }}>

        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15.5, fontWeight: 800, color: '#1a1a2e' }}>Frame the photo</div>
            <div style={{ fontSize: 12.5, color: '#9ca3af', marginTop: 2 }}>Drag to reposition, use the slider to zoom. This is exactly how it will appear on the site.</div>
          </div>
          <button onClick={onCancel} style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex', color: '#6b7280' }}><X size={16} /></button>
        </div>

        <div style={{ position: 'relative', width: '100%', height: 380, background: '#111' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <ZoomIn size={16} style={{ color: '#9ca3af', flexShrink: 0 }} />
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            style={{ flex: 1 }}
          />
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onCancel} style={{ padding: '10px 18px', background: '#fff', color: '#6b7280', border: '1px solid #e2e5ea', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving || !pixelCrop}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
          >
            <Check size={15} /> {saving ? 'Applying…' : 'Use this crop'}
          </button>
        </div>
      </div>
    </div>
  );
}
