"use client";
import { useEffect, useRef, useState } from "react";

interface Opts {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useInView(opts?: Opts) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (opts?.once !== false) obs.disconnect();
        }
      },
      {
        threshold: opts?.threshold ?? 0.15,
        rootMargin: opts?.rootMargin ?? "0px 0px -40px 0px",
      }
    );
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
