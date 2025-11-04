"use client";
import { motion } from "framer-motion";

export default function MultiMoveDownScaleFadeLoop() {
  const text = "hello world it's me your friendly neighborhood developer";
  const texts = text.split("");
  const moveDistance = 250; // 下移距離(px)
  const scaleRange = [0.4, 1, 0.4, 0, 0.4]; // 縮放範圍
  const opacityRange = [1, 1, 1, 0, 1]; // 淡入淡出範圍
  const scaleRangeReverse = [0.4, 0, 0.4, 1, 0.4]; // 縮放範圍
  const opacityRangeReverse = [1, 0, 1, 1, 1]; // 淡入淡出範圍
  const n = 5; // 👈 想要幾組動畫
  const layerGap = 20; // 👈 每組之間的Y偏移差距(px)

  return (
    <div className="flex items-center justify-center p-10 w-full h-full relative">
      {Array.from({ length: n }).map((_, layerIndex) => (
        <div
          key={layerIndex}
          className="flex items-center justify-center space-x-2 w-full h-full absolute top-0 left-0"
        >
          {texts.map((t, i) => (
            <motion.div
              key={i}
              initial={{ y: 0, scale: 0, opacity: 1 }}
              animate={{
                y: [
                  0 + layerIndex * layerGap,
                  moveDistance + layerIndex * layerGap,
                  0 + layerIndex * layerGap,
                ],
                scale: scaleRange,
                opacity: opacityRange,
              }}
              transition={{
                duration: 9, // 一次完整動畫時間
                delay: i * 0.07 + layerIndex * 0.1, // 👈 每層也有微延遲
                repeat: Infinity, // 無限循環
                times: [0, 0.5, 1],
                ease: [[0.0, 0.3, 0.7, 1.0]], // 平滑往返
              }}
              className="text-3xl font-bold"
            >
              {t}
            </motion.div>
          ))}
        </div>
      ))}
      {Array.from({ length: n }).map((_, layerIndex) => (
        <div
          key={layerIndex}
          className="flex items-center justify-center space-x-2 w-full h-full absolute top-0 left-0"
        >
          {texts.map((t, i) => (
            <motion.div
              key={i}
              initial={{ y: 0, scale: 0, opacity: 1 }}
              animate={{
                y: [
                  moveDistance + layerIndex * layerGap,
                  0 + layerIndex * layerGap,
                  moveDistance + layerIndex * layerGap,
                ],
                scale: scaleRangeReverse,
                opacity: opacityRangeReverse,
              }}
              transition={{
                duration: 9, // 一次完整動畫時間
                delay: i * 0.07 + layerIndex * 0.1, // 👈 每層也有微延遲
                repeat: Infinity, // 無限循環
                times: [0, 0.5, 1],
                ease: [[0.0, 0.3, 0.7, 1.0]], // 平滑往返
              }}
              className="text-3xl font-bold"
            >
              {t}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
