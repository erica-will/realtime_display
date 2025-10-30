"use client";

import { useEffect, useRef } from "react";

type JitterTextProps = {
  text: string;
  className?: string;
  intensity?: number; // 抖動幅度 px
  speed?: number;     // 抖動速度倍數
};

export default function JitterText({
  text,
  className = "",
  intensity = 2,
  speed = 1,
}: JitterTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const letters: HTMLElement[] = Array.from(
      el.querySelectorAll("[data-letter]")
    ) as HTMLElement[];

    let t = 0;
    let rafId: number;

    const animate = () => {
      t += 0.016 * speed;

      for (let i = 0; i < letters.length; i++) {
        const l = letters[i];

        // 給每個字母一點不同的 noise phase
        const phase = i * 13.37;

        // 粗暴一點：用 sin/cos 疊出 pseudo-noise
        const dx = Math.sin(t * 3 + phase) * intensity;
        const dy = Math.cos(t * 2.1 + phase * 0.3) * intensity;
        const rot = Math.sin(t * 4 + phase * 0.5) * 1.5; // 旋轉一點點

        l.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [intensity, speed]);

  return (
    <div
      ref={ref}
      className={`font-extrabold uppercase text-white text-[clamp(2rem,4vw,4rem)] leading-none tracking-tight flex flex-wrap ${className}`}
      style={{ lineHeight: 1 }}
    >
      {text.split("").map((ch, i) => (
        <span
          key={i}
          data-letter
          className="will-change-transform inline-block"
          style={{
            paddingRight: ch === " " ? "0.5ch" : undefined,
          }}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}