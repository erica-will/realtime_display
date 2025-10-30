"use client";

type WaveTextProps = {
  text: string;
  className?: string;
  amplitude?: number; // 位移幅度 px
  periodMs?: number;  // 完整週期
};

export default function WaveText({
  text,
  className = "",
  amplitude = 12,
  periodMs = 1200,
}: WaveTextProps) {

  // 做一個小keyframes，字上下漂
  const style = `
    @keyframes waveFloat {
      0%   { transform: translateY(0px) scaleY(1); }
      50%  { transform: translateY(-${amplitude}px) scaleY(1.05); }
      100% { transform: translateY(0px) scaleY(1); }
    }
  `;

  return (
    <div
      className={`flex flex-wrap font-extrabold text-[clamp(2rem,4vw,4rem)] leading-[0.9] text-white uppercase ${className}`}
      style={{ lineHeight: 1 }}
    >
      <style>{style}</style>

      {text.split("").map((ch, i) => {
        // 波浪的關鍵：每個字母延遲一點點
        const delay = (i * (periodMs / text.length)) % periodMs;
        return (
          <span
            key={i}
            className="inline-block will-change-transform"
            style={{
              animation: `waveFloat ${periodMs}ms ease-in-out infinite`,
              animationDelay: `${delay}ms`,
              transformOrigin: "50% 100%",
              paddingRight: ch === " " ? "0.5ch" : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
}