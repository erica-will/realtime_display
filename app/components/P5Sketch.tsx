// components/P5Sketch.tsx
'use client';

import { useEffect, useRef } from 'react';
import type p5 from 'p5';

export default function P5Sketch() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let p5Instance: p5 | null = null;

    // p5 sketch 本體
    const sketch = (p: p5) => {
      p.setup = () => {
        // 把 canvas 掛在我們的 div 底下
        p.createCanvas(400, 400).parent(containerRef.current!);
      };

      p.draw = () => {
        p.background(30);
        p.fill(255);
        p.noStroke();
        p.circle(p.width / 2, p.height / 2, 100);
      };
    };

    // 只在 browser 端載入 p5
    (async () => {
      const p5Module = await import('p5');
      const P5 = p5Module.default;
      p5Instance = new P5(sketch);
    })();

    // unmount 的時候把 canvas 清掉
    return () => {
      p5Instance?.remove();
    };
  }, []);

  return <div ref={containerRef} />;
}
