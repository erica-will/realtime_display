"use client";
import { motion } from "framer-motion";

export default function MultiMoveDownScaleFadeLoop() {
  const text = "I WILL BECOME MAN";
  const texts = text.split("");
  const moveDistance = 300; // 👈 下移距離(px)
  const scaleRange = [1.5, 1, 0, 1, 1.5]; // 👈 縮放範圍
  const opacityRange = [1, 0.7, 0, 0.7, 1]; // 👈 淡入淡出範圍

  return (
    <div className="flex items-center justify-center p-10 w-full h-full relative">
      <div className="flex items-center justify-center space-x-2 w-full h-full absolute top-0 left-0">
        {texts.map((t, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, scale: 0, opacity: 1 }}
            animate={{
              y: [
                moveDistance / 3,
                moveDistance,
                (moveDistance / 3) * 2,
                0,
                moveDistance / 3,
              ],
              scale: scaleRange,
              opacity: opacityRange,
            }}
            transition={{
              duration: 9, // 一次完整動畫時間
              delay: i * 0.05, // 👈 階梯延遲
              repeat: Infinity, // 👈 無限循環
              repeatDelay: 0, // 每輪間隔
              ease: [
                [0.1, 0, 0.2, 1], // KF0→KF1：慢慢煞到 moveDistance
                [0.8, 0, 0.8, 0], // KF1→KF2：瞬間離開 moveDistance
                [0.1, 0, 0.2, 1], // KF2→KF3：靠近 0 時再煞
                [0.8, 0, 0.8, 0], // KF3→KF4：從 0 爆衝離開
              ],
            }}
            className="text-3xl font-bold"
          >
            {t}
          </motion.div>
        ))}
      </div>
      {/* <div className="flex items-center justify-center space-x-2 w-full h-full absolute top-0 left-0">
        {texts.map((t, i) => (
          <motion.div
            key={i}
            initial={{ y: 10, scale: 0, opacity: 1 }}
            animate={{
              y: [
                0 + 10,
                moveDistance / 2 + 10,
                moveDistance + 10,
                moveDistance / 2 + 10,
                0 + 10,
              ],
              scale: scaleRange,
              opacity: opacityRange,
            }}
            transition={{
              duration: 5, // 一次完整動畫時間
              delay: i * 0.05, // 👈 階梯延遲
              repeat: Infinity, // 👈 無限循環
              repeatDelay: 0, // 每輪間隔
              ease: "linear",
            }}
            className="text-3xl font-bold"
          >
            {t}
          </motion.div>
        ))}
      </div> */}
    </div>
  );
}
