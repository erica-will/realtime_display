"use client";

import { ConeScene, ConfigurableCone } from "../components/ConeComponents";

export default function SimpleConeDemo() {
  return (
    <ConeScene>
      {/* 基本圓錐 */}
      <ConfigurableCone
        length={2}
        width={1}
        height={3}
        position={[0, 1.5, 0]}
        degRotation={[0, 0, 0]}
        color="#38bdf8"
      />
      
      {/* 橢圓錐 */}
      <ConfigurableCone
        length={3}
        width={0.8}
        height={2}
        position={[3, 1, 0]}
        degRotation={[0, 45, 0]}
        color="#facc15"
      />
      
      {/* 傾斜圓錐 */}
      <ConfigurableCone
        length={1.5}
        width={1.5}
        height={2.5}
        position={[-3, 1.25, 0]}
        degRotation={[15, 0, 0]}
        color="#f59e0b"
      />
    </ConeScene>
  );
}