"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from "@react-three/drei";
import { Suspense } from "react";

export type ConeObjectProps = {
  radius?: number;      // 半徑
  height?: number;      // 高度
  radialSegments?: number;
  position?: [number, number, number];
  rotation?: [number, number, number]; // 弧度
  scale?: [number, number, number];    // 可用來模擬 "長寬高" 拉伸
  color?: string;
};

export function ConeObject({
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
      <coneGeometry args={[radius, height, radialSegments]} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} />
    </mesh>
  );
}

export type ConfigurableConeProps = {
  length: number; // X 方向外觀長度
  width: number;  // Z 方向外觀寬度 (直徑)
  height: number; // Y 方向高度
  position?: [number, number, number];
  degRotation?: [number, number, number]; // 用角度給, 比較直覺
  color?: string;
};

// helper: 把角度轉弧度
const toRad = (deg: number) => (deg * Math.PI) / 180;

export function ConfigurableCone({
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

export type ConeSceneProps = {
  children?: React.ReactNode;
  cameraPosition?: [number, number, number];
  showGrid?: boolean;
  showGizmo?: boolean;
  className?: string;
};

export function ConeScene({
  children,
  cameraPosition = [5, 5, 5],
  showGrid = true,
  showGizmo = true,
  className = "w-full h-screen bg-[#0f172a]",
}: ConeSceneProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: cameraPosition, fov: 50 }}>
        {/* 預設燈光 */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1} />

        <Suspense fallback={null}>
          {children}

          {/* 地板參考線 */}
          {showGrid && (
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
          )}

          {/* 座標軸指示器 */}
          {showGizmo && (
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
              <GizmoViewport axisColors={["#ef4444", "#22c55e", "#3b82f6"]} labelColor="#fff" />
            </GizmoHelper>
          )}
        </Suspense>

        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}