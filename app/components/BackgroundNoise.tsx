/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import type p5 from "p5";

export default function BackgroundNoise() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let instance: p5 | null = null;
    let destroyed = false;

    const sketch = (s: p5) => {
      const frames: p5.Image[] = [];
      let frameIndex = 0;
      let counter = 0;

      s.setup = () => {
        s.createCanvas(s.windowWidth, s.windowHeight);
        s.noStroke();
        s.pixelDensity(1);

        // 產生多張噪點影格
        for (let f = 0; f < 6; f++) {
          const img = s.createImage(256, 256);
          img.loadPixels();
          for (let i = 0; i < img.width * img.height * 4; i += 4) {
            const shade = s.random(25, 150);
            img.pixels[i] = shade;
            img.pixels[i + 1] = shade;
            img.pixels[i + 2] = shade;
            img.pixels[i + 3] = 255;
          }
          img.updatePixels();
          frames.push(img);
        }
      };

      s.draw = () => {
        s.background(20);
        s.tint(255, 60);

        counter++;

        // 每 N 幀才切換一張噪點圖
        if (counter % 5 === 0) {
          frameIndex = (frameIndex + 1) % frames.length;
        }

        const img = frames[frameIndex];

        for (let x = 0; x < s.width; x += img.width) {
          for (let y = 0; y < s.height; y += img.height) {
            s.image(img, x, y);
          }
        }
      };

      s.windowResized = () => {
        s.resizeCanvas(s.windowWidth, s.windowHeight);
      };
    };

    (async () => {
      const p5Module = await import("p5");
      if (destroyed) return; // 💥 如果已經 unmount，就不要再 new p5 了

      const P5 = (p5Module as any).default ?? (p5Module as any);

      if (!containerRef.current) return; // 保險：容器也可能已經不在

      instance = new P5(sketch as unknown as (s: p5) => void, containerRef.current);
    })();

    return () => {
      destroyed = true;
      if (instance) {
        instance.remove();
        instance = null;
      }
    };
  }, []);

  // ✅ 交給 p5 掛 canvas 的容器
  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
}
