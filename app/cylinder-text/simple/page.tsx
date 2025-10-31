"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from "@react-three/drei";
import { Suspense } from "react";
import { CylinderWithText } from "../components/CylinderTextComponents";

export default function SimpleCylinderTextDemo() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black">
      <Canvas camera={{ position: [6, 4, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#a855f7" />

        <Suspense fallback={null}>
          {/* 螺旋文字圓柱 */}
          <CylinderWithText
            radius={1}
            height={3}
            turns={3}
            text="✨ SPIRAL MAGIC ✨"
            fontSize={0.1}
            spacing={0.025}
            curveType="spiral"
            animationSpeed={0.15}
            cylinderColor="#1e1b4b"
            textColor="#fbbf24"
            position={[0, 0, 0]}
          />

          {/* 環形跑馬燈 */}
          <CylinderWithText
            radius={0.8}
            height={2}
            turns={1}
            text="🔥 NEON RING 🔥"
            fontSize={0.12}
            spacing={0.04}
            curveType="ring"
            animationSpeed={0.4}
            cylinderColor="#7c2d12"
            textColor="#f87171"
            position={[3.5, 0, 0]}
          />

          {/* 波浪文字 */}
          <CylinderWithText
            radius={1.2}
            height={2.5}
            turns={2}
            text="🌊 WAVE FLOW 🌊"
            fontSize={0.08}
            spacing={0.03}
            curveType="wave"
            animationSpeed={0.2}
            cylinderColor="#064e3b"
            textColor="#6ee7b7"
            waveCount={3}
            waveAmplitude={0.4}
            position={[-3.5, 0, 0]}
          />

          {/* 隱形圓柱 + 浮空文字 */}
          <CylinderWithText
            radius={0.6}
            height={4}
            turns={4}
            text="👻 GHOST TEXT 👻"
            fontSize={0.09}
            spacing={0.04}
            curveType="spiral"
            animationSpeed={0.1}
            cylinderColor="#000000"
            textColor="#c084fc"
            showCylinder={false}
            position={[0, 0, 3.5]}
          />

          {/* 半透明圓柱 */}
          <CylinderWithText
            radius={1.5}
            height={1.5}
            turns={1}
            text="💎 CRYSTAL GLOW 💎"
            fontSize={0.1}
            spacing={0.06}
            curveType="ring"
            animationSpeed={0.25}
            cylinderColor="#38bdf8"
            textColor="#ffffff"
            cylinderOpacity={0.3}
            position={[0, 0, -3.5]}
          />

          {/* 地板參考線 */}
          <Grid
            args={[20, 20]}
            cellSize={1}
            cellThickness={1}
            cellColor={"#374151"}
            sectionSize={5}
            sectionThickness={1.5}
            sectionColor={"#6b7280"}
            fadeDistance={30}
            fadeStrength={1}
          />

          {/* 座標軸指示器 */}
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={["#ef4444", "#22c55e", "#3b82f6"]} labelColor="#fff" />
          </GizmoHelper>
        </Suspense>

        <OrbitControls makeDefault />
      </Canvas>

      {/* 功能說明 */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white text-sm max-w-sm">
        <h3 className="font-bold mb-3 text-cyan-400">🎯 圓柱文字展示</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span>螺旋魔法文字</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span>霓虹環形跑馬燈</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span>波浪流動文字</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-400 rounded"></div>
            <span>浮空幽靈文字</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span>水晶透明效果</span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-600 text-xs text-gray-300">
          <p>🖱️ 拖曳: 旋轉視角</p>
          <p>🖱️ 滾輪: 縮放</p>
          <p>🖱️ 右鍵: 平移</p>
        </div>
      </div>

      {/* 組件使用說明 */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white text-xs max-w-md">
        <h4 className="font-bold mb-2 text-green-400">💡 使用方式</h4>
        <pre className="text-xs text-gray-300 overflow-x-auto">
{`<CylinderWithText
  radius={1}
  height={3}
  turns={3}
  text="✨ SPIRAL MAGIC ✨"
  fontSize={0.1}
  spacing={0.025}
  curveType="spiral"
  animationSpeed={0.15}
  cylinderColor="#1e1b4b"
  textColor="#fbbf24"
/>`}
        </pre>
      </div>
    </div>
  );
}