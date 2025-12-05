/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";

interface TextWaveProps {
  text?: string;
}

export default function TextWave({ text = "HELLO WORLD" }: TextWaveProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let p5Instance: any;

    const loadP5 = async () => {
      const p5Module = await import("p5");
      const p5 = p5Module.default;

      const sketch = (s: any) => {
        const phrase = text;
        let t = 0; // 時間（用來推動畫面）

        s.setup = () => {
          s.createCanvas(800, 200); // 你可以依需求改大小
          s.textSize(64);
          s.textAlign(s.CENTER, s.CENTER);
          s.noStroke();
        };

        s.draw = () => {
          s.background(10);
          s.fill(255);

          const baseY = s.height / 2;      // 基準線高度
          const amplitude = 40;            // 波動幅度（越大晃越凶）
          const speed = 0.05;              // 時間推進速度
          const phaseStep = 0.5;           // 每個字之間的相位差
          const spacing = s.width / (phrase.length + 1); // 字距

          for (let i = 0; i < phrase.length; i++) {
            const ch = phrase[i];
            const x = spacing * (i + 1);
            const yOffset = s.sin(t + i * phaseStep) * amplitude;
            const y = baseY + yOffset;

            s.text(ch, x, y);
          }

          t += speed;
        };
      };

      if (containerRef.current) {
        p5Instance = new p5(sketch, containerRef.current);
      }
    };

    loadP5();

    // 元件卸載時清掉 canvas
    return () => {
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, [text]);

  return <div ref={containerRef} />;
}
