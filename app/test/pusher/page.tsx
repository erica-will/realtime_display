'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

interface PusherMessage {
  time: string;
  type: string;
  data: unknown;
}

export default function PusherTestPage() {
  const [connectionStatus, setConnectionStatus] = useState('初始化中...');
  const [messages, setMessages] = useState<PusherMessage[]>([]);

  useEffect(() => {
    // 啟用 Pusher 日誌
    Pusher.logToConsole = true;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    });

    // 監聽連線狀態
    pusher.connection.bind('connected', () => {
      setConnectionStatus('已連接 ✅');
      console.log('Pusher 連線成功');
    });

    pusher.connection.bind('connecting', () => {
      setConnectionStatus('連接中...');
    });

    pusher.connection.bind('disconnected', () => {
      setConnectionStatus('已斷線 ❌');
    });

    pusher.connection.bind('error', (error: unknown) => {
      setConnectionStatus(`連線錯誤: ${error}`);
      console.error('Pusher 連線錯誤:', error);
    });

    // 訂閱內容更新頻道
    const channel = pusher.subscribe('content-updates');
    
    channel.bind('content-changed', (data: unknown) => {
      console.log('收到內容更新:', data);
      setMessages(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        type: 'content-changed',
        data
      }]);
    });

    // 測試用：訂閱 Pusher 預設測試頻道
    const testChannel = pusher.subscribe('my-channel');
    testChannel.bind('my-event', (data: unknown) => {
      console.log('收到測試訊息:', data);
      setMessages(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        type: 'test-message',
        data
      }]);
    });

    return () => {
      pusher.disconnect();
    };
  }, []);

  const sendTestMessage = async () => {
    try {
      const response = await fetch('/api/pusher/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello from web interface!',
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        console.log('測試訊息已發送');
      }
    } catch (error) {
      console.error('發送測試訊息失敗:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Pusher 連線測試</h1>
        
        {/* 連線狀態 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">連線狀態</h2>
          <p className="text-lg">{connectionStatus}</p>
        </div>

        {/* 配置資訊 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pusher 配置</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Key:</strong> {process.env.NEXT_PUBLIC_PUSHER_KEY}</p>
            <p><strong>Cluster:</strong> {process.env.NEXT_PUBLIC_PUSHER_CLUSTER}</p>
            <p><strong>訂閱頻道:</strong> content-updates, my-channel</p>
          </div>
        </div>

        {/* 測試按鈕 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">測試功能</h2>
          <div className="space-x-4">
            <button
              onClick={sendTestMessage}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              發送測試訊息
            </button>
            <a
              href="/admin"
              target="_blank"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded inline-block"
            >
              開啟管理介面
            </a>
            <a
              href="/display/pusher"
              target="_blank"
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded inline-block"
            >
              開啟顯示頁面
            </a>
          </div>
        </div>

        {/* 訊息列表 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">接收到的訊息</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-400">尚未接收到任何訊息...</p>
            ) : (
              messages.map((msg, index) => (
                <div key={`${msg.time}-${index}`} className="bg-gray-700 rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-blue-400">{msg.type}</span>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <pre className="text-xs bg-gray-800 rounded p-2 overflow-x-auto">
                    {JSON.stringify(msg.data, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}