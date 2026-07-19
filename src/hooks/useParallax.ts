import { useEffect, useRef, useState } from 'react';

/**
 * Parallax offset based on element position relative to viewport center.
 * Returns a ref to attach and the current offset in px.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(strength = 30) {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const distance = elementCenter - viewportCenter;
        setOffset(-(distance / window.innerHeight) * strength);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return { ref, offset };
}
