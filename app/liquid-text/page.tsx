"use client";

import { useState } from "react";
import Link from "next/link";
import AdvancedLiquidText from "@/app/components/AdvancedLiquidText";
import LiquidTextRotating from "@/app/components/LiquidTextRotating";

type DemoMode = "basic" | "advanced" | "rotating";

export default function LiquidTextPage() {
  const [mode, setMode] = useState<DemoMode>("advanced");
  const [customText, setCustomText] = useState("LIQUID MAGIC");
  const [intensity, setIntensity] = useState(30);
  const [speed, setSpeed] = useState(1);
  const [turbulenceType, setTurbulenceType] = useState<"fractalNoise" | "turbulence">("fractalNoise");

  if (mode === "rotating") {
    return (
      <div className="relative">
        <LiquidTextRotating
          words={["EXPERIMENT", "LIQUID TEXT", "NEXT.JS", "SVG FILTER", "BEHANCE STYLE"]}
          intensity={intensity}
          speed={speed}
          turbulenceType={turbulenceType}
        />
        
        {/* 模式切換按鈕 */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Link
            href="/text-effects"
            className="px-3 py-1 bg-red-500/80 text-white text-sm rounded hover:bg-red-600 transition-colors"
          >
            ← Back
          </Link>
          <button
            onClick={() => setMode("basic")}
            className="px-3 py-1 bg-white/20 text-white text-sm rounded hover:bg-white/30 transition-colors"
          >
            Basic
          </button>
          <button
            onClick={() => setMode("advanced")}
            className="px-3 py-1 bg-white/20 text-white text-sm rounded hover:bg-white/30 transition-colors"
          >
            Advanced
          </button>
          <button
            onClick={() => setMode("rotating")}
            className="px-3 py-1 bg-white/40 text-white text-sm rounded"
          >
            Rotating
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <AdvancedLiquidText
        text={customText}
        intensity={intensity}
        speed={speed}
        turbulenceType={turbulenceType}
      />

      {/* 控制面板 */}
      <div className="absolute top-4 left-4 bg-black/80 p-4 rounded-lg text-white space-y-3 min-w-64">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Liquid Text Controls</h3>
          <Link
            href="/text-effects"
            className="px-2 py-1 bg-red-500/80 text-white text-xs rounded hover:bg-red-600 transition-colors"
          >
            ← Back
          </Link>
        </div>
        
        {/* 模式切換 */}
        <div>
          <div className="text-sm font-medium">Mode:</div>
          <div className="flex gap-1 mt-1">
            <button
              onClick={() => setMode("basic")}
              className={`px-2 py-1 text-xs rounded ${mode === "basic" ? "bg-blue-500" : "bg-white/20"} hover:bg-blue-400 transition-colors`}
            >
              Basic
            </button>
            <button
              onClick={() => setMode("advanced")}
              className={`px-2 py-1 text-xs rounded ${mode === "advanced" ? "bg-blue-500" : "bg-white/20"} hover:bg-blue-400 transition-colors`}
            >
              Advanced
            </button>
            <button
              onClick={() => setMode("rotating")}
              className="px-2 py-1 text-xs rounded bg-white/20 hover:bg-blue-400 transition-colors"
            >
              Rotating
            </button>
          </div>
        </div>

        {/* 文字輸入 */}
        <div>
          <label htmlFor="text-input" className="text-sm font-medium">Text:</label>
          <input
            id="text-input"
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full mt-1 px-2 py-1 bg-white/20 rounded text-white placeholder-white/50 text-sm"
            placeholder="Enter your text..."
          />
        </div>

        {/* 強度控制 */}
        <div>
          <label htmlFor="intensity-slider" className="text-sm font-medium">Intensity: {intensity}</label>
          <input
            id="intensity-slider"
            type="range"
            min="5"
            max="100"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full mt-1"
          />
        </div>

        {/* 速度控制 */}
        <div>
          <label htmlFor="speed-slider" className="text-sm font-medium">Speed: {speed}x</label>
          <input
            id="speed-slider"
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full mt-1"
          />
        </div>

        {/* 噪波類型 */}
        <div>
          <label htmlFor="turbulence-select" className="text-sm font-medium">Turbulence Type:</label>
          <select
            id="turbulence-select"
            value={turbulenceType}
            onChange={(e) => setTurbulenceType(e.target.value as "fractalNoise" | "turbulence")}
            className="w-full mt-1 px-2 py-1 bg-white/20 rounded text-white text-sm"
          >
            <option value="fractalNoise">Fractal Noise (雲煙感)</option>
            <option value="turbulence">Turbulence (水波感)</option>
          </select>
        </div>

        {/* 預設效果按鈕 */}
        <div>
          <div className="text-sm font-medium">Presets:</div>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <button
              onClick={() => {
                setIntensity(15);
                setSpeed(0.5);
                setTurbulenceType("fractalNoise");
              }}
              className="px-2 py-1 bg-green-600/80 hover:bg-green-500 rounded text-xs transition-colors"
            >
              Gentle
            </button>
            <button
              onClick={() => {
                setIntensity(50);
                setSpeed(1.5);
                setTurbulenceType("turbulence");
              }}
              className="px-2 py-1 bg-orange-600/80 hover:bg-orange-500 rounded text-xs transition-colors"
            >
              Wild
            </button>
            <button
              onClick={() => {
                setIntensity(80);
                setSpeed(2);
                setTurbulenceType("fractalNoise");
              }}
              className="px-2 py-1 bg-red-600/80 hover:bg-red-500 rounded text-xs transition-colors"
            >
              Extreme
            </button>
            <button
              onClick={() => {
                setIntensity(30);
                setSpeed(1);
                setTurbulenceType("fractalNoise");
              }}
              className="px-2 py-1 bg-blue-600/80 hover:bg-blue-500 rounded text-xs transition-colors"
            >
              Default
            </button>
          </div>
        </div>

        {/* 說明 */}
        <div className="text-xs text-white/60 leading-relaxed">
          <p>🌊 SVG Filter 液體文字效果</p>
          <p>• Fractal Noise: 雲霧般的柔和扭曲</p>
          <p>• Turbulence: 水波般的動態扭曲</p>
          <p>• 強度越高，文字變形越明顯</p>
          <p>• 速度控制動畫節奏</p>
        </div>
      </div>

      {/* 右下角資訊 */}
      <div className="absolute bottom-4 right-4 text-white/40 text-xs">
        <p>Behance-style Liquid Text</p>
        <p>SVG Filter + requestAnimationFrame</p>
      </div>
    </div>
  );
}