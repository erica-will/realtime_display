# Pusher 即時連線設定指南

## 🚀 為什麼選擇 Pusher？

- ✅ **真正的即時連線** - WebSocket 連線，毫秒級更新
- ✅ **完美支援 Vercel** - 無需長連線伺服器
- ✅ **自動降級機制** - Pusher 不可用時自動切換到輪詢
- ✅ **免費額度充足** - 每月 200,000 訊息免費
- ✅ **簡單易用** - 幾行程式碼就能實作

## 📋 設定步驟

### 1. 註冊 Pusher 帳號

1. 前往 [Pusher.com](https://pusher.com/)
2. 點擊 "Sign up" 註冊免費帳號
3. 驗證 email 後登入

### 2. 建立新應用

1. 在 Pusher Dashboard 點擊 "Create app"
2. 填寫應用資訊：
   - **App name**: `realtime-display`
   - **Cluster**: 選擇離你最近的區域（建議 `ap1` 亞太區域）
   - **Tech stack**: 選擇 "React"
3. 點擊 "Create app"

### 3. 取得 API 金鑰

在應用的 "Keys" 頁面，你會看到：
- **app_id**: 應用 ID
- **key**: 公開金鑰
- **secret**: 私密金鑰  
- **cluster**: 區域代碼

### 4. 配置環境變數

在你的 `.env.local` 檔案中加入：

```bash
# Pusher 後端配置
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster

# Pusher 前端配置（這兩個會暴露給前端）
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
```

### 5. Vercel 部署配置

在 Vercel Dashboard 的 Environment Variables 中加入所有上述變數。

## 🖥️ 使用方式

### 新的即時顯示頁面

訪問：`https://your-domain.vercel.app/display/pusher`

這個新頁面支援：
- 真正的即時 WebSocket 連線
- 自動降級到輪詢（如果 Pusher 不可用）
- 連線狀態指示器
- 所有現有的文字效果

### 原有頁面保持不變

原有的 `/display` 頁面仍然可用，使用輪詢機制。

## 🔧 工作原理

### 發布內容時
1. 內容儲存到 Redis
2. **同時** 廣播到 Pusher 和 Redis 頻道
3. 所有連線的用戶立即收到更新

### 用戶端連線
1. 優先嘗試 Pusher WebSocket 連線
2. 如果成功：使用即時 WebSocket
3. 如果失敗：自動降級到 3 秒輪詢
4. 顯示即時連線狀態

## 📊 連線狀態指示器

頁面右上角會顯示：
- 🟢 **Pusher: connected** - WebSocket 連線正常
- 🟡 **Pusher: connecting** - 正在連線中
- 🔴 **Pusher: error** - 連線失敗
- 🔵 **輪詢: 運行中** - 使用輪詢模式

## 💰 費用說明

### Pusher 免費額度
- 每月 200,000 訊息
- 100 同時連線
- 無限頻道

### 實際使用估算
以你的使用情境，每月費用幾乎為 0：
- 假設 10 個並發用戶
- 每小時更新 10 次內容
- 每月約 7,200 訊息（遠低於 20 萬限制）

## 🆚 對比方案

| 功能 | 輪詢 (目前) | Pusher | 自架 Socket.IO |
|------|-------------|--------|----------------|
| 即時性 | 3 秒延遲 | 毫秒級 | 毫秒級 |
| 伺服器負載 | 高 | 無 | 中 |
| 設定複雜度 | 低 | 低 | 高 |
| 維護成本 | 無 | 低 | 高 |
| 月費用 | 無 | 免費額度 | VPS 費用 |

## 🎯 建議

1. **立即啟用 Pusher** - 免費額度充足，大幅提升用戶體驗
2. **保留輪詢機制** - 作為後備方案，確保系統穩定性
3. **監控使用量** - Pusher Dashboard 可查看訊息使用情況

## 🔧 故障排除

### Pusher 連線失敗
- 檢查環境變數是否正確設定
- 確認 cluster 區域是否正確
- 查看瀏覽器開發者工具的 Network 和 Console

### 仍然使用輪詢
- 檢查 `NEXT_PUBLIC_PUSHER_KEY` 是否設定
- 確認 Pusher 帳號是否啟用
- 重新部署確保環境變數生效

有任何問題都可以隨時詢問！