import { useEffect, useRef, useState } from 'react';
import StrokeText from './StrokeText';

/** Seconds between replays of the draw-on, matching the hero headline's loop. */
const REPLAY_SECONDS = 12;

/**
 * A word or short phrase of a heading drawn with StrokeText, sitting inline in the sentence.
 *
 * StrokeText takes a fixed pixel fontSize, but section headings scale with the
 * viewport, so this reads the heading's computed font size (and re-reads on resize)
 * and passes it through. Until React has measured it, and without JavaScript, the
 * word renders as plain text, so the heading is never empty for readers or crawlers.
 *
 * Replays: StrokeText's own `trigger="loop"` erases and redraws with under a second's
 * rest, so instead the component is remounted (new `key`) every REPLAY_SECONDS, which
 * replays its mount animation. The wrapper's size is pinned to the drawn word first,
 * so the remount's one-frame measuring pass can't shift the heading.
 */
export default function StrokeWord({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  const [frame, setFrame] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const style = getComputedStyle(el);
      const px = Math.round(parseFloat(style.fontSize));
      if (!(px > 0)) return;
      setSize(prev => (prev === px ? prev : px));
      // StrokeText's SVG has no intrinsic width, so inside an inline wrapper the browser
      // falls back to 300px and anything wider gets scaled down. Measure the text the way
      // StrokeText will draw it (its letter spacing, plus its padding of max(1.4, 0.1em)
      // on each side) and give the wrapper that width up front.
      const ctx = document.createElement('canvas').getContext('2d');
      if (!ctx) return;
      ctx.font = `500 ${px}px ${style.fontFamily}`;
      const chars = Array.from(text).length;
      const spacing = Math.round(px * -0.015 * 10) / 10;
      const pad = Math.max(1.4, px * 0.1);
      setWidth(Math.ceil(ctx.measureText(text).width + spacing * (chars - 1) + pad * 2));
    };
    read();
    document.fonts?.ready.then(read).catch(() => {}); // web fonts change the text's width
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, [text]);

  // Pin the wrapper to the drawn word's size; re-measure when the font size changes.
  useEffect(() => {
    const el = ref.current;
    if (!el || !size) return;
    setFrame(null);
    const id = window.setTimeout(() => {
      const svg = el.querySelector('svg');
      const box = svg?.getBoundingClientRect();
      if (box && box.width > 0) setFrame({ width: box.width, height: box.height });
    }, 300);
    return () => window.clearTimeout(id);
  }, [size, width]);

  useEffect(() => {
    if (!size || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setRun(n => n + 1);
    }, REPLAY_SECONDS * 1000);
    return () => window.clearInterval(id);
  }, [size]);

  return (
    <span
      ref={ref}
      className={size ? 'inline-block align-[-0.36em]' : undefined}
      style={
        size
          ? {
              width: frame?.width ?? width ?? undefined,
              maxWidth: '100%',
              aspectRatio: frame ? `${frame.width} / ${frame.height}` : undefined
            }
          : undefined
      }
    >
      {size ? (
        <StrokeText
          key={run}
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
