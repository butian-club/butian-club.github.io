import React, {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
  /** Element to render (default div). */
  as?: ElementType;
  /** Animate on mount instead of waiting for scroll (for above-the-fold). */
  immediate?: boolean;
}

/**
 * Fade-and-rise entrance driven by IntersectionObserver — the quiet motion
 * that makes the page feel alive. Honors prefers-reduced-motion via CSS
 * (the hidden state only exists inside a no-preference media query).
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
  immediate = false,
}: RevealProps): ReactNode {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (immediate) {
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      {rootMargin: '0px 0px -8% 0px', threshold: 0.12},
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      className={clsx(styles.reveal, shown && styles.in, className)}
      style={delay ? {transitionDelay: `${delay}ms`} : undefined}>
      {children}
    </Tag>
  );
}
