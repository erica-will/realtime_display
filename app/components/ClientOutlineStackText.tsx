"use client";

import dynamic from 'next/dynamic';
import OutlineStackText from './OutlineStackText';

// 創建客戶端專用的 OutlineStackText 組件
const ClientOutlineStackText = dynamic(() => Promise.resolve(OutlineStackText), {
  ssr: false,
  loading: () => (
    <div className="relative font-black uppercase leading-[0.9] tracking-[-0.04em] text-[clamp(2rem,3vw,3.5rem)]">
      <span className="relative text-white block">Loading...</span>
    </div>
  ),
});

export default ClientOutlineStackText;