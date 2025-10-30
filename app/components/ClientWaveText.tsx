"use client";

import dynamic from 'next/dynamic';
import WaveText from './WaveText';

const ClientWaveText = dynamic(() => Promise.resolve(WaveText), {
  ssr: false,
  loading: () => (
    <div className="flex flex-wrap font-extrabold text-[clamp(2rem,4vw,4rem)] leading-[0.9] text-white uppercase">
      Loading...
    </div>
  ),
});

export default ClientWaveText;