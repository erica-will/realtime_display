# Vercel 部署指南

## 🚀 部署到 Vercel

### 1. 環境變數設定

在 Vercel Dashboard 中設定以下環境變數：

```bash
UPSTASH_REDIS_REST_URL=https://crucial-gar-7626.upstash.io
UPSTASH_REDIS_REST_TOKEN=AR3KAAImcDIyZjcxYTI1ZjMxYTI0ZTg1YWQyMTY5NDczOGRlYWFjN3AyNzYyNg
ADMIN_TOKEN=your-secret-admin-token
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
CHANNEL=content:updates
CURRENT_KEY=content:current
```

⚠️ **重要**：確保 `NEXT_PUBLIC_BASE_URL` 設定為你的 Vercel 應用 URL。

### 2. SSE 和輪詢機制

由於 Vercel 的 Serverless Functions 限制，我們實現了雙重機制：

#### SSE (本地開發)
- 使用 Server-Sent Events 進行即時通信
- 適用於本地開發環境

#### 輪詢 (Vercel 生產環境)
- 系統自動檢測 Vercel 環境
- 自動切換到輪詢模式 (每 3 秒檢查一次)
- 確保在生產環境中的可靠性

### 3. 連線狀態指示

顯示頁面右上角的狀態指示器：
- 🟢 **即時連線**：SSE 正常工作
- 🔵 **輪詢模式**：使用輪詢機制 (Vercel)
- 🟡 **連線中**：正在建立連線
- 🔴 **已斷線**：連線失敗

### 4. Vercel 配置

`vercel.json` 配置：

```json
{
  "functions": {
    "app/api/stream/route.ts": {
      "runtime": "nodejs20.x",
      "maxDuration": 300
    }
  },
  "headers": [
    {
      "source": "/api/stream",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        },
        {
          "key": "Connection",
          "value": "keep-alive"
        }
      ]
    }
  ]
}
```

### 5. 部署步驟

1. **推送代碼到 GitHub**：
   ```bash
   git add .
   git commit -m "Add Vercel deployment support"
   git push
   ```

2. **連接 Vercel**：
   - 在 Vercel Dashboard 導入 GitHub 專案
   - 設定環境變數
   - 部署

3. **測試功能**：
   - 訪問部署的 URL
   - 檢查連線狀態是否顯示"輪詢模式"
   - 測試後台發佈功能

### 6. 常見問題排解

#### SSE 不工作
- **原因**：Vercel Serverless Functions 對長連線有限制
- **解決**：系統自動切換到輪詢模式

#### 環境變數錯誤
- **檢查**：Vercel Dashboard > Settings > Environment Variables
- **確認**：所有變數都已正確設定

#### 輪詢延遲
- **說明**：輪詢模式有 3 秒延遲，這是正常的
- **調整**：可在 DisplayClient.tsx 中修改輪詢間隔

### 7. 效能考量

#### 輪詢頻率
- 預設：3 秒間隔
- 平衡：即時性 vs 服務器負載
- 可根據需求調整

#### Function 執行時間
- 設定：最大 300 秒 (Vercel Pro)
- 適用：長時間 SSE 連線

#### 成本考量
- 輪詢模式會增加 API 調用次數
- 建議在 Vercel Pro 計畫中使用

### 8. 監控和調試

#### 客戶端調試
打開瀏覽器開發者工具 Console：

```javascript
// 查看連線狀態
console.log('Connection Status:', status);

// 查看輪詢請求
// Network tab 中查看 /api/poll 請求
```

#### 服務端調試
在 Vercel Dashboard > Functions 中查看：
- Function 執行日誌
- 錯誤信息
- 執行時間

### 9. 生產環境最佳實踐

1. **使用 CDN**：圖片資源使用 CDN 或圖床
2. **監控**：設置 Vercel Analytics
3. **錯誤追蹤**：集成 Sentry 或類似服務
4. **快取策略**：適當設置 API 回應快取

### 10. 升級路徑

如需更好的即時性，可考慮：

1. **Vercel Edge Functions**：對於簡單的即時需求
2. **WebSocket 服務**：使用外部 WebSocket 服務
3. **Pusher/Ably**：專業的即時通信服務
4. **自託管**：在支援 WebSocket 的平台部署

## 📝 部署檢查清單

- [ ] 環境變數已設定
- [ ] NEXT_PUBLIC_BASE_URL 正確
- [ ] Redis 連線正常
- [ ] 輪詢模式運作正常
- [ ] 後台管理功能正常
- [ ] 圖片 URL 可訪問
- [ ] 連線狀態顯示正確

完成以上檢查後，你的應用應該能在 Vercel 上正常運行！