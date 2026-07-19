import { Reveal, SplitText } from '../animations/Reveal';
import { ArrowUpRight } from 'lucide-react';

const PROJECTS = [
  {
    num: '01',
    title: 'Digital VLSI Design',
    description:
      'Collection of RTL implementations built using Verilog HDL, focusing on efficient digital architectures.',
    tags: ['Verilog', 'RTL', 'Digital Logic'],
    image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1200',
    accent: 'amber',
  },
  {
    num: '02',
    title: 'Embedded Systems',
    description:
      'Microcontroller-based projects using ARM LPC2148 with Embedded C.',
    tags: ['Embedded C', 'ARM', 'Electronics'],
    image: 'https://images.pexels.com/photos/2582932/pexels-photo-2582932.jpeg?auto=compress&cs=tinysrgb&w=1200',
    accent: 'orange',
  },
  {
    num: '03',
    title: 'Modern Portfolio Websites',
    description:
      'Responsive, editorial-inspired portfolio and landing pages built with modern frontend technologies.',
    tags: ['UI', 'Frontend', 'Responsive'],
    image: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1200',
    accent: 'amber',
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-primary-bg py-32"
    >
      <div className="absolute inset-0 grid-lines opacity-30" />

      <div className="container-edit relative z-10">
        <div className="mb-20 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent-orange">
                03 — Selected Projects
              </span>
            </Reveal>
            <h2 className="mt-4 font-display text-h2 font-light text-text-primary">
              <SplitText text="Selected" />
              <span className="block italic text-accent-amber">
                <SplitText text="Work." delay={300} />
              </span>
            </h2>
          </div>
          <Reveal delay={200}>
            <p className="max-w-sm font-body text-body text-text-secondary">
              Engineering work presented with editorial care — each project a chapter, not a card.
            </p>
          </Reveal>
        </div>

        {/* Alternating editorial layout */}
        <div className="flex flex-col gap-32">
          {PROJECTS.map((project, i) => {
            const isLeft = i % 2 === 0;
            return (
              <Reveal key={project.num} delay={i * 100}>
                <article
                  data-cursor="View"
                  className="group grid grid-cols-1 items-center gap-12 lg:grid-cols-12"
                >
                  {/* Image */}
                  <div
                    className={`relative overflow-hidden rounded-lg shadow-large lg:col-span-7 ${
                      isLeft ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {/* Overlay number */}
                    <div className="absolute left-6 top-6 font-display text-8xl font-light text-white/30">
                      {project.num}
                    </div>
                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  {/* Text */}
                  <div
                    className={`lg:col-span-5 ${
                      isLeft ? 'lg:order-2' : 'lg:order-1 lg:pr-12'
                    }`}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="h-px w-12 bg-accent-amber" />
                      <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                        Project {project.num}
                      </span>
                    </div>

                    <h3 className="font-display text-h3 font-light text-text-primary transition-colors duration-300 group-hover:text-accent-amber">
                      {project.title}
                    </h3>

                    <p className="mt-4 max-w-md font-body text-body leading-relaxed text-text-secondary">
                      {project.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border-cream px-3 py-1.5 font-mono text-xs text-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      data-cursor="Open"
                      className="mt-8 flex items-center gap-2 font-body text-sm font-medium text-text-primary transition-colors hover:text-accent-amber"
                    >
                      <span className="overflow-hidden">
                        <span className="block transition-transform duration-500 group-hover:-translate-y-full">
                          View Project
                        </span>
                        <span className="block translate-y-full text-accent-amber transition-transform duration-500 group-hover:translate-y-0">
                          View Project
                        </span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
