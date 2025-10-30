"use client";

import dynamic from 'next/dynamic';
import GlitchText from './GlitchText';

// 創建客戶端專用的 GlitchText 組件
const ClientGlitchText = dynamic(() => Promise.resolve(GlitchText), {
  ssr: false,
  loading: () => (
    <div className="relative font-extrabold text-[clamp(2rem,4vw,4rem)] leading-none tracking-tight uppercase select-none">
      <span className="text-white block relative">Loading...</span>
    </div>
  ),
});

export default ClientGlitchText;