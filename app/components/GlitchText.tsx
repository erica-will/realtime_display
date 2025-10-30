"use client";

import { useEffect, useRef } from "react";

type GlitchTextProps = {
  text: string;
  className?: string;
};

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let frame = 0;
    let rafId: number;

    const animate = () => {
      frame++;

      // 每幾禎才抖一下，避免太躁
      if (frame % 5 === 0) {
        const tx = (Math.random() - 0.5) * 4; // -2 ~ 2px
        const ty = (Math.random() - 0.5) * 4;

        el.style.setProperty("--glitch-x", `${tx}px`);
        el.style.setProperty("--glitch-y", `${ty}px`);
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`relative font-extrabold text-[clamp(2rem,4vw,4rem)] leading-none tracking-tight uppercase select-none ${className}`}
      style={
        {
          "--glitch-x": "0px",
          "--glitch-y": "0px",
        } as React.CSSProperties
      }
    >
      {/* base layer */}
      <span className="text-white block relative z-[3]">{text}</span>

      {/* red shadow */}
      <span
        aria-hidden
        className="absolute top-0 left-0 text-red-500 mix-blend-screen opacity-70 z-[2]"
        style={{
            transform: "translate(calc(var(--glitch-x) * -1), calc(var(--glitch-y) * -1))",
        }}
      >
        {text}
      </span>

      {/* cyan shadow */}
      <span
        aria-hidden
        className="absolute top-0 left-0 text-cyan-400 mix-blend-screen opacity-70 z-[1]"
        style={{
          transform: "translate(var(--glitch-x), var(--glitch-y))",
        }}
      >
        {text}
      </span>
    </div>
  );
}