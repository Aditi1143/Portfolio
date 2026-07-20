import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroGreeting from '../../assets/character/hero-greeting.png';
import designerAtLaptop from '../../assets/character/designer-laptop.png';
import finalCreatorPose from '../../assets/character/final-creator.png';

gsap.registerPlugin(ScrollTrigger);

const POSES = [heroGreeting, designerAtLaptop, finalCreatorPose] as const;
const SCROLL_DISTANCE = 3600;

type PoseLayer = HTMLImageElement | null;

/** Decodes the character art before ScrollTrigger takes control of the viewport. */
function preloadPoses() {
  return Promise.all(
    POSES.map((src) => {
      const image = new Image();
      image.src = src;
      return image.decode ? image.decode().catch(() => undefined) : new Promise<void>((resolve) => {
        image.onload = () => resolve();
        image.onerror = () => resolve();
      });
    }),
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const poseRefs = useRef<PoseLayer[]>([]);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    let active = true;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener('change', updateMotion);

    preloadPoses().finally(() => {
      if (active) setReady(true);
    });

    return () => {
      active = false;
      media.removeEventListener('change', updateMotion);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const art = artRef.current;
    const [greeting, designer, creator] = poseRefs.current;
    if (!ready || !section || !art || !greeting || !designer || !creator) return;

    // A graceful non-JS / reduced-motion state remains visible without pinning.
    if (reducedMotion) {
      gsap.set([greeting, designer, creator], { clearProps: 'all' });
      gsap.set(greeting, { autoAlpha: 1 });
      gsap.set([designer, creator], { autoAlpha: 0 });
      return;
    }

    const context = gsap.context(() => {
      gsap.set(greeting, { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, rotation: 0, filter: 'blur(0px)' });
      gsap.set(designer, { autoAlpha: 0, xPercent: 12, yPercent: 8, scale: 0.84, rotation: -4, filter: 'blur(8px)' });
      gsap.set(creator, { autoAlpha: 0, xPercent: -10, yPercent: 6, scale: 0.8, rotation: 5, filter: 'blur(10px)' });
      gsap.set('.character-blink', { autoAlpha: 0 });

      // Independent micro-motion keeps the artwork alive without fighting scroll transforms.
      gsap.to(art, { y: -9, rotation: 0.4, duration: 3.8, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to('.character-particle', { y: -28, opacity: 0.15, duration: 3.2, stagger: 0.45, ease: 'sine.inOut', repeat: -1, yoyo: true });

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${SCROLL_DISTANCE}`,
          scrub: 0.65,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      // Transform, blur and opacity move together so the illustrated poses feel continuous.
      timeline
        .to(greeting, { xPercent: -13, yPercent: -7, scale: 0.74, rotation: -5, autoAlpha: 0, filter: 'blur(7px)', duration: 1 }, 0)
        .to(designer, { xPercent: 0, yPercent: 0, scale: 1, rotation: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1 }, 0)
        .to('.story-copy--hero', { autoAlpha: 0, y: -24, duration: 0.24 }, 0)
        .fromTo('.story-copy--designer', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.24 }, 0.62)
        .to(designer, { xPercent: 8, yPercent: -6, scale: 0.76, rotation: 5, autoAlpha: 0, filter: 'blur(8px)', duration: 1 }, 1.55)
        .to(creator, { xPercent: 0, yPercent: 0, scale: 1, rotation: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1 }, 1.55)
        .to('.character-blink', { autoAlpha: 0.22, duration: 0.12 }, 2.45)
        .to('.story-copy--designer', { autoAlpha: 0, y: -24, duration: 0.24 }, 1.55)
        .fromTo('.story-copy--creator', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.24 }, 2.18);
    }, section);

    // Refresh once the browser has committed image dimensions and layout.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(frame);
      context.revert();
    };
  }, [ready, reducedMotion]);

  return (
    <section id="hero" ref={sectionRef} className={`character-story ${ready ? 'is-ready' : ''}`}>
      <div className="character-story__backdrop" aria-hidden="true" />
      <div className="character-story__halo" aria-hidden="true" />

      <div className="character-story__copy">
        <div className="story-copy story-copy--hero">
          <p className="story-copy__eyebrow">Hello, I&apos;m Aditi</p>
          <h1>Ideas with<br /><em>intention.</em></h1>
          <p>I design clear digital experiences and thoughtful systems.</p>
        </div>
        <div className="story-copy story-copy--designer" aria-hidden={!ready}>
          <p className="story-copy__eyebrow">Designer mode</p>
          <h2>Observe. Build.<br /><em>Refine.</em></h2>
          <p>Every good interface starts with curiosity.</p>
        </div>
        <div className="story-copy story-copy--creator" aria-hidden={!ready}>
          <p className="story-copy__eyebrow">Made to move forward</p>
          <h2>Make it<br /><em>matter.</em></h2>
          <p>Scroll on to see the work behind the ideas.</p>
          <span className="story-copy__scroll"><ArrowDown size={15} /> Continue</span>
        </div>
      </div>

      <div ref={artRef} className="character-story__art" aria-label="Pixel-art portrait of Aditi">
        <span className="character-shadow" aria-hidden="true" />
        {POSES.map((src, index) => (
          <img
            key={src}
            ref={(node) => { poseRefs.current[index] = node; }}
            className={`character-pose character-pose--${index + 1}`}
            src={src}
            alt=""
            draggable="false"
          />
        ))}
        <span className="character-particle character-particle--one" aria-hidden="true" />
        <span className="character-particle character-particle--two" aria-hidden="true" />
        <span className="character-particle character-particle--three" aria-hidden="true" />
        <span className="character-blink" aria-hidden="true" />
      </div>

      <div className="character-loader" role="status" aria-live="polite">
        <span className="character-loader__ring" />
        <span>Loading story</span>
      </div>
      <p className="character-story__progress" aria-hidden="true">Scroll to explore</p>
    </section>
  );
}
