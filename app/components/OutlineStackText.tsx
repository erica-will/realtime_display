"use client";

type OutlineStackTextProps = {
  text: string;
  className?: string;
};

export default function OutlineStackText({
  text,
  className = "",
}: OutlineStackTextProps) {
  return (
    <div
      className={`relative font-black uppercase leading-[0.9] tracking-[-0.04em] text-[clamp(2rem,3vw,3.5rem)] ${className}`}
    >
      {/* 底層：厚實外框 */}
      <span
        className="absolute top-[4px] left-[4px] text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.15)] drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] select-none"
        aria-hidden
      >
        {text}
      </span>

      {/* 中間層：對比色 outline */}
      <span
        className="absolute top-[2px] left-[2px] text-transparent [-webkit-text-stroke:2px_rgb(0,0,0)] select-none"
        aria-hidden
      >
        {text}
      </span>

      {/* 最上層：實心字 */}
      <span className="relative text-white block">{text}</span>
    </div>
  );
}