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
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    let es: EventSource | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    const connect = () => {
      setConnectionStatus('connecting');
      es = new EventSource("/api/stream");
      
      es.onopen = () => {
        console.log('SSE 連線已建立');
        setConnectionStatus('connected');
      };
      
      es.onmessage = (e) => {
        try {
          const next: DisplayContent | { type: string; message: string } = JSON.parse(e.data);
          console.log('收到 SSE 訊息:', next);
          
          // 處理控制消息
          if ('type' in next) {
            if (next.type === 'connected') {
              console.log('SSE 連線確認');
              setConnectionStatus('connected');
              return;
            }
            if (next.type === 'error') {
              console.error('SSE 錯誤:', next.message);
              setConnectionStatus('disconnected');
              return;
            }
          }
          
          // 處理內容更新
          if ('effect' in next && next.effect) {
            console.log('收到新內容:', next);
            setContent(next);
          }
        } catch (error) {
          console.error('解析 SSE 訊息失敗:', error, 'raw data:', e.data);
        }
      };
      
      es.onerror = (error) => {
        console.error('SSE 連線錯誤:', error);
        setConnectionStatus('disconnected');
        es?.close();
        
        // 5 秒後重連
        reconnectTimer = setTimeout(() => {
          console.log('嘗試重新連線...');
          connect();
        }, 5000);
      };
    };

    connect();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      es?.close();
    };
  }, []);

  const variants = useMemo(() => toVariants(content.effect), [content.effect]);

  const getConnectionStatusClass = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800';
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return '● 已連線';
      case 'connecting':
        return '○ 連線中';
      case 'disconnected':
        return '● 已斷線';
      default:
        return '○ 未知狀態';
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-8">
      {/* 連線狀態指示器 */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getConnectionStatusClass()}`}>
          {getConnectionStatusText()}
        </div>
      </div>

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
