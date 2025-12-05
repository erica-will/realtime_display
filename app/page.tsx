"use client";

import { useState } from "react";
import ActOne from "./acts/act-one";
import ActTwo from "./acts/act-two";

export default function Home() {
  const [flag, setFlag] = useState<"hall" | "act1" | "act2">("hall");

  return (
    <>
      {/* 導覽按鈕（切換 flag） */}
      <div className="fixed top-4 left-4 z-50 space-x-2">
        <button onClick={() => setFlag("hall")}>大廳</button>
        <button onClick={() => setFlag("act1")}>ActOne</button>
        <button onClick={() => setFlag("act2")}>ActTwo</button>
      </div>

      {/* 依 flag 顯示內容 */}
      {flag === "hall" && (
        <h1 className="w-full h-dvh flex items-center justify-center">
          報名大廳
        </h1>
      )}
      {flag === "act1" && <ActOne />}
      {flag === "act2" && <ActTwo />}
    </>
  );
}
