"use client";

import { useId } from "react";

type PathMoveTextProps = {
  text: string;
  className?: string;
  durationMs?: number;
};

export default function PathMoveText({
  text,
  className = "",
  durationMs = 6000,
}: PathMoveTextProps) {
  const uniq = useId().replace(/:/g, "_"); // 避免重複 keyframes 名稱衝到

  // 路徑說明：
  // M 起點
  // C 貝茲曲線控制點
  // 這條路徑你可以隨便畫（用 Figma/Illustrator 匯出 path d 甚至更直觀）
  const pathD =
    "M 0 100 C 150 -50, 300 250, 450 100 C 600 -50, 700 250, 800 100";

  const keyframesName = `movePath_${uniq}`;

  const style = `
    @keyframes ${keyframesName} {
      0%   { offset-distance: 0%; }
      100% { offset-distance: 100%; }
    }
  `;

  return (
    <div
      className={`relative w-[800px] max-w-[90vw] h-[200px] ${className}`}
      style={{ color: "white" }}
    >
      {/* 動畫文字 */}
      <div
        className="absolute top-0 left-0 font-bold uppercase text-[clamp(1.5rem,2vw,2.5rem)] tracking-tight whitespace-nowrap"
        style={{
          offsetPath: `path("${pathD}")`,
          animation: `${keyframesName} ${durationMs}ms linear infinite`,
          // 讓文字永遠正面朝上，而不是沿路徑旋轉
          offsetRotate: "0deg",
        } as React.CSSProperties}
      >
        {text}
      </div>

      {/* 用 SVG 畫出路徑(純展示 / debug用，可拿掉) */}
      <svg
        viewBox="0 0 800 200"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
      >
        <path d={pathD} fill="none" stroke="white" strokeDasharray="4 4" />
      </svg>

      {/* 動態注入 keyframes */}
      <style>{style}</style>
    </div>
  );
}