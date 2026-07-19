import { Reveal, SplitText } from '../animations/Reveal';

const SKILL_GROUPS = [
  {
    title: 'Languages',
    items: ['Verilog HDL', 'C', 'C++'],
    icon: '⌘',
  },
  {
    title: 'Digital Design',
    items: ['RTL Design', 'FSM Design', 'Counters', 'Shift Registers', 'Combinational Logic', 'Sequential Logic', 'Arithmetic Circuits'],
    icon: '◈',
  },
  {
    title: 'Embedded',
    items: ['ARM LPC2148', 'Embedded C'],
    icon: '⏚',
  },
  {
    title: 'Tools',
    items: ['Git', 'GitHub', 'EDA Playground', 'GTKWave'],
    icon: '⚙',
  },
  {
    title: 'Web',
    items: ['Responsive Design', 'Frontend Development', 'UI Design'],
    icon: '◐',
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative overflow-hidden bg-secondary-bg py-32 text-white"
    >
      <div className="absolute inset-0 grid-lines-dark opacity-20" />

      {/* Oversized background type */}
      <div className="pointer-events-none absolute -right-8 top-16 overflow-hidden">
        <p className="text-stroke-light font-display text-[20vw] font-light leading-[0.8] opacity-[0.05]">
          SKILLS
        </p>
      </div>

      <div className="container-edit relative z-10">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent-amber">
                04 — Technical Skills
              </span>
            </Reveal>
            <h2 className="mt-4 font-display text-h2 font-light">
              <SplitText text="The craft of" />
              <span className="block italic text-accent-amber">
                <SplitText text="precision." delay={300} />
              </span>
            </h2>
          </div>
          <Reveal delay={200}>
            <p className="max-w-sm font-body text-body text-warm-gray">
              A toolkit built across hardware and software — from logic gates to responsive interfaces.
            </p>
          </Reveal>
        </div>

        {/* Interactive editorial grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SKILL_GROUPS.map((group, i) => (
            <Reveal
              key={group.title}
              delay={i * 100}
              className={i === 1 ? 'lg:col-span-2' : ''}
            >
              <div
                data-cursor="Explore"
                className="group glass-card relative h-full overflow-hidden rounded-md p-8 transition-all duration-500 hover:-translate-y-2 hover:rotate-[1.5deg] hover:shadow-glow"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-3xl text-accent-amber/60 transition-transform duration-500 group-hover:scale-125 group-hover:text-accent-amber">
                    {group.icon}
                  </span>
                  <span className="font-mono text-xs text-warm-gray">
                    0{i + 1} / 0{SKILL_GROUPS.length}
                  </span>
                </div>

                <h3 className="mb-4 font-display text-2xl font-light text-white">
                  {group.title}
                </h3>
                <div className="h-px w-8 bg-accent-amber transition-all duration-500 group-hover:w-16" />

                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-xs text-warm-gray transition-all duration-300 group-hover:border-accent-amber/40 group-hover:text-white"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Hover glow */}
                <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-accent-amber/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
