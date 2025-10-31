"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from "@react-three/drei";
import { Suspense } from "react";

type ConeObjectProps = {
  radius?: number;      // 半徑
  height?: number;      // 高度
  radialSegments?: number;
  position?: [number, number, number];
  rotation?: [number, number, number]; // 弧度
  scale?: [number, number, number];    // 可用來模擬 "長寬高" 拉伸
  color?: string;
};

function ConeObject({
  radius = 1,
  height = 2,
  radialSegments = 32,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = "#ff7f50",
}: ConeObjectProps) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      {/* ConeGeometry args: radius, height, radialSegments */}
      <coneGeometry args={[radius, height, radialSegments]} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} />
    </mesh>
  );
}

type ConfigurableConeProps = {
  length: number; // X 方向外觀長度
  width: number;  // Z 方向外觀寬度 (直徑)
  height: number; // Y 方向高度
  position?: [number, number, number];
  degRotation?: [number, number, number]; // 用角度給, 比較直覺
  color?: string;
};

// helper: 把角度轉弧度
const toRad = (deg: number) => (deg * Math.PI) / 180;

function ConfigurableCone({
  length,
  width,
  height,
  position = [0, height / 2, 0],
  degRotation = [0, 0, 0],
  color = "#38bdf8",
}: ConfigurableConeProps) {
  // 圓錐基底我們用一個「平均半徑」，然後再用 scale 去調長寬
  const baseRadius = Math.max(length, width) / 2; // 取較大的一邊來確保包覆
  const scaleX = length / (baseRadius * 2); // 希望最終X方向總長 ≈ length
  const scaleZ = width / (baseRadius * 2);  // 希望最終Z方向總寬 ≈ width

  const rotationRad: [number, number, number] = [
    toRad(degRotation[0]),
    toRad(degRotation[1]),
    toRad(degRotation[2]),
  ];

  return (
    <ConeObject
      radius={baseRadius}
      height={height}
      radialSegments={64}
      position={position}
      rotation={rotationRad}
      scale={[scaleX, 1, scaleZ]}
      color={color}
    />
  );
}

export default function ConePage() {
  return (
    <div className="w-full h-screen bg-[#0f172a]">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }} // 初始視角
      >
        {/* 燈光 */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1} />

        {/* 用 Suspense 包起來是 react-three-fiber 的常見習慣 */}
        <Suspense fallback={null}>
          {/* === 基礎圓錐體範例 === */}
          <ConeObject
            radius={1}                  // 控制寬 (底部半徑)
            height={2}                  // 控制高
            radialSegments={64}         // 邊越多越圓滑
            position={[2, 1, 0]}        // X, Y, Z 在空間裡放哪
            rotation={[0, Math.PI / 4, 0]} // 旋轉 (繞X,繞Y,繞Z) 單位是弧度
            scale={[1, 1, 1]}           // 基本縮放
            color="#38bdf8"             // tailwind sky-400 類似色
          />

          {/* === 可配置圓錐體範例 === */}
          <ConfigurableCone
            length={2}               // 想像成 "長" (X)
            width={1}                // 想像成 "寬" (Z)
            height={3}               // 高度 (Y)
            position={[-2, 1.5, 0]}  // 放在世界座標哪
            degRotation={[0, 45, 0]} // 角度用度數
            color="#facc15"          // 類似黃色
          />

          {/* === 橢圓錐範例 === */}
          <ConfigurableCone
            length={3}               // 長橢圓
            width={0.8}              // 窄
            height={2}               // 中等高度
            position={[0, 1, 2]}     // 後方
            degRotation={[15, 0, 30]} // 傾斜放置
            color="#f59e0b"          // 橙色
          />

          {/* 地板參考線 */}
          <Grid
            args={[20, 20]}
            cellSize={1}
            cellThickness={1}
            cellColor={"#4b5563"}
            sectionSize={5}
            sectionThickness={1.5}
            sectionColor={"#9ca3af"}
            fadeDistance={30}
            fadeStrength={1}
          />

          {/* 世界座標軸小工具 (右下角小羅盤) */}
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={["#ef4444", "#22c55e", "#3b82f6"]} labelColor="#fff" />
          </GizmoHelper>
        </Suspense>

        {/* 滑鼠拖曳旋轉 / 滾輪縮放 / 右鍵平移 */}
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}