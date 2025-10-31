"use client";

import React, { useRef, useEffect } from "react";

type AdvancedLiquidTextProps = {
  text: string;
  fontSize?: number; // 字多大(px)
  color?: string; // 文字顏色
  bgColor?: string; // 背景顏色
  intensity?: number; // 液體效果強度 (0-100)
  speed?: number; // 動畫速度
  turbulenceType?: "fractalNoise" | "turbulence"; // 噪波類型
};

export default function AdvancedLiquidText({
  text,
  fontSize = 120,
  color = "#ffffff",
  bgColor = "#000000",
  intensity = 30,
  speed = 1,
  turbulenceType = "fractalNoise",
}: AdvancedLiquidTextProps) {
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement | null>(null);

  useEffect(() => {
    let frame = 0;
    let rafId: number;

    const animate = () => {
      frame++;

      // 讓噪波在時間上流動
      // baseFrequency 影響波紋大小/密度
      const freqX = 0.005 + Math.sin(frame * 0.01 * speed) * 0.002;
      const freqY = 0.01 + Math.cos(frame * 0.008 * speed) * 0.003;

      if (turbulenceRef.current) {
        turbulenceRef.current.setAttribute(
          "baseFrequency",
          `${Math.abs(freqX)}, ${Math.abs(freqY)}`
        );
        // seed 變一下會讓 pattern 抖動
        turbulenceRef.current.setAttribute(
          "seed",
          (100 + frame * 0.05 * speed).toString()
        );
      }

      // scale 越大，拉扯越誇張
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
      }}
    >
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
          <filter id="advancedLiquidDistort" x="-20%" y="-20%" width="140%" height="140%">
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
          filter="url(#advancedLiquidDistort)"
          style={{
            letterSpacing: "-0.03em",
            userSelect: "none",
          }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
}