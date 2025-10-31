"use client";

import React, { useState, useEffect, useRef } from "react";

type LiquidTextRotatingProps = {
  words?: string[];
  fontSize?: number;
  color?: string;
  bgColor?: string;
  intensity?: number;
  speed?: number;
  rotationInterval?: number; // 輪播間隔(ms)
  turbulenceType?: "fractalNoise" | "turbulence";
};

const DEFAULT_WORDS = ["VOID", "SIGNAL LOST", "RECONNECT", "ONLINE"];

export default function LiquidTextRotating({
  words = DEFAULT_WORDS,
  fontSize = 120,
  color = "#ffffff",
  bgColor = "#000000",
  intensity = 30,
  speed = 1,
  rotationInterval = 2000,
  turbulenceType = "fractalNoise",
}: LiquidTextRotatingProps) {
  const [idx, setIdx] = useState(0);
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement | null>(null);

  // 文字輪播
  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % words.length);
    }, rotationInterval);
    return () => clearInterval(t);
  }, [words.length, rotationInterval]);

  // 液體動畫
  useEffect(() => {
    let frame = 0;
    let rafId: number;

    const animate = () => {
      frame++;

      // 讓噪波在時間上流動
      const freqX = 0.005 + Math.sin(frame * 0.01 * speed) * 0.002;
      const freqY = 0.01 + Math.cos(frame * 0.008 * speed) * 0.003;

      if (turbulenceRef.current) {
        turbulenceRef.current.setAttribute(
          "baseFrequency",
          `${Math.abs(freqX)}, ${Math.abs(freqY)}`
        );
        turbulenceRef.current.setAttribute(
          "seed",
          (100 + frame * 0.05 * speed).toString()
        );
      }

      // scale 控制扭曲強度
      const scale = intensity * 0.7 + Math.sin(frame * 0.02 * speed) * intensity * 0.3;
      if (displacementRef.current) {
        displacementRef.current.setAttribute("scale", scale.toString());
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [intensity, speed]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* 頁面指示器 */}
      <div
        style={{
          position: "absolute",
          top: "2rem",
          right: "2rem",
          color: color,
          fontSize: "0.875rem",
          fontFamily: "'Inter', system-ui, sans-serif",
          opacity: 0.6,
        }}
      >
        {idx + 1} / {words.length}
      </div>

      <svg
        width="80vw"
        height="40vh"
        viewBox="0 0 800 400"
        style={{
          overflow: "visible",
        }}
      >
        {/* 定義濾鏡 */}
        <defs>
          <filter id="liquidRotatingDistort" x="-20%" y="-20%" width="140%" height="140%">
            {/* 產生亂流噪波 */}
            <feTurbulence
              ref={turbulenceRef}
              type={turbulenceType}
              baseFrequency="0.01 0.02"
              numOctaves={2}
              seed={2}
              result="turbulence"
            />
            {/* 用噪波去拉扯文字 */}
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="turbulence"
              scale={intensity}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* 顯示文字 */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={fontSize}
          fontWeight={700}
          fontFamily="'Inter', system-ui, sans-serif"
          filter="url(#liquidRotatingDistort)"
          style={{
            letterSpacing: "-0.03em",
            userSelect: "none",
            transition: "opacity 0.4s ease",
          }}
        >
          {words[idx]}
        </text>
      </svg>

      {/* 控制面板 */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "2rem",
          color: color,
          fontSize: "0.75rem",
          fontFamily: "'Inter', system-ui, sans-serif",
          opacity: 0.4,
          lineHeight: 1.5,
        }}
      >
        <div>Intensity: {intensity}</div>
        <div>Speed: {speed}x</div>
        <div>Type: {turbulenceType}</div>
      </div>
    </div>
  );
}