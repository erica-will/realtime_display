/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import type p5 from "p5";

export default function RainSplash() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let instance: p5 | null = null;
    let destroyed = false;

    const sketch = (s: p5) => {
      type Drop = {
        x: number;
        y: number;
        w: number;
        h: number;
        vy: number;
        vw: number;
        vh: number;
        size: number;
        hit: number;
        a: number;
        va: number;
      };

      const drops: Drop[] = [];
      let maxDrops = 0;

      const createDrop = (): Drop => ({
        x: s.random(0, s.width),
        y: 0,
        w: 2,
        h: 1,
        vy: s.random(25, 30),
        vw: 3,
        vh: 1,
        size: 2,
        hit: s.random(s.height * 0.8, s.height * 0.9),
        a: 1,
        va: 0.96,
      });

      const resetDrop = (d: Drop) => {
        const fresh = createDrop();
        d.x = fresh.x;
        d.y = fresh.y;
        d.w = fresh.w;
        d.h = fresh.h;
        d.vy = fresh.vy;
        d.vw = fresh.vw;
        d.vh = fresh.vh;
        d.size = fresh.size;
        d.hit = fresh.hit;
        d.a = fresh.a;
        d.va = fresh.va;
      };

      const updateDrop = (d: Drop) => {
        if (d.y < d.hit) {
          d.y += d.vy;
        } else {
          if (d.a > 0.03) {
            d.w += d.vw;
            d.h += d.vh;

            if (d.w > 100) {
              d.a *= d.va;
              d.vw *= 0.98;
              d.vh *= 0.98;
            }
          } else {
            resetDrop(d);
          }
        }
      };

      const drawDrop = (d: Drop) => {
        if (d.y > d.hit) {
          s.push();
          s.noFill();
          s.stroke(255, 0, 0, d.a * 255);

          // 右半
          s.bezier(
            d.x,
            d.y - d.h / 2,
            d.x + d.w / 2,
            d.y - d.h / 2,
            d.x + d.w / 2,
            d.y + d.h / 2,
            d.x,
            d.y + d.h / 2
          );

          // 左半
          s.bezier(
            d.x,
            d.y + d.h / 2,
            d.x - d.w / 2,
            d.y + d.h / 2,
            d.x - d.w / 2,
            d.y - d.h / 2,
            d.x,
            d.y - d.h / 2
          );

          s.pop();
        } else {
          s.noStroke();
          s.fill(255, 0, 0, 255);
          s.rect(d.x, d.y, d.size, d.size * 15);
        }
      };

      s.setup = () => {
        s.createCanvas(s.windowWidth, s.windowHeight);
        maxDrops = Math.ceil(s.width / 10);

        for (let i = 0; i < maxDrops; i++) {
          setTimeout(() => {
            if (destroyed) return; // 🔴 已卸載就不要再 push
            drops.push(createDrop());
          }, i * 200);
        }
      };

      s.draw = () => {
        s.background(0, 0, 0, 25);

        drops.forEach((drop) => {
          updateDrop(drop);
          drawDrop(drop);
        });
      };

      s.windowResized = () => {
        s.resizeCanvas(s.windowWidth, s.windowHeight);
      };
    };

    (async () => {
      const p5Module = await import("p5");
      if (destroyed) return; // 🔴 卸載後 import 完成也不要 new

      const P5Constructor = (p5Module as any).default ?? (p5Module as any);

      if (containerRef.current) {
        instance = new P5Constructor(sketch, containerRef.current);
      }
    })();

    return () => {
      destroyed = true;
      if (instance) {
        instance.remove();
        instance = null;
      }
    };
  }, []);

  // ✅ 給 p5 掛 canvas 的容器
  return (
    <div
      ref={containerRef}
      className="w-full h-full"
    />
  );
}
