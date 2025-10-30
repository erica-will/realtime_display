"use client";

import { useEffect, useRef, useMemo } from "react";

type LiquidTextProps = {
  text: string;
  className?: string;
};

// 簡單的字符串哈希函數，確保同樣的文字產生同樣的 ID
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

export default function LiquidText({ text, className = "" }: LiquidTextProps) {
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  
  // 使用基於文字內容的確定性 ID，確保 SSR 和客戶端一致
  const filterId = useMemo(() => {
    return `liquid-filter-${simpleHash(text)}`;
  }, [text]);

  useEffect(() => {
    let t = 0;
    let rafId: number;

    const animate = () => {
      t += 0.01;
      if (turbulenceRef.current) {
        const freq = 0.015 + Math.sin(t) * 0.005; // 在一個小範圍內抖動
        turbulenceRef.current.setAttribute("baseFrequency", freq.toString());
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className={`text-[clamp(3rem,5vw,6rem)] font-extrabold text-white uppercase leading-none tracking-tight ${className}`}
    >
      <svg
        viewBox="0 0 800 200"
        className="w-full h-auto block"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id={filterId}>
            {/* 製造噪波 */}
            <feTurbulence
              ref={turbulenceRef}
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="2"
              result="noise"
              seed="2"
            />
            {/* 用噪波去位移原圖，做出液態扭曲 */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            filter: `url(#${filterId})`,
            fill: "white",
          }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
}