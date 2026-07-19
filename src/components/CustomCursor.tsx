import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-cursor]');
      if (target) {
        setHovering(true);
        setLabel(target.getAttribute('data-cursor') || '');
      } else if ((e.target as HTMLElement)?.closest('a, button, [role="button"]')) {
        setHovering(true);
        setLabel('');
      } else {
        setHovering(false);
        setLabel('');
      }
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-2 w-2 rounded-full bg-accent-amber"
        style={{ mixBlendMode: 'difference' }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-text-primary transition-[width,height,background-color] duration-300"
        style={{
          mixBlendMode: 'difference',
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          backgroundColor: hovering ? 'rgba(244,180,0,0.15)' : 'transparent',
        }}
      >
        {label && (
          <span className="font-mono text-[9px] uppercase tracking-widest text-white">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
