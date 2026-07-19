import { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let val = 0;
    const interval = setInterval(() => {
      val += Math.random() * 12 + 4;
      if (val >= 100) {
        val = 100;
        clearInterval(interval);
        setTimeout(() => setExiting(true), 400);
        setTimeout(onComplete, 1600);
      }
      setProgress(Math.min(val, 100));
    }, 90);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-surface-dark transition-all duration-1000 ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 grid-lines-dark opacity-30" />

      {/* Decorative oversized type */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
        <p className="text-stroke-light whitespace-nowrap text-center font-display text-[18vw] font-light leading-none opacity-[0.04]">
          ADITI HALLIKERI
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-8">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent-amber" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-warm-gray">
            Loading Experience
          </span>
        </div>

        <div className="overflow-hidden">
          <h1 className="font-display text-5xl font-light text-white md:text-7xl">
            <span className="split-mask">
              <span className={`inline-block transition-transform duration-1000 ${exiting ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}>
                Aditi Hallikeri
              </span>
            </span>
          </h1>
        </div>

        <div className="relative h-px w-64 overflow-hidden bg-white/10 md:w-96">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent-amber to-accent-orange transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex w-64 items-center justify-between md:w-96">
          <span className="font-mono text-[10px] uppercase tracking-widest text-warm-gray">
            Digital VLSI · RTL · Web
          </span>
          <span className="font-mono text-xs text-accent-amber">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
