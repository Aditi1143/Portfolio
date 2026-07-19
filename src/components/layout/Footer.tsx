import { SplitText } from '../animations/Reveal';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#111111] py-24 text-center">
      <div className="absolute inset-0 grid-lines-dark opacity-10" />



      {/* Oversized THANK YOU */}
      <div className="relative z-10 overflow-hidden px-4">
        <h2 className="font-display text-[clamp(64px,14vw,200px)] font-light leading-[0.9] tracking-tight text-white">
          <SplitText text="THANK YOU" stagger={0.04} />
        </h2>
      </div>

      <div className="relative z-10 mt-12 flex flex-col items-center gap-4">
        <p className="font-body text-small text-[#888888]">
          Designed & Developed with curiosity, creativity and engineering precision.
        </p>
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#888888]/30" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
            © 2026 Aditi Hallikeri
          </p>
          <span className="h-px w-8 bg-[#888888]/30" />
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        data-cursor="Top"
        className="relative z-10 mt-10 font-mono text-xs uppercase tracking-widest text-[#888888] transition-colors hover:text-accent-amber"
      >
        Back to top ↑
      </button>
    </footer>
  );
}
