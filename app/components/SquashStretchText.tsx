"use client";

type SquashStretchTextProps = {
  text: string;
  className?: string;
  periodMs?: number;
};

export default function SquashStretchText({
  text,
  className = "",
  periodMs = 900,
}: SquashStretchTextProps) {
  const style = `
    @keyframes squashStretch {
      0%   { transform: scaleY(1) scaleX(1); }
      20%  { transform: scaleY(1.3) scaleX(0.8); } /* 拉長 */
      50%  { transform: scaleY(0.7) scaleX(1.3); } /* 壓扁 */
      80%  { transform: scaleY(1.15) scaleX(0.9); }/* 回彈 */
      100% { transform: scaleY(1) scaleX(1); }
    }
  `;

  return (
    <div
      className={`font-black text-[clamp(2rem,3vw,3.5rem)] leading-[0.9] uppercase text-white flex flex-wrap gap-x-[0.05em] ${className}`}
    >
      <style>{style}</style>

      {text.split("").map((ch, i) => {
        const delay = (i * (periodMs / text.length)) % periodMs;
        return (
          <span
            key={i}
            className="inline-block will-change-transform origin-bottom"
            style={{
              animation: `squashStretch ${periodMs}ms ease-in-out infinite`,
              animationDelay: `${delay}ms`,
              display: "inline-block",
              minWidth: ch === " " ? "0.5ch" : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
}