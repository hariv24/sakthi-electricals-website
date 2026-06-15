"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: string[];   // full encoded URL strings, already sliced to limit
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prev = useCallback(() => setActiveIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActiveIdx(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")      setLightboxOpen(false);
      if (e.key === "ArrowLeft")   prev();
      if (e.key === "ArrowRight")  next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, prev, next]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  if (!images.length) {
    return (
      <div style={{
        aspectRatio: "4/3", background: "var(--steel-50)",
        border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
      }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--fg3)" }}>
          Photos coming soon
        </span>
      </div>
    );
  }

  const thumbs = images.length > 1 ? images : [];

  return (
    <div>
      {/* ── Main featured image ───────────────────────────────────── */}
      <div style={{ position: "relative" }}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setLightboxOpen(true)}
          onKeyDown={e => e.key === "Enter" && setLightboxOpen(true)}
          style={{
            aspectRatio: "4/3", background: "var(--steel-50)",
            border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
            overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
            padding: 28, cursor: "zoom-in", position: "relative",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeIdx]}
            alt={productName}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
          />
          {/* Zoom hint */}
          <div style={{
            position: "absolute", bottom: 12, right: 12,
            background: "rgba(0,0,0,.45)", color: "#fff",
            borderRadius: 8, padding: "5px 10px",
            display: "flex", alignItems: "center", gap: 5,
            fontFamily: "var(--font-mono)", fontSize: 11,
          }}>
            <ZoomIn size={13} /> {activeIdx + 1} / {images.length}
          </div>
        </div>

        {/* Prev / Next arrows on main image */}
        {images.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              style={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,.92)", border: "1px solid var(--border)",
                boxShadow: "0 2px 8px rgba(0,0,0,.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--fg1)",
                transition: "background 140ms, box-shadow 140ms",
                zIndex: 2,
              }}
              className="gallery-arrow"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,.92)", border: "1px solid var(--border)",
                boxShadow: "0 2px 8px rgba(0,0,0,.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--fg1)",
                transition: "background 140ms, box-shadow 140ms",
                zIndex: 2,
              }}
              className="gallery-arrow"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      <style>{`.gallery-arrow:hover{background:#fff!important;box-shadow:0 4px 14px rgba(0,0,0,.18)!important}`}</style>

      {/* ── Thumbnail strip ───────────────────────────────────────── */}
      {thumbs.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {thumbs.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActiveIdx(i)}
              style={{
                width: 68, height: 68, flexShrink: 0,
                border: i === activeIdx
                  ? "2px solid var(--se-red)"
                  : "1.5px solid var(--border)",
                borderRadius: 8, overflow: "hidden",
                background: "var(--steel-50)", cursor: "pointer",
                padding: 4, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "border-color 150ms var(--ease)",
              }}
              aria-label={`View image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ─────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,.93)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "absolute", top: 20, right: 20,
              background: "rgba(255,255,255,.12)", border: "none", borderRadius: "50%",
              width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#fff",
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Prev arrow */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              style={{
                position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)",
                background: "rgba(255,255,255,.12)", border: "none", borderRadius: "50%",
                width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#fff",
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={26} />
            </button>
          )}

          {/* Full-size image */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "88vw", maxHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeIdx]}
              alt={productName}
              style={{ maxWidth: "88vw", maxHeight: "88vh", objectFit: "contain", borderRadius: 8, display: "block" }}
            />
          </div>

          {/* Next arrow */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              style={{
                position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)",
                background: "rgba(255,255,255,.12)", border: "none", borderRadius: "50%",
                width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#fff",
              }}
              aria-label="Next image"
            >
              <ChevronRight size={26} />
            </button>
          )}

          {/* Counter + thumbnail strip inside lightbox */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "rgba(255,255,255,.6)" }}>
              {activeIdx + 1} / {images.length}
            </div>
            {images.length > 1 && (
              <div style={{ display: "flex", gap: 6 }}>
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    style={{
                      width: 52, height: 52, flexShrink: 0,
                      border: i === activeIdx ? "2px solid var(--se-red)" : "1.5px solid rgba(255,255,255,.2)",
                      borderRadius: 6, overflow: "hidden", background: "rgba(255,255,255,.08)",
                      cursor: "pointer", padding: 3,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
