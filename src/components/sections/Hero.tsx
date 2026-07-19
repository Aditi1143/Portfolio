import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react';
import { SplitText } from '../animations/Reveal';
import { useMagnetic } from '../../hooks/useMagnetic';
import aditiPortrait from '../../assets/aditi.jpg';

const SOCIALS = [
  { label: 'Email', href: 'mailto:aditi.hallikeri@example.com', icon: Mail },
  { label: 'LinkedIn', href: '#', icon: Linkedin },
  { label: 'GitHub', href: '#', icon: Github },
];

export default function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const resumeBtn = useMagnetic<HTMLButtonElement>(0.4);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = heroRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMouse({ x, y });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const parallax = (depth: number) => ({
    transform: `translate3d(${mouse.x * depth}px, ${mouse.y * depth}px, 0)`,
  });

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-primary-bg"
    >
      <div className="absolute inset-0 grid-lines opacity-40" />

      {/* Oversized background typography */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[18%] flex justify-center"
        style={parallax(-20)}
      >
        <p className="text-stroke whitespace-nowrap font-display text-[22vw] font-light leading-none opacity-[0.05]">
          PORTFOLIO
        </p>
      </div>

      {/* Decorative floating elements */}
      <div className="pointer-events-none absolute inset-0">
        {/* Wireframe circle */}
        <div
          className="absolute right-[8%] top-[22%] h-40 w-40 rounded-full border border-text-primary/15"
          style={parallax(30)}
        />
        <div
          className="absolute right-[14%] top-[28%] h-24 w-24 rounded-full border border-accent-amber/30"
          style={parallax(45)}
        />
        {/* Engineering symbol — small chip outline */}
        <svg
          className="absolute left-[6%] top-[30%] h-16 w-16 opacity-30"
          style={parallax(25)}
          viewBox="0 0 64 64"
          fill="none"
        >
          <rect x="16" y="16" width="32" height="32" rx="4" stroke="#2E4B38" strokeWidth="1.5" />
          <g stroke="#2E4B38" strokeWidth="1.5" strokeLinecap="round">
            <line x1="24" y1="10" x2="24" y2="16" /><line x1="32" y1="10" x2="32" y2="16" /><line x1="40" y1="10" x2="40" y2="16" />
            <line x1="24" y1="48" x2="24" y2="54" /><line x1="32" y1="48" x2="32" y2="54" /><line x1="40" y1="48" x2="40" y2="54" />
            <line x1="10" y1="24" x2="16" y2="24" /><line x1="10" y1="32" x2="16" y2="32" /><line x1="10" y1="40" x2="16" y2="40" />
            <line x1="48" y1="24" x2="54" y2="24" /><line x1="48" y1="32" x2="54" y2="32" /><line x1="48" y1="40" x2="54" y2="40" />
          </g>
        </svg>

        {/* Random number labels */}
        <span className="absolute left-[12%] bottom-[20%] font-mono text-xs text-text-secondary/50" style={parallax(18)}>
          01011010
        </span>
        <span className="absolute right-[20%] bottom-[26%] font-mono text-xs text-text-secondary/50" style={parallax(22)}>
          RTL · FSM
        </span>
        <span className="absolute left-[44%] top-[14%] font-mono text-[10px] uppercase tracking-widest text-accent-amber/60" style={parallax(35)}>
          v.001
        </span>

        {/* Curved line */}
        <svg className="absolute left-[4%] bottom-[10%] h-32 w-64 opacity-20" style={parallax(15)} viewBox="0 0 240 120" fill="none">
          <path d="M0 60 Q60 0 120 60 T240 60" stroke="#2E4B38" strokeWidth="1" />
        </svg>

        {/* Star marks */}
        <span className="absolute right-[30%] top-[16%] text-2xl text-accent-amber/40" style={parallax(40)}>✦</span>
        <span className="absolute left-[30%] bottom-[30%] text-lg text-accent-orange/40" style={parallax(30)}>✦</span>
      </div>

      <div className="container-edit relative z-10 w-full">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left — intro */}
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-amber" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">
                Digital VLSI · RTL Design · Web
              </span>
            </div>

            <h1 className="font-display text-hero font-light text-text-primary">
              <SplitText text="Designing" className="block" />
              <span className="block italic text-accent-amber">
                <SplitText text="Digital" delay={400} className="block" />
              </span>
              <SplitText text="Logic." delay={800} className="block" />
              <span className="block">
                <SplitText text="Creating" delay={1100} />
              </span>
              <span className="block italic">
                <SplitText text="Beautiful" delay={1400} />
              </span>
              <SplitText text="Experiences." delay={1700} className="block" />
            </h1>

            <p className="mt-8 max-w-md font-body text-body text-text-secondary">
              Digital VLSI Enthusiast • RTL Design Learner • Electronics Engineer • Web Designer
            </p>

            {/* Social-flip + resume */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button
                ref={resumeBtn.ref}
                data-cursor="Download"
                className="magnetic flex items-center gap-2 rounded-full bg-text-primary px-6 py-3 font-body text-sm font-medium text-primary-bg transition-all duration-300 hover:bg-accent-amber hover:text-text-primary hover:shadow-glow"
                style={{ transform: `translate(${resumeBtn.pos.x}px, ${resumeBtn.pos.y}px)` }}
              >
                <Download className="h-4 w-4" />
                Download Resume
              </button>

              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    data-cursor={s.label}
                    className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-text-primary/15 transition-colors duration-300 hover:border-accent-amber"
                  >
                    <span className="absolute inset-0 translate-y-full bg-accent-amber transition-transform duration-300 group-hover:translate-y-0" />
                    <Icon className="relative h-4 w-4 text-text-primary transition-colors duration-300 group-hover:text-text-primary" />
                  </a>
                );
              })}
            </div>

            <button
              onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
              data-cursor="Scroll"
              className="mt-14 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:text-accent-amber"
            >
              <ArrowDown className="h-4 w-4 animate-bounce" />
              Scroll to explore
            </button>
          </div>

          {/* Right — portrait + 3D-ish objects */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto h-[60vh] max-w-sm lg:h-[82vh]" style={parallax(12)}>
              {/* Portrait card */}
              <div
                className="absolute inset-0 overflow-hidden rounded-lg shadow-large"
                style={{ transform: 'rotate(-2deg)' }}
              >
                <img
                  src={aditiPortrait}
                  alt="Aditi Hallikeri portrait"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-bg/40 via-transparent to-transparent" />
              </div>

              {/* Floating chip label */}
              <div
                className="absolute -left-6 top-12 rounded-sm bg-surface-dark px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-accent-amber shadow-medium"
                style={parallax(40)}
              >
                VLSI · 01
              </div>
              <div
                className="absolute -right-4 bottom-20 rounded-sm bg-accent-amber px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-surface-dark shadow-medium"
                style={parallax(50)}
              >
                RTL · 02
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
