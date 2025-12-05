/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";

interface TextWave3DProps {
  text?: string;
}

export default function TextWave3D({ text = "CREATIVE CODING" }: TextWave3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let p5Instance: any;
    let cancelled = false;

    const loadP5 = async () => {
      const p5Module = await import("p5");
      const p5 = p5Module.default;

      const sketch = (s: any) => {
        const phrase = text;
        let t = 0; // time
        let font: any = null; // p5.Font

        s.setup = () => {
          s.createCanvas(800, 400, s.WEBGL);

          // 這裡載字型，如果路徑錯誤會在 console 印錯誤，但不會直接炸掉
          s.loadFont(
            "/fonts/Inter_18pt-ExtraBold.ttf",
            (loadedFont: any) => {
              font = loadedFont;
            },
            (err: any) => {
              console.error("Font load error", err);
            }
          );

          s.textAlign(s.CENTER, s.CENTER);
          s.noStroke();
        };

        s.draw = () => {
          s.background(10);

          // 字型還沒載好時，畫個 loading 字樣避免調用 textFont(undefined)
          if (!font) {
            s.fill(255);
            s.textSize(24);
            s.text("Loading font...", 0, 0);
            return;
          }

          s.textFont(font);
          s.textSize(48);

          // camera：稍微俯視
          s.camera(0, -150, 600, 0, 0, 0, 0, 1, 0);
          s.ambientLight(150);

          const amplitude = 60;
          const depth = 120;
          const speed = 0.05;
          const phaseStep = 0.6;
          const spacing = 40;

          const totalWidth = (phrase.length - 1) * spacing;
          const startX = -totalWidth / 2;

          for (let i = 0; i < phrase.length; i++) {
            const ch = phrase[i];
            const angle = t + i * phaseStep;

            const x = startX + i * spacing;
            const y = s.sin(angle) * amplitude;
            const z = s.cos(angle) * depth;

            s.push();
            s.translate(x, y, z);
            s.rotateY(angle * 0.7);
            s.rotateX(angle * 0.3);

            const alpha = s.map(z, -depth, depth, 80, 255);
            s.fill(255, alpha);

            s.text(ch, 0, 0);
            s.pop();
          }

          t += speed;
        };
      };

      if (cancelled || !containerRef.current) return;
      p5Instance = new p5(sketch, containerRef.current);
    };

    loadP5();

    return () => {
      cancelled = true;
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, [text]);

  return <div ref={containerRef} />;
}
