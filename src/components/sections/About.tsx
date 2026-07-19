import { Reveal, SplitText } from '../animations/Reveal';
import { useParallax } from '../../hooks/useParallax';
import aditiPortrait from '../../assets/aditi.jpg';

export default function About() {
  const portrait = useParallax<HTMLDivElement>(20);
  const quote = useParallax<HTMLDivElement>(-15);

  return (
    <section
      id="about"
      className="relative min-h-[120vh] overflow-hidden bg-secondary-bg py-32 text-white"
    >
      <div className="absolute inset-0 grid-lines-dark opacity-30" />

      {/* Oversized ABOUT heading */}
      <div className="pointer-events-none absolute -left-4 top-24 overflow-hidden">
        <p className="text-stroke-light font-display text-[26vw] font-light leading-[0.8] opacity-[0.06]">
          ABOUT
        </p>
      </div>

      <div className="container-edit relative z-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Left — heading */}
          <div className="lg:col-span-5">
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent-amber">
                01 — About
              </span>
            </Reveal>
            <h2 className="mt-6 font-display text-h1 font-light leading-[1.05]">
              <SplitText text="Engineering" className="block" />
              <span className="block italic text-accent-amber">
                <SplitText text="is where" delay={300} />
              </span>
              <SplitText text="logic meets" delay={600} className="block" />
              <span className="block italic">
                <SplitText text="creativity." delay={900} />
              </span>
            </h2>

            {/* Small portrait */}
            <div ref={portrait.ref} className="mt-12 overflow-hidden rounded-md shadow-large" style={{ transform: `translateY(${portrait.offset}px)` }}>
              <img
                src={aditiPortrait}
                alt="Aditi Hallikeri"
                className="aspect-[4/5] w-full max-w-xs object-cover"
                loading="lazy"
              />
            </div>

            {/* Signature mark */}
            <Reveal delay={200} className="mt-8">
              <p className="font-display text-3xl italic text-accent-amber">Aditi H.</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-warm-gray">
                Signature
              </p>
            </Reveal>
          </div>

          {/* Right — biography + pull quote */}
          <div className="lg:col-span-7">
            {/* Pull quote — pulled out of column flow */}
            <div
              ref={quote.ref}
              className="relative float-right mb-8 ml-6 w-1/2 max-w-sm lg:mt-0"
              style={{ transform: `translateY(${quote.offset}px)` }}
            >
              <span className="absolute -left-4 -top-8 font-display text-7xl leading-none text-accent-amber/40">
                "
              </span>
              <p className="font-display text-3xl font-light italic leading-tight text-white md:text-4xl">
                Every digital system begins with a single idea. Every great design begins with curiosity.
              </p>
            </div>

            <Reveal>
              <p className="drop-cap font-body text-body leading-[1.7] text-warm-gray">
                Hi, I'm Aditi Hallikeri, a third-year Electronics and Communication Engineering student with a strong interest in Digital VLSI and RTL Design. I enjoy understanding how digital systems work — from individual transistors to complete digital architectures — and transforming those concepts into practical hardware using Verilog HDL.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <p className="mt-6 font-body text-body leading-[1.7] text-warm-gray">
                Beyond hardware, I also explore web design, where I combine clean visual aesthetics with functional user experiences. Whether I'm designing digital circuits or crafting modern websites, I believe great engineering always begins with thoughtful design.
              </p>
            </Reveal>

            {/* Technical tags */}
            <Reveal delay={300} className="mt-10">
              <div className="flex flex-wrap gap-2">
                {['Verilog HDL', 'RTL Design', 'FPGA', 'Web Design', 'UI/UX'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 px-4 py-1.5 font-mono text-xs text-warm-gray transition-colors hover:border-accent-amber hover:text-accent-amber"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
