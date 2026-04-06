'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  duration: number;
  minOpacity: number;
  maxOpacity: number;
  delay: number;
}

const STAR_COUNT = 220;

function generateStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x:          Math.random() * 100,
    y:          Math.random() * 100,
    size:       Math.random() * 1.9 + 0.3,
    duration:   Math.random() * 4 + 2,
    minOpacity: Math.random() * 0.08,
    maxOpacity: Math.random() * 0.65 + 0.2,
    delay:      Math.random() * 5,
  }));
}

export default function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Already populated (StrictMode double-invoke guard)
    if (container.children.length > 0) return;

    const stars = generateStars();
    const fragment = document.createDocumentFragment();

    stars.forEach(star => {
      const el = document.createElement('div');
      el.style.cssText = [
        `position:absolute`,
        `left:${star.x}%`,
        `top:${star.y}%`,
        `width:${star.size}px`,
        `height:${star.size}px`,
        `border-radius:50%`,
        `background:#fff`,
        `animation:twinkle ${star.duration.toFixed(1)}s ${star.delay.toFixed(1)}s ease-in-out infinite alternate`,
        `--star-min:${star.minOpacity.toFixed(2)}`,
        `--star-max:${star.maxOpacity.toFixed(2)}`,
        `will-change:opacity`,
      ].join(';');
      fragment.appendChild(el);
    });

    container.appendChild(fragment);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  );
}
