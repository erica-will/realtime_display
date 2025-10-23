"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { DisplayContent, TransitionEffect } from "@/types/content";
import { DEFAULT_CONTENT } from "@/types/content";

export default function DisplayClient({
  initial,
}: {
  initial: DisplayContent | null;
}) {
  // 若 initial 是 null，就用 DEFAULT_CONTENT 兜底
  const [content, setContent] = useState<DisplayContent>(
    initial ?? DEFAULT_CONTENT
  );

  useEffect(() => {
    const es = new EventSource("/api/stream");
    es.onmessage = (e) => {
      try {
        const next: DisplayContent = JSON.parse(e.data);
        // 確保必要欄位存在（簡易防禦）
        if (!next || !next.effect) return;
        setContent(next);
      } catch {}
    };
    return () => es.close();
  }, []);

  const variants = useMemo(() => toVariants(content.effect), [content.effect]);

  return (
    <div className="min-h-dvh flex items-center justify-center p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={content.version || "no-version"}
          variants={variants}
          initial="initial"
          animate="enter"
          exit="exit"
          style={{ width: 800, maxWidth: "92vw" }}
        >
          <div className="rounded-2xl shadow-lg overflow-hidden bg-white">
            <Image
              src={content.imageUrl}
              alt={content.title}
              width={1200}
              height={630}
              className="w-full h-auto"
              priority
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
              <p className="text-gray-700">{content.body}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function toVariants(effect?: TransitionEffect) {
  // 若沒有 effect，給一組安全的 fade
  if (!effect)
    return {
      initial: { opacity: 0 },
      enter: { opacity: 1, transition: { duration: 0.4 } },
      exit: { opacity: 0, transition: { duration: 0.4 } },
    };

  const dur = effect.duration ?? 400;
  const t = { duration: dur / 1000 };
  switch (effect.type) {
    case "fade":
      return {
        initial: { opacity: 0 },
        enter: { opacity: 1, transition: t },
        exit: { opacity: 0, transition: t },
      };
    case "slide": {
      const dir = effect.direction ?? "right";
      const delta = 50;
      const map = {
        left: { x: -delta, opacity: 0 },
        right: { x: delta, opacity: 0 },
        up: { y: -delta, opacity: 0 },
        down: { y: delta, opacity: 0 },
      } as const;
      const init = map[dir];
      return {
        initial: init,
        enter: { x: 0, y: 0, opacity: 1, transition: t },
        exit: init,
      };
    }
    case "scale":
      return {
        initial: { scale: 0.96, opacity: 0 },
        enter: { scale: 1, opacity: 1, transition: t },
        exit: { scale: 0.98, opacity: 0, transition: t },
      };
    default:
      return {
        initial: { opacity: 0 },
        enter: { opacity: 1, transition: t },
        exit: { opacity: 0, transition: t },
      };
  }
}
