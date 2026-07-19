import { Mail, Linkedin, Github, MessageCircle, Download } from 'lucide-react';
import { Reveal, SplitText } from '../animations/Reveal';
import { useMagnetic } from '../../hooks/useMagnetic';

const CONTACTS = [
  { label: 'Email', href: 'mailto:aditi.hallikeri@example.com', icon: Mail },
  { label: 'LinkedIn', href: '#', icon: Linkedin },
  { label: 'GitHub', href: '#', icon: Github },
  { label: 'WhatsApp', href: '#', icon: MessageCircle },
];

export default function Contact() {
  const resumeBtn = useMagnetic<HTMLButtonElement>(0.4);

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-secondary-bg py-32 text-white"
    >
      <div className="absolute inset-0 grid-lines-dark opacity-20" />

      {/* Oversized background type */}
      <div className="pointer-events-none absolute inset-x-0 top-16 flex justify-center overflow-hidden">
        <p className="text-stroke-light font-display text-[24vw] font-light leading-[0.8] opacity-[0.05]">
          CONTACT
        </p>
      </div>

      <div className="container-edit relative z-10 flex flex-col items-center text-center">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent-amber">
            07 — Contact
          </span>
        </Reveal>

        <h2 className="mt-6 max-w-3xl font-display text-h1 font-light leading-[1.05]">
          <SplitText text="Let's Build" />
          <span className="block italic text-accent-amber">
            <SplitText text="Something Meaningful." delay={400} />
          </span>
        </h2>

        <p className="mt-8 max-w-xl font-body text-body leading-relaxed text-warm-gray">
          Whether it's digital hardware, RTL Design, or beautiful web experiences, I'd love to connect.
        </p>

        {/* Social-flip buttons */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {CONTACTS.map((c) => {
            const Icon = c.icon;
            return (
              <a
                key={c.label}
                href={c.href}
                data-cursor={c.label}
                className="group relative flex h-14 items-center gap-3 overflow-hidden rounded-full border border-white/15 px-6 transition-all duration-300 hover:border-accent-amber"
              >
                <span className="absolute inset-0 translate-y-full bg-accent-amber transition-transform duration-300 group-hover:translate-y-0" />
                <Icon className="relative h-4 w-4 text-white transition-colors duration-300 group-hover:text-text-primary" />
                <span className="relative font-body text-sm text-white transition-colors duration-300 group-hover:text-text-primary">
                  {c.label}
                </span>
              </a>
            );
          })}

          {/* Resume pop button */}
          <button
            ref={resumeBtn.ref}
            data-cursor="Resume"
            className="magnetic flex h-14 items-center gap-3 rounded-full bg-accent-amber px-6 font-body text-sm font-medium text-text-primary transition-all duration-300 hover:shadow-glow"
            style={{ transform: `translate(${resumeBtn.pos.x}px, ${resumeBtn.pos.y}px)` }}
          >
            <Download className="h-4 w-4" />
            Download Resume
          </button>
        </div>

        {/* Decorative line */}
        <div className="mt-16 flex items-center gap-4">
          <span className="h-px w-16 bg-white/20" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-warm-gray">
            Available for opportunities
          </span>
          <span className="h-px w-16 bg-white/20" />
        </div>
      </div>
    </section>
  );
}
