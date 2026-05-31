"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  to: number;
  duration?: number;
  delay?: number;
  /** If true, starts counting on mount (use for above-fold stats). Default: false (uses IntersectionObserver). */
  triggerOnMount?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function CountUp({
  to,
  duration = 1400,
  delay = 0,
  triggerOnMount = false,
  style,
  className,
}: Props) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  function start() {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      /* ease-out expo — fast start, decelerates smoothly */
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setVal(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
      else setVal(to);
    }
    requestAnimationFrame(tick);
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }

    if (triggerOnMount) {
      const t = setTimeout(start, delay);
      return () => clearTimeout(t);
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect();
          if (delay > 0) setTimeout(start, delay);
          else start();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={ref} style={style} className={className}>
      {val.toLocaleString()}
    </span>
  );
}
