"use client";

import dynamic from 'next/dynamic';
import LiquidText from './LiquidText';

// 創建客戶端專用的 LiquidText 組件
const ClientLiquidText = dynamic(() => Promise.resolve(LiquidText), {
  ssr: false,
  loading: () => (
    <div className="text-[clamp(3rem,5vw,6rem)] font-extrabold text-white uppercase leading-none tracking-tight">
      <div className="w-full h-auto block text-center">Loading...</div>
    </div>
  ),
});

export default ClientLiquidText;