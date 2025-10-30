"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";

const AdvancedInfinityText: ComponentType<{
  texts: string[];
  className?: string;
  sparseMode?: boolean;
}> = dynamic(() => import("./AdvancedInfinityText"), {
  ssr: false,
});

export default AdvancedInfinityText;