"use client";

import dynamic from 'next/dynamic';
import PathMoveText from './PathMoveText';

const ClientPathMoveText = dynamic(() => Promise.resolve(PathMoveText), {
  ssr: false,
  loading: () => (
    <div className="relative w-[800px] max-w-[90vw] h-[200px] flex items-center justify-center">
      <div className="font-bold uppercase text-[clamp(1.5rem,2vw,2.5rem)] tracking-tight text-white">
        Loading...
      </div>
    </div>
  ),
});

export default ClientPathMoveText;