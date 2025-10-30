# WebSocket 即時連線解決方案

如果你不想使用輪詢模式，想要保持即時連線，以下是幾種替代方案：

## 1. Pusher (推薦)
專業的即時通訊服務，支援 WebSocket 連線

### 安裝
```bash
npm install pusher pusher-js
```

### 後端設定 (app/api/pusher/route.ts)
```typescript
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true
});

export async function POST(request: Request) {
  const data = await request.json();
  
  // 發送即時更新
  await pusher.trigger('content-channel', 'content-updated', data);
  
  return Response.json({ success: true });
}
```

### 前端使用 (DisplayClient.tsx)
```typescript
import Pusher from 'pusher-js';

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
});

const channel = pusher.subscribe('content-channel');
channel.bind('content-updated', (data) => {
  setContent(data);
});
```

## 2. Ably
另一個專業的即時通訊服務

### 安裝
```bash
npm install ably
```

### 使用方式類似 Pusher

## 3. Socket.IO + 外部伺服器
在 VPS 或其他雲端服務上架設 Socket.IO 伺服器

## 4. Supabase Realtime
使用 Supabase 的即時資料庫功能

### 安裝
```bash
npm install @supabase/supabase-js
```

### 設定
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 監聽即時更新
supabase
  .channel('content-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'content'
  }, (payload) => {
    setContent(payload.new);
  })
  .subscribe();
```

## 推薦方案比較

| 方案 | 優點 | 缺點 | 成本 |
|------|------|------|------|
| Pusher | 易用、穩定、豐富功能 | 付費服務 | 免費額度 → 付費 |
| Ably | 功能強大、可靠性高 | 付費服務 | 免費額度 → 付費 |
| Socket.IO | 自主控制、免費 | 需要維護伺服器 | VPS 成本 |
| Supabase | 整合資料庫、即時功能 | 學習曲線 | 免費額度很高 |

## 建議
1. **簡單專案**: 使用 Pusher (免費額度通常足夠)
2. **複雜專案**: 使用 Supabase (整合資料庫)
3. **完全控制**: 自架 Socket.IO 伺服器

你想要我實作哪一種方案？