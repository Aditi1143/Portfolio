import { useEffect, useState } from 'react';
import { Download, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastY && y > 300) setHidden(true);
      else setHidden(false);
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  const handleNav = (href: string) => {
    setDrawerOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed left-1/2 top-6 z-[9000] -translate-x-1/2 transition-all duration-500 ${
          hidden ? '-translate-y-[120%] opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div
          className={`flex items-center gap-1 rounded-full border px-2 py-2 shadow-medium transition-all duration-500 ${
            scrolled
              ? 'border-black/10 bg-primary-bg/72 backdrop-blur-glass'
              : 'border-transparent bg-primary-bg/40 backdrop-blur-md'
          }`}
        >
          <button
            onClick={() => handleNav('#hero')}
            className="group flex items-center gap-2 rounded-full px-4 py-1.5"
            aria-label="Home"
          >
            <span className="font-display text-lg font-semibold tracking-tight text-text-primary transition-colors group-hover:text-accent-amber">
              AH
            </span>
          </button>

          <div className="hidden h-6 w-px bg-black/10 md:block" />

          <div className="hidden items-center md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.href)}
                data-cursor="Go"
                className="group relative rounded-full px-4 py-1.5 font-body text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                {item.label}
                <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-accent-amber transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
          </div>

          <button
            onClick={() => handleNav('#contact')}
            data-cursor="Resume"
            className="ml-1 flex items-center gap-2 rounded-full bg-text-primary px-4 py-2 font-body text-sm font-medium text-primary-bg transition-all duration-300 hover:bg-accent-amber hover:text-text-primary hover:shadow-glow"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Resume</span>
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-text-primary md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[9500] transition-all duration-500 md:hidden ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className="absolute inset-0 bg-surface-dark/80 backdrop-blur-md"
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-72 flex-col gap-2 bg-primary-bg p-8 pt-24 shadow-large transition-transform duration-500 ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <button
            onClick={() => setDrawerOpen(false)}
            className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-black/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.label}
              onClick={() => handleNav(item.href)}
              className="border-b border-border-cream py-4 text-left font-display text-2xl text-text-primary"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
