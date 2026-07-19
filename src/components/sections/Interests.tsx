import { useState } from 'react';
import { Music, Mic, Book, Palette, Play, Pause } from 'lucide-react';
import { Reveal, SplitText } from '../animations/Reveal';
import { useParallax } from '../../hooks/useParallax';

const INTERESTS = [
  { label: 'Acoustic Guitar', icon: Music, note: 'Music' },
  { label: 'Singing', icon: Mic, note: 'Vocals' },
  { label: 'Reading', icon: Book, note: 'Books' },
  { label: 'Artwork', icon: Palette, note: 'Art' },
];

export default function Interests() {
  const [spinning, setSpinning] = useState(true);
  const [playing, setPlaying] = useState(false);
  const vinyl = useParallax<HTMLDivElement>(25);

  return (
    <section className="relative overflow-hidden bg-primary-bg py-32">
      <div className="absolute inset-0 grid-lines opacity-30" />

      <div className="container-edit relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent-orange">
              06 — Beyond Engineering
            </span>
          </Reveal>
          <h2 className="mt-4 font-display text-h2 font-light text-text-primary">
            <SplitText text="Beyond" />
            <span className="block italic text-accent-amber">
              <SplitText text="Engineering" delay={300} />
            </span>
          </h2>
        </div>

        {/* Floating editorial cards */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {INTERESTS.map((interest, i) => {
            const Icon = interest.icon;
            const rotate = i % 2 === 0 ? '-rotate-3' : 'rotate-3';
            return (
              <Reveal key={interest.label} delay={i * 100}>
                <div
                  data-cursor="Float"
                  className={`group relative flex flex-col items-center gap-4 rounded-lg border border-border-cream bg-surface-light p-8 shadow-small transition-all duration-500 hover:-translate-y-3 ${rotate} hover:rotate-0 hover:shadow-medium`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-bg/10 transition-all duration-500 group-hover:bg-accent-amber group-hover:scale-110">
                    <Icon className="h-7 w-7 text-secondary-bg transition-colors duration-500 group-hover:text-text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-display text-xl font-light text-text-primary">
                      {interest.label}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                      {interest.note}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Vinyl record moment */}
        <div className="mt-32 flex flex-col items-center gap-12 md:flex-row md:justify-center md:gap-20">
          <div ref={vinyl.ref} className="relative" style={{ transform: `translateY(${vinyl.offset}px)` }}>
            <button
              onClick={() => setSpinning(!spinning)}
              data-cursor="Spin"
              className="group relative block h-56 w-56 rounded-full shadow-large transition-transform duration-500 hover:scale-105 md:h-72 md:w-72"
              aria-label="Toggle vinyl spin"
            >
              {/* Vinyl */}
              <div
                className={`h-full w-full rounded-full bg-surface-dark ${spinning ? 'animate-spinSlow' : ''}`}
                style={{ animationPlayState: spinning ? 'running' : 'paused' }}
              >
                {/* Grooves */}
                <div className="absolute inset-4 rounded-full border border-white/5" />
                <div className="absolute inset-8 rounded-full border border-white/5" />
                <div className="absolute inset-12 rounded-full border border-white/5" />
                <div className="absolute inset-16 rounded-full border border-white/5" />
                {/* Label */}
                <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-gradient-to-br from-accent-amber to-accent-orange md:h-28 md:w-28">
                  <span className="font-display text-sm italic text-surface-dark">Side A</span>
                  <span className="mt-1 font-mono text-[8px] uppercase tracking-widest text-surface-dark/70">
                    Aditi · 33⅓
                  </span>
                </div>
                {/* Center hole */}
                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-bg" />
              </div>
            </button>
          </div>

          <div className="max-w-sm text-center md:text-left">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">
                A moment of personality
              </p>
              <h3 className="mt-4 font-display text-h3 font-light text-text-primary">
                Press play. <span className="italic text-accent-amber">Stay curious.</span>
              </h3>
              <p className="mt-4 font-body text-body leading-relaxed text-text-secondary">
                Between circuits and code, there's always music. A vinyl record moment — because engineering and creativity are never far apart.
              </p>

              <button
                onClick={() => setPlaying(!playing)}
                data-cursor={playing ? 'Pause' : 'Play'}
                className="mt-6 flex items-center gap-3 rounded-full border border-text-primary/15 px-5 py-2.5 font-body text-sm text-text-primary transition-all duration-300 hover:border-accent-amber hover:bg-accent-amber hover:text-text-primary"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {playing ? 'Pause' : 'Play track'}
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
