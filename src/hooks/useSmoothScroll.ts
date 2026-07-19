import { useEffect, useRef } from 'react';

/**
 * Smooth scroll via a lightweight requestAnimationFrame lerp.
 * Avoids external dependency; provides subtle "expensive" feel.
 */
export function useSmoothScroll() {
  const rafId = useRef<number>(0);

  useEffect(() => {
    // Lenis-like lerp smooth scroll, lightweight
    let target = window.scrollY;
    let current = window.scrollY;
    const ease = 0.08;

    const onScroll = () => {
      target = window.scrollY;
    };

    const tick = () => {
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.1) current = target;
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);
}
