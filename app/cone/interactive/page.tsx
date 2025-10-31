"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from "@react-three/drei";
import { Suspense, useState } from "react";

type ConeObjectProps = {
  radius?: number;
  height?: number;
  radialSegments?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
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
      <coneGeometry args={[radius, height, radialSegments]} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} />
    </mesh>
  );
}

type ConfigurableConeProps = {
  length: number;
  width: number;
  height: number;
  position?: [number, number, number];
  degRotation?: [number, number, number];
  color?: string;
};

const toRad = (deg: number) => (deg * Math.PI) / 180;

function ConfigurableCone({
  length,
  width,
  height,
  position = [0, height / 2, 0],
  degRotation = [0, 0, 0],
  color = "#38bdf8",
}: ConfigurableConeProps) {
  const baseRadius = Math.max(length, width) / 2;
  const scaleX = length / (baseRadius * 2);
  const scaleZ = width / (baseRadius * 2);

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

interface ControlPanelProps {
  length: number;
  width: number;
  height: number;
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  color: string;
  onLengthChange: (value: number) => void;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onPosXChange: (value: number) => void;
  onPosYChange: (value: number) => void;
  onPosZChange: (value: number) => void;
  onRotXChange: (value: number) => void;
  onRotYChange: (value: number) => void;
  onRotZChange: (value: number) => void;
  onColorChange: (value: string) => void;
}

function ControlPanel({
  length, width, height,
  posX, posY, posZ,
  rotX, rotY, rotZ,
  color,
  onLengthChange, onWidthChange, onHeightChange,
  onPosXChange, onPosYChange, onPosZChange,
  onRotXChange, onRotYChange, onRotZChange,
  onColorChange,
}: ControlPanelProps) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 text-white text-sm max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-bold mb-4 text-center">3D 圓錐控制台</h3>
      
      {/* 尺寸控制 */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-blue-300">📏 尺寸</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-xs mb-1">長度 (Length): {length.toFixed(1)}</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={length}
              onChange={(e) => onLengthChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">寬度 (Width): {width.toFixed(1)}</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={width}
              onChange={(e) => onWidthChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">高度 (Height): {height.toFixed(1)}</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={height}
              onChange={(e) => onHeightChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 位置控制 */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-green-300">📍 位置</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-xs mb-1">X: {posX.toFixed(1)}</label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={posX}
              onChange={(e) => onPosXChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Y: {posY.toFixed(1)}</label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={posY}
              onChange={(e) => onPosYChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Z: {posZ.toFixed(1)}</label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={posZ}
              onChange={(e) => onPosZChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 旋轉控制 */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-yellow-300">🔄 旋轉 (度)</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-xs mb-1">X軸: {rotX}°</label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={rotX}
              onChange={(e) => onRotXChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Y軸: {rotY}°</label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={rotY}
              onChange={(e) => onRotYChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Z軸: {rotZ}°</label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={rotZ}
              onChange={(e) => onRotZChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 顏色控制 */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2 text-purple-300">🎨 顏色</h4>
        <div className="flex space-x-2">
          {['#ff7f50', '#38bdf8', '#facc15', '#f59e0b', '#ef4444', '#22c55e', '#8b5cf6'].map((presetColor) => (
            <button
              key={presetColor}
              className={`w-8 h-8 rounded border-2 ${color === presetColor ? 'border-white' : 'border-gray-500'}`}
              style={{ backgroundColor: presetColor }}
              onClick={() => onColorChange(presetColor)}
            />
          ))}
        </div>
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-full mt-2 h-8 rounded"
        />
      </div>

      {/* 預設按鈕 */}
      <div className="space-y-2">
        <button
          onClick={() => {
            onLengthChange(2);
            onWidthChange(1);
            onHeightChange(3);
            onPosXChange(0);
            onPosYChange(1.5);
            onPosZChange(0);
            onRotXChange(0);
            onRotYChange(0);
            onRotZChange(0);
            onColorChange('#38bdf8');
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm"
        >
          重設預設值
        </button>
      </div>
    </div>
  );
}

export default function InteractiveConeController() {
  // 狀態管理
  const [length, setLength] = useState(2);
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(3);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(1.5);
  const [posZ, setPosZ] = useState(0);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);
  const [color, setColor] = useState('#38bdf8');

  return (
    <div className="w-full h-screen bg-[#0f172a] relative">
      {/* 控制面板 */}
      <ControlPanel
        length={length}
        width={width}
        height={height}
        posX={posX}
        posY={posY}
        posZ={posZ}
        rotX={rotX}
        rotY={rotY}
        rotZ={rotZ}
        color={color}
        onLengthChange={setLength}
        onWidthChange={setWidth}
        onHeightChange={setHeight}
        onPosXChange={setPosX}
        onPosYChange={setPosY}
        onPosZChange={setPosZ}
        onRotXChange={setRotX}
        onRotYChange={setRotY}
        onRotZChange={setRotZ}
        onColorChange={setColor}
      />

      {/* 3D 場景 */}
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1} />

        <Suspense fallback={null}>
          {/* 可控制的圓錐體 */}
          <ConfigurableCone
            length={length}
            width={width}
            height={height}
            position={[posX, posY, posZ]}
            degRotation={[rotX, rotY, rotZ]}
            color={color}
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

          {/* 座標軸指示器 */}
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={["#ef4444", "#22c55e", "#3b82f6"]} labelColor="#fff" />
          </GizmoHelper>
        </Suspense>

        <OrbitControls makeDefault />
      </Canvas>

      {/* 操作說明 */}
      <div className="absolute bottom-4 right-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
        <div className="space-y-1">
          <p>🖱️ <strong>拖曳</strong>：旋轉視角</p>
          <p>🖱️ <strong>滾輪</strong>：縮放</p>
          <p>🖱️ <strong>右鍵</strong>：平移</p>
        </div>
      </div>
    </div>
  );
}