import { useEffect, useRef, useState } from 'react';
import { Reveal, SplitText } from '../animations/Reveal';

const TIMELINE = [
  {
    year: '2023',
    title: 'Started Engineering',
    description:
      'Began Electronics and Communication Engineering at KLE Technological University, Hubballi.',
  },
  {
    year: '2024',
    title: 'Digital Electronics',
    description:
      'Built a strong foundation in digital logic, combinational and sequential circuits.',
  },
  {
    year: '2025',
    title: 'RTL Design',
    description: 'Focused on Verilog HDL, FSMs, RTL design and FPGA concepts.',
  },
  {
    year: 'Present',
    title: 'Building Projects',
    description:
      'Developing Digital VLSI projects while designing modern web experiences.',
  },
];

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const rect = el.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewport = window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), sectionHeight - viewport);
      const p = scrolled / (sectionHeight - viewport);
      setProgress(p);
      const trackWidth = track.scrollWidth - window.innerWidth + 80;
      track.style.transform = `translateX(${-p * trackWidth}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="education"
      ref={sectionRef}
      className="relative h-[280vh] bg-primary-bg"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-30" />

        {/* Header */}
        <div className="container-edit relative z-10 mb-12">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent-orange">
              02 — Education
            </span>
          </Reveal>
          <h2 className="mt-4 font-display text-h2 font-light text-text-primary">
            <SplitText text="Education Journey" />
          </h2>
          <p className="mt-3 max-w-md font-body text-body text-text-secondary">
            Every engineer has a story. Mine began with curiosity and continues with every circuit I design.
          </p>
        </div>

        {/* Horizontal track */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-8 px-10 transition-transform duration-100"
            style={{ willChange: 'transform' }}
          >
            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                className="relative flex w-[80vw] flex-shrink-0 items-center md:w-[42vw] lg:w-[32vw]"
              >
                {/* Card */}
                <div
                  className="group relative w-full overflow-hidden rounded-md border border-border-cream bg-surface-light p-10 shadow-small transition-all duration-500 hover:shadow-medium"
                  style={{
                    transform: `scale(${progress * 4 > i && progress * 4 < i + 1 ? 1.08 : 1})`,
                  }}
                >
                  <div className="absolute right-6 top-6 font-mono text-6xl font-light text-border-cream">
                    0{i + 1}
                  </div>
                  <div className="font-mono text-sm uppercase tracking-widest text-accent-orange">
                    {item.year}
                  </div>
                  <h3 className="mt-4 font-display text-3xl font-light text-text-primary">
                    {item.title}
                  </h3>
                  <div className="mt-4 h-px w-12 bg-accent-amber" />
                  <p className="mt-4 font-body text-body leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </div>

                {/* Timeline node */}
                <div className="absolute -bottom-2 left-10 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-accent-amber ring-4 ring-primary-bg" />
                </div>
              </div>
            ))}

            {/* End spacer */}
            <div className="w-[20vw] flex-shrink-0" />
          </div>
        </div>

        {/* Timeline line */}
        <div className="container-edit relative z-10 mt-8">
          <div className="relative h-px w-full bg-border-cream">
            <div
              className="absolute left-0 top-0 h-px bg-gradient-to-r from-accent-amber to-accent-orange"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
