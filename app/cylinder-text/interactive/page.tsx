"use client";

import * as THREE from "three";
import { useMemo, useState } from "react";
import { Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from "@react-three/drei";
import { Suspense, useRef } from "react";

// 重用曲線類別
class CylinderSpiralCurve extends THREE.Curve<THREE.Vector3> {
  R: number;
  height: number;
  turns: number;

  constructor(R = 1, height = 2, turns = 1) {
    super();
    this.R = R;
    this.height = height;
    this.turns = turns;
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    const theta = this.turns * Math.PI * 2 * t;
    const y = -this.height / 2 + this.height * t;
    const x = this.R * Math.cos(theta);
    const z = this.R * Math.sin(theta);
    return optionalTarget.set(x, y, z);
  }
}

class CylinderRingCurve extends THREE.Curve<THREE.Vector3> {
  R: number;
  height: number;
  turns: number;

  constructor(R = 1, height = 0, turns = 1) {
    super();
    this.R = R;
    this.height = height;
    this.turns = turns;
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    const theta = this.turns * Math.PI * 2 * t;
    const y = this.height;
    const x = this.R * Math.cos(theta);
    const z = this.R * Math.sin(theta);
    return optionalTarget.set(x, y, z);
  }
}

class CylinderWaveCurve extends THREE.Curve<THREE.Vector3> {
  R: number;
  height: number;
  waveCount: number;
  amplitude: number;

  constructor(R = 1, height = 2, waveCount = 2, amplitude = 0.3) {
    super();
    this.R = R;
    this.height = height;
    this.waveCount = waveCount;
    this.amplitude = amplitude;
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    const y = -this.height / 2 + this.height * t;
    const baseTheta = Math.PI * 2 * t;
    const wave = Math.sin(this.waveCount * Math.PI * 2 * t) * this.amplitude;
    const theta = baseTheta + wave;
    const x = this.R * Math.cos(theta);
    const z = this.R * Math.sin(theta);
    return optionalTarget.set(x, y, z);
  }
}

interface TextOnCurveProps {
  text: string;
  curve: THREE.Curve<THREE.Vector3>;
  fontSize: number;
  spacing: number;
  color: string;
  animationSpeed: number;
}

function TextOnCurve({
  text,
  curve,
  fontSize,
  spacing,
  color,
  animationSpeed,
}: TextOnCurveProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [timeOffset, setTimeOffset] = useState(0);

  useFrame((state, delta) => {
    if (animationSpeed > 0) {
      setTimeOffset(prev => prev + delta * animationSpeed);
    }
  });

  const letters = text.split("");

  const letterTransforms = useMemo(() => {
    const data: {
      char: string;
      position: [number, number, number];
      quaternion: THREE.Quaternion;
    }[] = [];

    const tmpPos = new THREE.Vector3();
    const nextPos = new THREE.Vector3();
    const tangent = new THREE.Vector3();

    for (let i = 0; i < letters.length; i++) {
      let t = (i * spacing + timeOffset) % 1;
      if (t < 0) t += 1;

      curve.getPoint(t, tmpPos);

      const eps = 0.001;
      const nextT = (t + eps) % 1;
      curve.getPoint(nextT, nextPos);
      tangent.copy(nextPos).sub(tmpPos).normalize();

      const outward = new THREE.Vector3(tmpPos.x, 0, tmpPos.z).normalize();
      const up = new THREE.Vector3().crossVectors(outward, tangent).normalize();

      const basisMatrix = new THREE.Matrix4().makeBasis(tangent, up, outward);
      const q = new THREE.Quaternion().setFromRotationMatrix(basisMatrix);

      data.push({
        char: letters[i],
        position: [tmpPos.x, tmpPos.y, tmpPos.z],
        quaternion: q.clone(),
      });
    }

    return data;
  }, [letters, curve, spacing, timeOffset]);

  return (
    <group ref={groupRef}>
      {letterTransforms.map((item, idx) => (
        <Text
          key={`${idx}-${item.char}`}
          position={item.position}
          quaternion={item.quaternion}
          fontSize={fontSize}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {item.char}
        </Text>
      ))}
    </group>
  );
}

interface CylinderWithTextProps {
  radius: number;
  height: number;
  turns: number;
  text: string;
  fontSize: number;
  spacing: number;
  curveType: 'spiral' | 'ring' | 'wave';
  animationSpeed: number;
  cylinderColor: string;
  textColor: string;
  waveCount?: number;
  waveAmplitude?: number;
}

function CylinderWithText({
  radius,
  height,
  turns,
  text,
  fontSize,
  spacing,
  curveType,
  animationSpeed,
  cylinderColor,
  textColor,
  waveCount = 2,
  waveAmplitude = 0.3,
}: CylinderWithTextProps) {
  
  const curve = useMemo(() => {
    switch (curveType) {
      case 'ring':
        return new CylinderRingCurve(radius, 0, turns);
      case 'wave':
        return new CylinderWaveCurve(radius, height, waveCount, waveAmplitude);
      case 'spiral':
      default:
        return new CylinderSpiralCurve(radius, height, turns);
    }
  }, [radius, height, turns, curveType, waveCount, waveAmplitude]);

  return (
    <>
      <mesh>
        <cylinderGeometry args={[radius, radius, height, 64, 1]} />
        <meshStandardMaterial
          color={cylinderColor}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      <TextOnCurve
        text={text}
        curve={curve}
        fontSize={fontSize}
        spacing={spacing}
        color={textColor}
        animationSpeed={animationSpeed}
      />
    </>
  );
}

interface ControlPanelProps {
  // 圓柱參數
  radius: number;
  height: number;
  
  // 曲線參數
  turns: number;
  curveType: 'spiral' | 'ring' | 'wave';
  waveCount: number;
  waveAmplitude: number;
  
  // 文字參數
  text: string;
  fontSize: number;
  spacing: number;
  animationSpeed: number;
  
  // 顏色
  cylinderColor: string;
  textColor: string;
  
  // 回調函數
  onRadiusChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onTurnsChange: (value: number) => void;
  onCurveTypeChange: (value: 'spiral' | 'ring' | 'wave') => void;
  onWaveCountChange: (value: number) => void;
  onWaveAmplitudeChange: (value: number) => void;
  onTextChange: (value: string) => void;
  onFontSizeChange: (value: number) => void;
  onSpacingChange: (value: number) => void;
  onAnimationSpeedChange: (value: number) => void;
  onCylinderColorChange: (value: string) => void;
  onTextColorChange: (value: string) => void;
}

function ControlPanel({
  radius, height, turns, curveType, waveCount, waveAmplitude,
  text, fontSize, spacing, animationSpeed,
  cylinderColor, textColor,
  onRadiusChange, onHeightChange, onTurnsChange, onCurveTypeChange,
  onWaveCountChange, onWaveAmplitudeChange, onTextChange, onFontSizeChange,
  onSpacingChange, onAnimationSpeedChange, onCylinderColorChange, onTextColorChange,
}: ControlPanelProps) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 text-white text-sm max-h-[90vh] overflow-y-auto w-80">
      <h3 className="text-lg font-bold mb-4 text-center text-cyan-400">🎯 圓柱文字控制台</h3>
      
      {/* 圓柱尺寸 */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-blue-300">📏 圓柱尺寸</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs mb-1">半徑: {radius.toFixed(2)}</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={radius}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">高度: {height.toFixed(2)}</label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={height}
              onChange={(e) => onHeightChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 曲線類型 */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-purple-300">🌊 曲線類型</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs mb-2">軌道類型</label>
            <select
              value={curveType}
              onChange={(e) => onCurveTypeChange(e.target.value as 'spiral' | 'ring' | 'wave')}
              className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
            >
              <option value="spiral">🌀 螺旋</option>
              <option value="ring">⭕ 環形</option>
              <option value="wave">🌊 波浪</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs mb-1">圈數/強度: {turns.toFixed(1)}</label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={turns}
              onChange={(e) => onTurnsChange(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {curveType === 'wave' && (
            <>
              <div>
                <label className="block text-xs mb-1">波浪數量: {waveCount}</label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={waveCount}
                  onChange={(e) => onWaveCountChange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">波浪幅度: {waveAmplitude.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={waveAmplitude}
                  onChange={(e) => onWaveAmplitudeChange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 文字設定 */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-green-300">✍️ 文字設定</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs mb-1">文字內容</label>
            <input
              type="text"
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              placeholder="輸入你的文字..."
            />
          </div>
          
          <div>
            <label className="block text-xs mb-1">字體大小: {fontSize.toFixed(3)}</label>
            <input
              type="range"
              min="0.05"
              max="0.3"
              step="0.005"
              value={fontSize}
              onChange={(e) => onFontSizeChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-xs mb-1">字距: {spacing.toFixed(3)}</label>
            <input
              type="range"
              min="0.01"
              max="0.1"
              step="0.005"
              value={spacing}
              onChange={(e) => onSpacingChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-xs mb-1">動畫速度: {animationSpeed.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={animationSpeed}
              onChange={(e) => onAnimationSpeedChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 顏色設定 */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-yellow-300">🎨 顏色設定</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs mb-1">圓柱顏色</label>
            <div className="flex space-x-2 mb-2">
              {['#1e293b', '#7c2d12', '#065f46', '#1e1b4b', '#581c87'].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded border-2 ${cylinderColor === color ? 'border-white' : 'border-gray-500'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onCylinderColorChange(color)}
                />
              ))}
            </div>
            <input
              type="color"
              value={cylinderColor}
              onChange={(e) => onCylinderColorChange(e.target.value)}
              className="w-full h-8 rounded"
            />
          </div>
          
          <div>
            <label className="block text-xs mb-1">文字顏色</label>
            <div className="flex space-x-2 mb-2">
              {['#ffffff', '#60a5fa', '#fb7185', '#34d399', '#fbbf24', '#a78bfa'].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded border-2 ${textColor === color ? 'border-white' : 'border-gray-500'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onTextColorChange(color)}
                />
              ))}
            </div>
            <input
              type="color"
              value={textColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              className="w-full h-8 rounded"
            />
          </div>
        </div>
      </div>

      {/* 預設按鈕 */}
      <div className="space-y-2">
        <button
          onClick={() => {
            onRadiusChange(1);
            onHeightChange(2);
            onTurnsChange(2);
            onCurveTypeChange('spiral');
            onWaveCountChange(2);
            onWaveAmplitudeChange(0.3);
            onTextChange('HELLO WORLD ✨');
            onFontSizeChange(0.12);
            onSpacingChange(0.03);
            onAnimationSpeedChange(0.1);
            onCylinderColorChange('#1e293b');
            onTextColorChange('#60a5fa');
          }}
          className="w-full bg-cyan-600 hover:bg-cyan-700 px-3 py-2 rounded text-sm"
        >
          🔄 重設預設值
        </button>
      </div>
    </div>
  );
}

export default function InteractiveCylinderText() {
  // 圓柱參數
  const [radius, setRadius] = useState(1);
  const [height, setHeight] = useState(2);
  
  // 曲線參數
  const [turns, setTurns] = useState(2);
  const [curveType, setCurveType] = useState<'spiral' | 'ring' | 'wave'>('spiral');
  const [waveCount, setWaveCount] = useState(2);
  const [waveAmplitude, setWaveAmplitude] = useState(0.3);
  
  // 文字參數
  const [text, setText] = useState('HELLO WORLD ✨');
  const [fontSize, setFontSize] = useState(0.12);
  const [spacing, setSpacing] = useState(0.03);
  const [animationSpeed, setAnimationSpeed] = useState(0.1);
  
  // 顏色
  const [cylinderColor, setCylinderColor] = useState('#1e293b');
  const [textColor, setTextColor] = useState('#60a5fa');

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black relative">
      {/* 控制面板 */}
      <ControlPanel
        radius={radius}
        height={height}
        turns={turns}
        curveType={curveType}
        waveCount={waveCount}
        waveAmplitude={waveAmplitude}
        text={text}
        fontSize={fontSize}
        spacing={spacing}
        animationSpeed={animationSpeed}
        cylinderColor={cylinderColor}
        textColor={textColor}
        onRadiusChange={setRadius}
        onHeightChange={setHeight}
        onTurnsChange={setTurns}
        onCurveTypeChange={setCurveType}
        onWaveCountChange={setWaveCount}
        onWaveAmplitudeChange={setWaveAmplitude}
        onTextChange={setText}
        onFontSizeChange={setFontSize}
        onSpacingChange={setSpacing}
        onAnimationSpeedChange={setAnimationSpeed}
        onCylinderColorChange={setCylinderColor}
        onTextColorChange={setTextColor}
      />

      {/* 3D 場景 */}
      <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#4f46e5" />

        <Suspense fallback={null}>
          <CylinderWithText
            radius={radius}
            height={height}
            turns={turns}
            text={text}
            fontSize={fontSize}
            spacing={spacing}
            curveType={curveType}
            animationSpeed={animationSpeed}
            cylinderColor={cylinderColor}
            textColor={textColor}
            waveCount={waveCount}
            waveAmplitude={waveAmplitude}
          />

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

          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={["#ef4444", "#22c55e", "#3b82f6"]} labelColor="#fff" />
          </GizmoHelper>
        </Suspense>

        <OrbitControls makeDefault />
      </Canvas>

      {/* 操作說明 */}
      <div className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
        <div className="space-y-1">
          <p>🖱️ <strong>拖曳</strong>：旋轉視角</p>
          <p>🖱️ <strong>滾輪</strong>：縮放</p>
          <p>🖱️ <strong>右鍵</strong>：平移</p>
          <p>⚡ <strong>即時調整</strong>：左側控制台</p>
        </div>
      </div>
    </div>
  );
}