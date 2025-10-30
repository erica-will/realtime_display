"use client";

import { useEffect, useRef } from "react";

type InfinityTextProps = {
  text: string;
  className?: string;
};

export default function InfinityText({
  text,
  className = "",
}: InfinityTextProps) {
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

    const letters = text.split("");

    // 這裡決定我們要畫幾個圈
    const RINGS = 3;

    // 每個圈的半徑（可以玩成不同大小）
    const radii = [90, 110, 90]; // 3 個圈，大小交錯一下比較有味道

    // 每個圈相對時間偏移，避免它們完全同步
    const ringPhaseOffset = [0, 0.8, 1.6];

    // 畫一個 frame
    let t = 0;
    let rafId: number;

    function draw() {
      if (!ctx) return; // 安全檢查
      
      t += 0.01; // 控制整體時間流動速度

      // 清背景
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "white";
      ctx.font = "20px Helvetica, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 我們讓整個 infinity (8 字形) 的中心在畫布中央
      const centerX = W / 2;
      const centerY = H / 2;

      // Infinity path (萊姆尼斯蓋特形狀) 的參考參數
      // param u 控制位置，然後我們把 u 跟時間 t 綁在一起
      // x = a * cos(u) / (1 + sin^2(u))
      // y = a * sin(u) * cos(u) / (1 + sin^2(u))
      // 這是其中一種∞曲線，長得很像你截圖那種左右各一圈
      const a = 160; // infinity 縮放

      for (let ringIndex = 0; ringIndex < RINGS; ringIndex++) {
        const r = radii[ringIndex];
        const tt = t + ringPhaseOffset[ringIndex]; // 讓每個圈稍微不同步

        // 取一個 "u" 來決定這個圈在∞上的位置
        // 這裡我用 tt * 某個速度，代表這個圈沿著∞在跑
        const u = tt * 0.6;

        // 算這個圈目前的中心點 (cx, cy)
        const denom = 1 + Math.pow(Math.sin(u), 2);
        const pathX = (a * Math.cos(u)) / denom;
        const pathY = (a * Math.sin(u) * Math.cos(u)) / denom;

        const cx = centerX + pathX;
        const cy = centerY + pathY;

        // 每個圈本身也可以微微旋轉，讓字母不是死的
        // 這個 angle 會影響等下每個字母的起始角度
        const ringRotation = tt * 1.2; // 旋轉速度

        // 把整段字繞圈排一圈
        const len = letters.length;
        for (let i = 0; i < len; i++) {
          const ch = letters[i];

          // 這個字母在圓周上的角度 (0 ~ 2π)
          const theta = (i / len) * Math.PI * 2 + ringRotation;

          // 字母座標
          const x = cx + Math.cos(theta) * r;
          const y = cy + Math.sin(theta) * r;

          // 我們希望字母不要全部正向，而是有一點點自己的旋轉（像 screenshot 一樣亂散）
          // 先算出該點的 tangent 角度（圓的 tangent = theta + 90度）
          const tangentAngle = theta + Math.PI / 2;

          // 再加一點 jitter / offset 讓它不那麼機械
          const jitter =
            Math.sin(tt * 3 + i * 0.7) * 0.3 +
            Math.cos(tt * 2 + i * 1.1) * 0.15;

          const finalAngle = tangentAngle + jitter;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(finalAngle);

          // screenshot 裡有些字母是比較小的點 (.) 或小字，這個我們也可以塑造：
          // 用 index 來控制大小，純粹製造隨機味道。
          // 例如每隔幾個字母縮小。
          const scale =
            (i % 7 === 0 || i % 11 === 0) ? 0.6 :
            (i % 5 === 0 ? 0.8 : 1);

          ctx.scale(scale, scale);

          ctx.fillText(ch, 0, 0);
          ctx.restore();
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [text]);

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