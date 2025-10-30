"use client";

import { useEffect, useRef } from "react";

type AdvancedInfinityTextProps = {
  texts: string[];
  className?: string;
  sparseMode?: boolean; // 是否使用稀疏模式（只顯示部分字母）
};

export default function AdvancedInfinityText({
  texts,
  className = "",
  sparseMode = false,
}: AdvancedInfinityTextProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = window.devicePixelRatio || 1;
    const W = 900;
    const H = 500;

    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(DPR, DPR);

    // 每個圈使用不同文字
    const RINGS = Math.min(texts.length, 4); // 最多4個圈

    // 動態生成不同大小的半徑
    const radii = Array.from({ length: RINGS }, (_, i) => 80 + (i % 2) * 30);

    // 每個圈相對時間偏移
    const ringPhaseOffset = Array.from({ length: RINGS }, (_, i) => i * 0.7);

    let t = 0;
    let rafId: number;

    function draw() {
      if (!ctx) return;
      
      t += 0.008; // 稍微慢一點，更優雅

      // 清背景
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const centerX = W / 2;
      const centerY = H / 2;

      // 更寬的 infinity 路徑
      const a = 180;

      for (let ringIndex = 0; ringIndex < RINGS; ringIndex++) {
        const text = texts[ringIndex];
        const letters = text.split("");
        const r = radii[ringIndex];
        const tt = t + ringPhaseOffset[ringIndex];

        // 每個圈使用稍微不同的路徑參數
        const pathSpeed = 0.5 + ringIndex * 0.1;
        const u = tt * pathSpeed;

        // Infinity 路徑計算
        const denom = 1 + Math.pow(Math.sin(u), 2);
        const pathX = (a * Math.cos(u)) / denom;
        const pathY = (a * Math.sin(u) * Math.cos(u)) / denom;

        const cx = centerX + pathX;
        const cy = centerY + pathY;

        // 每個圈的旋轉速度也不同
        const ringRotation = tt * (0.8 + ringIndex * 0.2);

        // 字體大小根據圈的索引變化
        const fontSize = 18 + ringIndex * 2;
        ctx.font = `${fontSize}px Helvetica, Arial, sans-serif`;

        const len = letters.length;
        for (let i = 0; i < len; i++) {
          // 稀疏模式：跳過某些字母
          if (sparseMode && i % 3 !== 0) continue;

          const ch = letters[i];
          const theta = (i / len) * Math.PI * 2 + ringRotation;

          // 加入位置抖動
          const posJitterX = Math.sin(tt * 8 + i * 3) * 2;
          const posJitterY = Math.cos(tt * 6 + i * 4) * 2;

          const x = cx + Math.cos(theta) * r + posJitterX;
          const y = cy + Math.sin(theta) * r + posJitterY;

          const tangentAngle = theta + Math.PI / 2;
          const jitter = Math.sin(tt * 4 + i * 0.5) * 0.4;
          const finalAngle = tangentAngle + jitter;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(finalAngle);

          // 更極端的大小變化
          let scale = 1;
          if (i % 13 === 0) scale = 0.3; // 極小點
          else if (i % 7 === 0) scale = 0.5;
          else if (i % 11 === 0) scale = 0.7;
          else if (i % 5 === 0) scale = 0.8;

          // 某些字母變成點
          const displayChar = (scale <= 0.3) ? "•" : ch;

          ctx.scale(scale, scale);

          // 透明度變化增加層次感
          const alpha = 0.7 + Math.sin(tt * 2 + i * 0.3) * 0.3;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

          ctx.fillText(displayChar, 0, 0);
          ctx.restore();
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [texts, sparseMode]);

  return (
    <div
      className={`bg-black flex items-center justify-center ${className}`}
      style={{
        width: "900px",
        maxWidth: "100%",
        height: "500px",
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}