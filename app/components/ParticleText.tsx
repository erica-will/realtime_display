"use client";

import { useEffect, useRef } from "react";

type ParticleTextProps = {
  text: string;
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number; // target x
  ty: number; // target y
};

export default function ParticleText({ text, className = "" }: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d")!;

    const W = 800;
    const H = 300;
    canvas.width = W;
    canvas.height = H;
    off.width = W;
    off.height = H;

    // 1. 把字畫到 offscreen
    offCtx.clearRect(0, 0, W, H);
    offCtx.fillStyle = "#fff";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.font = "bold 120px sans-serif";
    offCtx.fillText(text, W / 2, H / 2);

    // 2. 取像素
    const img = offCtx.getImageData(0, 0, W, H).data;

    // 3. 取 sample 點 (步長決定顆粒數量)
    const particles: Particle[] = [];
    const gap = 6; // px step, 越小顆粒越密

    for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
            const idx = (y * W + x) * 4;
            const alpha = img[idx + 3]; // 0~255
            if (alpha > 128) {
                particles.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: 0,
                    vy: 0,
                    tx: x,
                    ty: y,
                });
            }
        }
    }

    // 4. 動畫：粒子往目標 tx,ty 移動
    let rafId: number;

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        // spring-like easing
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.vx += dx * 0.05;
        p.vy += dy * 0.05;

        // friction / damping
        p.vx *= 0.7;
        p.vy *= 0.7;

        p.x += p.vx;
        p.y += p.vy;

        // draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [text]);

  return (
    <div
      className={`w-full flex justify-center items-center bg-transparent ${className}`}
      style={{
        // 保持 canvas 比例
        width: "800px",
        maxWidth: "90vw",
        height: "300px",
      }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  );
}