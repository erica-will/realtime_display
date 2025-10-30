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
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'polling'>('connecting');
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    let es: EventSource | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;
    let pollTimer: NodeJS.Timeout | null = null;

    // 輪詢函數
    const startPolling = () => {
      console.log('開始輪詢模式');
      setConnectionStatus('polling');
      setIsPolling(true);
      
      const poll = async () => {
        try {
          const response = await fetch(`/api/poll?lastVersion=${encodeURIComponent(content.version)}`);
          const data = await response.json();
          
          if (data.hasUpdate && data.content) {
            console.log('輪詢獲得新內容:', data.content);
            setContent(data.content);
          }
        } catch (error) {
          console.error('輪詢錯誤:', error);
        }
        
        // 每 3 秒輪詢一次
        pollTimer = setTimeout(poll, 3000);
      };
      
      poll();
    };

    // 在生產環境或 Vercel 上優先使用輪詢
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercel = globalThis.location?.hostname.includes('vercel.app') || false;
    const forcePolling = isProduction || isVercel;

    if (forcePolling) {
      console.log('檢測到生產環境或 Vercel，使用輪詢模式');
      startPolling();
      return () => {
        if (pollTimer) clearTimeout(pollTimer);
      };
    }

    const connect = () => {
      setConnectionStatus('connecting');
      es = new EventSource("/api/stream");
      
      es.onopen = () => {
        console.log('SSE 連線已建立');
        setConnectionStatus('connected');
        setIsPolling(false);
        // 停止輪詢
        if (pollTimer) {
          clearTimeout(pollTimer);
          pollTimer = null;
        }
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
        
        // 5 秒後嘗試重連，如果失敗則切換到輪詢
        reconnectTimer = setTimeout(() => {
          console.log('嘗試重新連線...');
          setConnectionStatus('connecting');
          
          // 嘗試一次重連，如果失敗就切換到輪詢
          const testEs = new EventSource("/api/stream");
          const timeout = setTimeout(() => {
            console.log('SSE 重連失敗，切換到輪詢模式');
            testEs.close();
            startPolling();
          }, 5000);
          
          testEs.onopen = () => {
            clearTimeout(timeout);
            testEs.close();
            connect(); // 重新開始正常連線
          };
          
          testEs.onerror = () => {
            clearTimeout(timeout);
            testEs.close();
            startPolling();
          };
        }, 5000);
      };
    };

    connect();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (pollTimer) clearTimeout(pollTimer);
      es?.close();
    };
  }, [content.version]);

  const variants = useMemo(() => toVariants(content.effect), [content.effect]);

  const getConnectionStatusClass = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800';
      case 'polling':
        return 'bg-blue-100 text-blue-800';
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return '● 即時連線';
      case 'connecting':
        return '○ 連線中';
      case 'polling':
        return '◐ 輪詢模式';
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
