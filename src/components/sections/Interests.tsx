import { Music, Mic, Book, Palette } from 'lucide-react';
import { Reveal, SplitText } from '../animations/Reveal';

const INTERESTS = [
  { label: 'Acoustic Guitar', icon: Music, note: 'Music' },
  { label: 'Singing', icon: Mic, note: 'Vocals' },
  { label: 'Reading', icon: Book, note: 'Books' },
  { label: 'Artwork', icon: Palette, note: 'Art' },
];

export default function Interests() {

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


      </div>
    </section>
  );
}
