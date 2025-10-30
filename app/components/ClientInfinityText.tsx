"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";

const InfinityText: ComponentType<{
  text: string;
  className?: string;
}> = dynamic(() => import("./InfinityText"), {
  ssr: false,
});

export default InfinityText;