'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import dynamic from 'next/dynamic';
import type { DisplayContent } from '@/types/content';

// 動態導入文字效果組件（使用正確的路徑）
const TextEffects = {
  GlitchText: dynamic(() => import('@/app/components/ClientGlitchText'), { ssr: false }),
  JitterText: dynamic(() => import('@/app/components/ClientJitterText'), { ssr: false }),
  WaveText: dynamic(() => import('@/app/components/ClientWaveText'), { ssr: false }),
  LiquidText: dynamic(() => import('@/app/components/ClientLiquidText'), { ssr: false }),
  ParticleText: dynamic(() => import('@/app/components/ClientParticleText'), { ssr: false }),
  OutlineStackText: dynamic(() => import('@/app/components/ClientOutlineStackText'), { ssr: false }),
  PathMoveText: dynamic(() => import('@/app/components/ClientPathMoveText'), { ssr: false }),
  SquashStretchText: dynamic(() => import('@/app/components/ClientSquashStretchText'), { ssr: false }),
  InfinityText: dynamic(() => import('@/app/components/ClientInfinityText'), { ssr: false }),
  AdvancedInfinityText: dynamic(() => import('@/app/components/ClientAdvancedInfinityText'), { ssr: false })
};

interface ConnectionStatus {
  pusher: 'connected' | 'connecting' | 'disconnected' | 'error';
  fallback: 'inactive' | 'polling' | 'error';
}

export default function PusherDisplayClient() {
  const [content, setContent] = useState<DisplayContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    pusher: 'disconnected',
    fallback: 'inactive'
  });

  useEffect(() => {
    let pusher: Pusher | null = null;
    let pollInterval: NodeJS.Timeout | null = null;
    let isPolling = false;

    // 檢查是否有 Pusher 環境變數
    const hasPusherConfig = process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    const startPolling = () => {
      if (isPolling) return;
      isPolling = true;
      setConnectionStatus(prev => ({ ...prev, fallback: 'polling' }));
      
      const poll = async () => {
        try {
          const response = await fetch('/api/poll');
          if (response.ok) {
            const data = await response.json();
            if (data.content) {
              setContent(data.content);
            }
          }
        } catch (error) {
          console.error('輪詢錯誤:', error);
          setConnectionStatus(prev => ({ ...prev, fallback: 'error' }));
        }
      };

      poll(); // 立即執行一次
      pollInterval = setInterval(poll, 3000);
    };

    const stopPolling = () => {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
      isPolling = false;
      setConnectionStatus(prev => ({ ...prev, fallback: 'inactive' }));
    };

    const initializePusher = () => {
      if (!hasPusherConfig) {
        console.log('沒有 Pusher 配置，使用輪詢模式');
        startPolling();
        return;
      }

      try {
        setConnectionStatus(prev => ({ ...prev, pusher: 'connecting' }));
        
        pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
        });

        // 監聽連線狀態
        pusher.connection.bind('connected', () => {
          console.log('Pusher 連線成功');
          setConnectionStatus(prev => ({ ...prev, pusher: 'connected' }));
          stopPolling(); // 停止輪詢
        });

        pusher.connection.bind('disconnected', () => {
          console.log('Pusher 連線斷開');
          setConnectionStatus(prev => ({ ...prev, pusher: 'disconnected' }));
          // 啟用輪詢作為後備方案
          setTimeout(startPolling, 1000);
        });

        pusher.connection.bind('error', (error: unknown) => {
          console.error('Pusher 連線錯誤:', error);
          setConnectionStatus(prev => ({ ...prev, pusher: 'error' }));
          // 啟用輪詢作為後備方案
          setTimeout(startPolling, 1000);
        });

        // 訂閱內容更新頻道
        const channel = pusher.subscribe('content-updates');
        channel.bind('content-changed', (data: DisplayContent) => {
          console.log('收到 Pusher 更新:', data);
          setContent(data);
        });

      } catch (error) {
        console.error('Pusher 初始化失敗:', error);
        setConnectionStatus(prev => ({ ...prev, pusher: 'error' }));
        startPolling();
      }
    };

    // 獲取初始內容
    const fetchInitialContent = async () => {
      try {
        const response = await fetch('/api/content/current');
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        }
      } catch (error) {
        console.error('獲取初始內容失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialContent();
    initializePusher();

    return () => {
      if (pusher) {
        pusher.disconnect();
      }
      stopPolling();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">載入中...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">等待內容...</div>
      </div>
    );
  }

  // 渲染文字效果
  const renderTextEffect = () => {
    if (content.effect.type === 'custom' && content.effect.name) {
      const effectName = content.effect.name;
      
      // 特殊處理需要不同 props 的組件
      if (effectName === 'AdvancedInfinityText') {
        const AdvancedComponent = TextEffects.AdvancedInfinityText;
        return <AdvancedComponent texts={[content.title]} />;
      }
      
      // 其他組件都使用 text prop
      const EffectComponent = TextEffects[effectName as keyof typeof TextEffects];
      if (EffectComponent && effectName !== 'AdvancedInfinityText') {
        const Component = EffectComponent as React.ComponentType<{ text: string; className?: string }>;
        return <Component text={content.title} />;
      }
    }
    
    // 預設效果
    return <div className="text-white text-4xl font-bold">{content.title}</div>;
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 連線狀態指示器 */}
      <div className="fixed top-4 right-4 z-50 space-y-1">
        <div className={`px-2 py-1 rounded text-xs ${
          connectionStatus.pusher === 'connected' 
            ? 'bg-green-600' 
            : connectionStatus.pusher === 'connecting'
            ? 'bg-yellow-600'
            : connectionStatus.pusher === 'error'
            ? 'bg-red-600'
            : 'bg-gray-600'
        }`}>
          Pusher: {connectionStatus.pusher}
        </div>
        {connectionStatus.fallback !== 'inactive' && (
          <div className={`px-2 py-1 rounded text-xs ${
            connectionStatus.fallback === 'polling' ? 'bg-blue-600' : 'bg-red-600'
          }`}>
            輪詢: {connectionStatus.fallback === 'polling' ? '運行中' : '錯誤'}
          </div>
        )}
      </div>

      {/* 背景圖片 */}
      {content.imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${content.imageUrl})` }}
        />
      )}

      {/* 主要內容 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* 標題（使用動態效果） */}
        <div className="mb-8 text-center">
          {renderTextEffect()}
        </div>

        {/* 內容 */}
        <div className="max-w-4xl text-center">
          <p className="text-xl md:text-2xl leading-relaxed opacity-90">
            {content.body}
          </p>
        </div>

        {/* 版本資訊 */}
        <div className="absolute bottom-4 left-4 text-xs opacity-50">
          版本: {content.version}
        </div>
      </div>
    </div>
  );
}