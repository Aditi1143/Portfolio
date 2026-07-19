import type { ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
};

export function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const Tag = as as any;
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'in-view' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
};

export function SplitText({ text, className = '', delay = 0, stagger = 0.03 }: SplitTextProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className={className}>
      {text.split('').map((char, i) => (
        <span key={i} className="split-mask">
          <span
            className={`reveal-letter ${inView ? 'in-view' : ''}`}
            style={{ transitionDelay: `${delay + i * stagger * 1000}ms` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </span>
  );
}

type WordRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
};

export function WordReveal({ text, className = '', delay = 0, stagger = 0.06 }: WordRevealProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className={className}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="split-mask">
          <span
            className={`reveal-letter ${inView ? 'in-view' : ''}`}
            style={{ transitionDelay: `${delay + i * stagger * 1000}ms` }}
          >
            {word}
          </span>
        </span>
      )).reduce((acc, el, i) => {
        if (i > 0) acc.push(<span key={`s${i}`}>&nbsp;</span>);
        acc.push(el);
        return acc;
      }, [] as ReactNode[])}
    </span>
  );
}
