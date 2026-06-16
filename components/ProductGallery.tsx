"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Play } from "lucide-react";

type GalleryItem =
  | { type: "image"; src: string }
  | { type: "video"; embedUrl: string; thumbUrl: string | null };

interface ProductGalleryProps {
  images: string[];
  productName: string;
  embedUrl?: string;
}

export default function ProductGallery({ images, productName, embedUrl }: ProductGalleryProps) {
  const videoId = embedUrl ? (embedUrl.split("/embed/")[1]?.split("?")[0] ?? null) : null;
  const ytThumb = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

  const items: GalleryItem[] = [
    ...images.map(src => ({ type: "image" as const, src })),
    ...(embedUrl ? [{ type: "video" as const, embedUrl, thumbUrl: ytThumb }] : []),
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeItem = items[activeIdx] ?? items[0];
  const showThumbs = items.length > 1;

  const prev = useCallback(() => setActiveIdx(i => (i - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setActiveIdx(i => (i + 1) % items.length), [items.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     setLightboxOpen(false);
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  if (!items.length) {
    return (
      <div style={{ aspectRatio: "4/3", background: "var(--steel-50)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--fg3)" }}>Photos coming soon</span>
      </div>
    );
  }

  return (
    <div>
      {/* ── Main display — fixed 4/3 container so layout never shifts ── */}
      <div style={{ position: "relative", aspectRatio: "4/3", background: "var(--steel-50)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

        {activeItem?.type === "video" ? (
          /* Video fills the container; YouTube letterboxes internally */
          <iframe
            src={activeItem.embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            title={`${productName} video`}
          />
        ) : (
          /* Photo — click opens lightbox */
          <div
            role="button"
            tabIndex={0}
            onClick={() => setLightboxOpen(true)}
            onKeyDown={e => e.key === "Enter" && setLightboxOpen(true)}
            style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 28, cursor: "zoom-in", boxSizing: "border-box" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(activeItem as { type: "image"; src: string }).src}
              alt={productName}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
            />
            <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,.45)", color: "#fff", borderRadius: 8, padding: "5px 10px", display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: 11, pointerEvents: "none" }}>
              <ZoomIn size={13} /> {activeIdx + 1} / {items.length}
            </div>
          </div>
        )}

        {/* Prev / Next arrows */}
        {items.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous" className="gallery-arrow"
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.92)", border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--fg1)", zIndex: 2 }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={e => { e.stopPropagation(); next(); }} aria-label="Next" className="gallery-arrow"
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.92)", border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--fg1)", zIndex: 2 }}>
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      <style>{`.gallery-arrow:hover{background:#fff!important;box-shadow:0 4px 14px rgba(0,0,0,.18)!important}`}</style>

      {/* ── Thumbnail strip — photos + video all in one row ───────── */}
      {showThumbs && (
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {items.map((item, i) => {
            const isActive = i === activeIdx;
            if (item.type === "image") {
              return (
                <button key={i} onClick={() => setActiveIdx(i)} aria-label={`Image ${i + 1}`}
                  style={{ width: 68, height: 68, flexShrink: 0, border: isActive ? "2px solid var(--se-red)" : "1.5px solid var(--border)", borderRadius: 8, overflow: "hidden", background: "var(--steel-50)", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 150ms" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </button>
              );
            }
            return (
              <button key={i} onClick={() => setActiveIdx(i)} aria-label="Play video"
                style={{ width: 68, height: 68, flexShrink: 0, border: isActive ? "2px solid var(--se-red)" : "1.5px solid var(--border)", borderRadius: 8, overflow: "hidden", background: "#0f0f0f", cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 150ms" }}>
                {item.thumbUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.thumbUrl} alt="Video" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                )}
                <div style={{ position: "absolute", inset: 0, background: item.thumbUrl ? "rgba(0,0,0,.38)" : "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Play size={16} color="#fff" fill="#fff" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Lightbox (images zoom fullscreen; video gets its own overlay) */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.93)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <button onClick={() => setLightboxOpen(false)} aria-label="Close"
            style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,.12)", border: "none", borderRadius: "50%", width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
            <X size={20} />
          </button>

          {items.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous"
                style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.12)", border: "none", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                <ChevronLeft size={26} />
              </button>
              <button onClick={e => { e.stopPropagation(); next(); }} aria-label="Next"
                style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.12)", border: "none", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                <ChevronRight size={26} />
              </button>
            </>
          )}

          {activeItem?.type === "video" ? (
            /* Video player — 16:9 in the lightbox */
            <div onClick={e => e.stopPropagation()} style={{ width: "min(88vw, 960px)", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", boxShadow: "0 0 80px rgba(0,0,0,.6)" }}>
              <iframe
                src={activeItem.embedUrl + "?autoplay=1"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                title={`${productName} video`}
              />
            </div>
          ) : (
            /* Image fullscreen */
            <div onClick={e => e.stopPropagation()} style={{ maxWidth: "88vw", maxHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={(activeItem as { type: "image"; src: string }).src}
                alt={productName}
                style={{ maxWidth: "88vw", maxHeight: "88vh", objectFit: "contain", borderRadius: 8, display: "block" }}
              />
            </div>
          )}

          {/* Thumbnail strip inside lightbox */}
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "rgba(255,255,255,.6)" }}>
              {activeIdx + 1} / {items.length}
            </div>
            {items.length > 1 && (
              <div style={{ display: "flex", gap: 6 }}>
                {items.map((item, i) => {
                  const isActive = i === activeIdx;
                  const thumb = item.type === "image" ? item.src : (item.thumbUrl ?? null);
                  return (
                    <button key={i} onClick={() => setActiveIdx(i)}
                      style={{ width: 48, height: 48, flexShrink: 0, border: isActive ? "2px solid var(--se-red)" : "1.5px solid rgba(255,255,255,.2)", borderRadius: 6, overflow: "hidden", background: thumb ? "rgba(255,255,255,.08)" : "#0f0f0f", cursor: "pointer", padding: 3, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      {thumb && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: item.type === "video" ? "cover" : "contain" }} />
                      )}
                      {item.type === "video" && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.4)" }}>
                          <Play size={12} color="#fff" fill="#fff" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
