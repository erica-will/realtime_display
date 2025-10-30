// 使用 Node.js runtime 以支援長時間連線
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const channel = process.env.CHANNEL!;

  console.log('SSE 連線開始，頻道:', channel);

  // 創建 SSE 流
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let isActive = true;
      
      // 發送連線確認
      const sendMessage = (data: string) => {
        if (!isActive) return false;
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          return true;
        } catch {
          isActive = false;
          return false;
        }
      };
      
      sendMessage('{"type":"connected","message":"SSE connected"}');
      
      // 處理 Upstash 消息
      const handleUpstashMessage = (rawData: string) => {
        console.log('收到原始數據:', rawData);
        
        // Upstash 格式：message,channel,{JSON}
        if (rawData.startsWith('message,')) {
          // 找到第二個逗號的位置（channel 後面）
          const firstComma = rawData.indexOf(',');
          if (firstComma > 0) {
            const afterFirstComma = rawData.substring(firstComma + 1);
            const secondComma = afterFirstComma.indexOf(',');
            if (secondComma > 0) {
              // JSON 內容從第二個逗號後開始
              const jsonContent = afterFirstComma.substring(secondComma + 1);
              console.log('提取的 JSON 內容:', jsonContent);
              
              // 驗證是否為有效的 JSON
              try {
                JSON.parse(jsonContent);
                sendMessage(jsonContent);
              } catch (error) {
                console.log('JSON 驗證失敗:', error, '內容:', jsonContent);
              }
            }
          }
        }
      };
      
      // 啟動 Upstash 訂閱
      const startSubscription = async () => {
        try {
          const response = await fetch(`${url}/subscribe/${channel}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'text/event-stream',
            },
          });

          if (!response.ok || !response.body) {
            throw new Error(`Upstash 連線失敗: ${response.status}`);
          }

          console.log('Upstash 訂閱成功');
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (isActive) {
            const { done, value } = await reader.read();
            if (done || !isActive) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (!isActive) break;
              if (line.startsWith('data: ')) {
                handleUpstashMessage(line.slice(6));
              }
            }
          }
        } catch (error) {
          console.error('訂閱錯誤:', error);
          sendMessage('{"type":"error","message":"Connection lost"}');
        }
      };

      startSubscription();
      
      return () => {
        isActive = false;
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
