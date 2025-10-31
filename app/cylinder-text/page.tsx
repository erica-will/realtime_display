"use client";

import * as THREE from "three";
import { useMemo, useState, Suspense, useRef } from "react";
import { Text, OrbitControls, Grid, GizmoHelper, GizmoViewport } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

/**
 * 自訂一條貼在圓柱表面的螺旋曲線
 * - R: 圓柱半徑
 * - height: 總高度
 * - turns: 轉幾圈
 *
 * t: [0,1]
 * θ(t) = turns * 2π * t
 * y(t) = -height/2 + height * t  (從下往上)
 * x,z 根據 R 和 θ(t)
 */
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

/**
 * 固定高度繞圓柱一圈的曲線
 */
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

/**
 * S 形波浪圓柱曲線
 */
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
    
    // 基礎角度 + 波浪調變
    const baseTheta = Math.PI * 2 * t;
    const wave = Math.sin(this.waveCount * Math.PI * 2 * t) * this.amplitude;
    const theta = baseTheta + wave;
    
    const x = this.R * Math.cos(theta);
    const z = this.R * Math.sin(theta);
    return optionalTarget.set(x, y, z);
  }
}

/**
 * 把文字沿著曲線依序擺上去
 */
interface TextOnCurveProps {
  text: string;
  curve: THREE.Curve<THREE.Vector3>;
  fontSize: number;
  spacing: number;
  color: string;
  animationSpeed: number;
}

function TextOnCurve({
  text = "HELLO CYLINDER",
  curve,
  fontSize = 0.2,
  spacing = 0.05,
  color = "#fff",
  animationSpeed = 0,
}: Readonly<TextOnCurveProps>) {
  const groupRef = useRef<THREE.Group>(null);
  const [timeOffset, setTimeOffset] = useState(0);

  // 動畫效果
  useFrame((state, delta) => {
    if (animationSpeed > 0) {
      setTimeOffset(prev => prev + delta * animationSpeed);
    }
  });

  const letters = text.split("");

  // 計算每個字的 position + quaternion
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
      if (t < 0) t += 1; // 確保 t 在 [0,1]

      // 位置 P(t)
      curve.getPoint(t, tmpPos);

      // 切線 T(t) ≈ P(t+ε) - P(t)
      const eps = 0.001;
      const nextT = (t + eps) % 1;
      curve.getPoint(nextT, nextPos);
      tangent.copy(nextPos).sub(tmpPos).normalize();

      // 法線方向(朝外)：對圓柱來說，朝外方向就是從Y軸往外的向量
      const outward = new THREE.Vector3(tmpPos.x, 0, tmpPos.z).normalize();

      // "上"方向 = outward 與 tangent 的外積
      const up = new THREE.Vector3().crossVectors(outward, tangent).normalize();

      // 建立座標系：X軸=tangent, Y軸=up, Z軸=outward
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
  radius?: number;
  height?: number;
  turns?: number;
  text?: string;
  fontSize?: number;
  spacing?: number;
  curveType?: 'spiral' | 'ring' | 'wave';
  animationSpeed?: number;
  cylinderColor?: string;
  textColor?: string;
}

function CylinderWithText({
  radius = 1,
  height = 2,
  turns = 2,
  text = "HELLO CYLINDER 你好世界",
  fontSize = 0.15,
  spacing = 0.03,
  curveType = 'spiral',
  animationSpeed = 0,
  cylinderColor = '#1f2937',
  textColor = '#fff'
}: Readonly<CylinderWithTextProps>) {
  
  // 根據類型建立不同的曲線
  const curve = useMemo(() => {
    switch (curveType) {
      case 'ring':
        return new CylinderRingCurve(radius, 0, turns);
      case 'wave':
        return new CylinderWaveCurve(radius, height, turns, 0.3);
      case 'spiral':
      default:
        return new CylinderSpiralCurve(radius, height, turns);
    }
  }, [radius, height, turns, curveType]);

  return (
    <>
      {/* 圓柱本體 */}
      <mesh>
        <cylinderGeometry args={[radius, radius, height, 64, 1]} />
        <meshStandardMaterial
          color={cylinderColor}
          metalness={0.3}
          roughness={0.4}
          wireframe={false}
        />
      </mesh>

      {/* 沿著曲線放文字 */}
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

export default function CylinderTextPage() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-black">
      <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#4f46e5" />

        <Suspense fallback={null}>
          {/* 基礎螺旋文字圓柱 */}
          <CylinderWithText
            radius={1}
            height={2}
            turns={2}
            text="✨ SPIRAL TEXT ✨"
            fontSize={0.12}
            spacing={0.035}
            curveType="spiral"
            animationSpeed={0.1}
            cylinderColor="#1e293b"
            textColor="#60a5fa"
          />

          {/* 環形跑馬燈 */}
          <group position={[3, 0, 0]}>
            <CylinderWithText
              radius={0.8}
              height={1.5}
              turns={1}
              text="🔥 RING MARQUEE 🔥"
              fontSize={0.1}
              spacing={0.04}
              curveType="ring"
              animationSpeed={0.3}
              cylinderColor="#7c2d12"
              textColor="#fb7185"
            />
          </group>

          {/* 波浪形文字 */}
          <group position={[-3, 0, 0]}>
            <CylinderWithText
              radius={1.2}
              height={2.5}
              turns={1.5}
              text="🌊 WAVE CURVE 🌊"
              fontSize={0.13}
              spacing={0.04}
              curveType="wave"
              animationSpeed={0.15}
              cylinderColor="#065f46"
              textColor="#34d399"
            />
          </group>

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

      {/* 說明文字 */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white text-sm max-w-xs">
        <h3 className="font-bold mb-2">🎯 3D 圓柱文字展示</h3>
        <div className="space-y-1 text-xs">
          <p><span className="text-blue-400">左:</span> 螺旋文字</p>
          <p><span className="text-pink-400">中:</span> 環形跑馬燈</p>
          <p><span className="text-green-400">右:</span> 波浪曲線</p>
        </div>
        <div className="mt-3 text-xs text-gray-300">
          <p>🖱️ 拖曳: 旋轉視角</p>
          <p>🖱️ 滾輪: 縮放</p>
          <p>🖱️ 右鍵: 平移</p>
        </div>
      </div>
    </div>
  );
}