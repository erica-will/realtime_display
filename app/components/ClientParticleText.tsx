"use client";

import dynamic from 'next/dynamic';
import ParticleText from './ParticleText';

// 創建客戶端專用的 ParticleText 組件
const ClientParticleText = dynamic(() => Promise.resolve(ParticleText), {
  ssr: false,
  loading: () => (
    <div className="w-full flex justify-center items-center bg-transparent" style={{
      width: "800px",
      maxWidth: "90vw",
      height: "300px",
    }}>
      <div className="text-6xl font-extrabold text-white">Loading...</div>
    </div>
  ),
});

export default ClientParticleText;