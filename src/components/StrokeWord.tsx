import { useEffect, useRef, useState } from 'react';
import StrokeText from './StrokeText';

/**
 * One word of a heading drawn with StrokeText, sitting inline in the sentence.
 *
 * StrokeText takes a fixed pixel fontSize, but section headings scale with the
 * viewport, so this reads the heading's computed font size (and re-reads on resize)
 * and passes it through. Until React has measured it, and without JavaScript, the
 * word renders as plain text, so the heading is never empty for readers or crawlers.
 */
export default function StrokeWord({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const px = Math.round(parseFloat(getComputedStyle(el).fontSize));
      if (px > 0) setSize(prev => (prev === px ? prev : px));
    };
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);

  return (
    <span ref={ref} className={size ? 'inline-block align-[-0.36em]' : undefined}>
      {size ? (
        <StrokeText
          text={text}
          strokeColor="#017288"
          strokeStyle="solid"
          strokeWidth={1.4}
          dashLength={10}
          drawDuration={1.6}
          fillDelay={0.2}
          stagger={0.05}
          ease="power2.out"
          trigger="mount"
          fillMode="wipe"
          wipeFrom="left"
          fontSize={size}
          fontWeight={500}
          letterSpacing={Math.round(size * -0.015 * 10) / 10}
          marching={false}
          hoverRedraw
          shadow={false}
          fontFamily="inherit"
          reverse={false}
        />
      ) : (
        text
      )}
    </span>
  );
}
