"use client";

import dynamic from 'next/dynamic';
import JitterText from './JitterText';

const ClientJitterText = dynamic(() => Promise.resolve(JitterText), {
  ssr: false,
  loading: () => (
    <div className="font-extrabold uppercase text-white text-[clamp(2rem,4vw,4rem)] leading-none tracking-tight">
      Loading...
    </div>
  ),
});

export default ClientJitterText;