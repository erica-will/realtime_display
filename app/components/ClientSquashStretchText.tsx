"use client";

import dynamic from 'next/dynamic';
import SquashStretchText from './SquashStretchText';

const ClientSquashStretchText = dynamic(() => Promise.resolve(SquashStretchText), {
  ssr: false,
  loading: () => (
    <div className="font-black text-[clamp(2rem,3vw,3.5rem)] leading-[0.9] uppercase text-white">
      Loading...
    </div>
  ),
});

export default ClientSquashStretchText;