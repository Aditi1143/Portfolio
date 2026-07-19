import { Reveal, SplitText } from '../animations/Reveal';

const EXPERIENCES = [
  {
    role: 'Digital VLSI Learner',
    period: 'Present',
    description:
      'Learning RTL Design, Verilog HDL and FPGA concepts through academic and personal projects.',
    tag: 'Hardware',
  },
  {
    role: 'Web Designer',
    period: 'Present',
    description:
      'Designing elegant, responsive websites with a focus on typography and user experience.',
    tag: 'Creative',
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-surface-dark py-32 text-white"
    >
      <div className="absolute inset-0 grid-lines-dark opacity-20" />

      {/* Oversized background type */}
      <div className="pointer-events-none absolute -left-4 top-16 overflow-hidden">
        <p className="text-stroke-light font-display text-[20vw] font-light leading-[0.8] opacity-[0.04]">
          WORK
        </p>
      </div>

      <div className="container-edit relative z-10">
        <div className="mb-20">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent-amber">
              05 — Experience
            </span>
          </Reveal>
          <h2 className="mt-4 font-display text-h2 font-light">
            <SplitText text="Currently" />
            <span className="block italic text-accent-amber">
              <SplitText text="building." delay={300} />
            </span>
          </h2>
        </div>

        {/* Vertical cards */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-0 h-full w-px bg-white/10 md:left-1/4">
            <div className="h-1/3 w-px bg-gradient-to-b from-accent-amber to-accent-orange" />
          </div>

          <div className="flex flex-col gap-12">
            {EXPERIENCES.map((exp, i) => (
              <Reveal key={exp.role} delay={i * 200}>
                <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
                  {/* Period */}
                  <div className="md:col-span-1 md:pl-12">
                    <div className="absolute left-[-7px] top-2 h-3.5 w-3.5 rounded-full bg-accent-amber ring-4 ring-surface-dark md:left-[calc(25%-7px)]" />
                    <span className="font-mono text-sm uppercase tracking-widest text-accent-amber">
                      {exp.period}
                    </span>
                  </div>

                  {/* Card */}
                  <div
                    data-cursor="Read"
                    className="group glass-card relative overflow-hidden rounded-md p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow md:col-span-3"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full border border-accent-amber/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent-amber">
                        {exp.tag}
                      </span>
                      <span className="font-mono text-xs text-warm-gray">
                        0{i + 1}
                      </span>
                    </div>

                    <h3 className="font-display text-3xl font-light text-white transition-colors duration-300 group-hover:text-accent-amber">
                      {exp.role}
                    </h3>

                    <p className="mt-4 max-w-lg font-body text-body leading-relaxed text-warm-gray">
                      {exp.description}
                    </p>

                    {/* Hover glow */}
                    <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-accent-amber/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
