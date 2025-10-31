"use client";

import * as THREE from "three";
import { useMemo, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

/**
 * 自訂圓柱表面螺旋曲線
 */
export class CylinderSpiralCurve extends THREE.Curve<THREE.Vector3> {
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
 * 圓柱表面環形曲線
 */
export class CylinderRingCurve extends THREE.Curve<THREE.Vector3> {
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
 * 圓柱表面波浪曲線
 */
export class CylinderWaveCurve extends THREE.Curve<THREE.Vector3> {
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

/**
 * 沿曲線放置文字組件的 Props
 */
export interface TextOnCurveProps {
  text?: string;
  curve: THREE.Curve<THREE.Vector3>;
  fontSize?: number;
  spacing?: number;
  color?: string;
  animationSpeed?: number;
  font?: string;
}

/**
 * 沿曲線放置文字的組件
 */
export function TextOnCurve({
  text = "HELLO WORLD",
  curve,
  fontSize = 0.2,
  spacing = 0.05,
  color = "#ffffff",
  animationSpeed = 0,
  font,
}: TextOnCurveProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [timeOffset, setTimeOffset] = useState(0);

  // 動畫效果
  useFrame((state, delta) => {
    if (animationSpeed > 0) {
      setTimeOffset(prev => prev + delta * animationSpeed);
    }
  });

  const letters = text.split("");

  // 計算每個字的位置和方向
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

      // 取得位置
      curve.getPoint(t, tmpPos);

      // 計算切線
      const eps = 0.001;
      const nextT = (t + eps) % 1;
      curve.getPoint(nextT, nextPos);
      tangent.copy(nextPos).sub(tmpPos).normalize();

      // 計算法線（朝外）
      const outward = new THREE.Vector3(tmpPos.x, 0, tmpPos.z).normalize();

      // 計算上方向
      const up = new THREE.Vector3().crossVectors(outward, tangent).normalize();

      // 建立座標系
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
          font={font}
        >
          {item.char}
        </Text>
      ))}
    </group>
  );
}

/**
 * 圓柱文字組件的 Props
 */
export interface CylinderWithTextProps {
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
  waveCount?: number;
  waveAmplitude?: number;
  position?: [number, number, number];
  showCylinder?: boolean;
  cylinderOpacity?: number;
}

/**
 * 帶文字的圓柱組件
 */
export function CylinderWithText({
  radius = 1,
  height = 2,
  turns = 1,
  text = "HELLO WORLD",
  fontSize = 0.15,
  spacing = 0.04,
  curveType = 'spiral',
  animationSpeed = 0,
  cylinderColor = "#1e293b",
  textColor = "#ffffff",
  waveCount = 2,
  waveAmplitude = 0.3,
  position = [0, 0, 0],
  showCylinder = true,
  cylinderOpacity = 1,
}: CylinderWithTextProps) {
  
  // 根據類型建立曲線
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
    <group position={position}>
      {/* 圓柱本體 */}
      {showCylinder && (
        <mesh>
          <cylinderGeometry args={[radius, radius, height, 64, 1]} />
          <meshStandardMaterial
            color={cylinderColor}
            metalness={0.3}
            roughness={0.4}
            transparent={cylinderOpacity < 1}
            opacity={cylinderOpacity}
          />
        </mesh>
      )}

      {/* 文字 */}
      <TextOnCurve
        text={text}
        curve={curve}
        fontSize={fontSize}
        spacing={spacing}
        color={textColor}
        animationSpeed={animationSpeed}
      />
    </group>
  );
}

/**
 * 建立不同類型的曲線的工廠函數
 */
export const createCylinderCurve = {
  spiral: (radius: number, height: number, turns: number) => 
    new CylinderSpiralCurve(radius, height, turns),
  
  ring: (radius: number, height: number, turns: number) => 
    new CylinderRingCurve(radius, height, turns),
  
  wave: (radius: number, height: number, waveCount: number, amplitude: number) => 
    new CylinderWaveCurve(radius, height, waveCount, amplitude),
};

/**
 * 預設的曲線類型
 */
export type CurveType = 'spiral' | 'ring' | 'wave';