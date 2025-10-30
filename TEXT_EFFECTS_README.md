# Realtime Display with Creative Text Effects

一個結合即時顯示功能與創意文字特效的 Next.js 專案，展示了從簡單到複雜的四種文字視覺特效實現。

## 🎨 文字特效組件

### 1. GlitchText - 故障風格文字
- **技術**：純 CSS + JavaScript
- **特色**：多層文字疊加 + mix-blend-mode + 隨機抖動
- **效果**：Cyberpunk / Glitch / Chromatic Aberration 風格
- **使用**：`<GlitchText text="YOUR TEXT" />`

### 2. OutlineStackText - 疊描邊文字
- **技術**：純 CSS
- **特色**：多層描邊 + 立體偏移效果
- **效果**：類似手動分色印刷的視覺效果
- **使用**：`<OutlineStackText text="YOUR TEXT" />`

### 3. LiquidText - 液態扭曲文字
- **技術**：SVG Filter + feTurbulence + feDisplacementMap
- **特色**：動態噪波扭曲，模擬液態文字效果
- **效果**：文字看起來像被熱融或流體扭曲
- **使用**：`<LiquidText text="YOUR TEXT" />`

### 4. ParticleText - 粒子化文字
- **技術**：Canvas + getImageData + 粒子系統
- **特色**：文字轉換為粒子，動態聚合效果
- **效果**：科技感十足的粒子文字動畫
- **使用**：`<ParticleText text="YOUR TEXT" />`

## 🚀 即時顯示功能

### API 端點
- `POST /api/content/publish` - 發佈內容
- `GET /api/content/current` - 獲取當前內容
- `GET /api/stream` - SSE 串流訂閱

### 顯示頁面
- `/display` - 即時內容顯示頁面，支援 SSE 自動更新

## 📁 專案結構

```
app/
├── components/                 # 文字特效組件
│   ├── GlitchText.tsx         # 故障風格文字
│   ├── OutlineStackText.tsx   # 疊描邊文字
│   ├── LiquidText.tsx         # 液態扭曲文字
│   └── ParticleText.tsx       # 粒子化文字
├── text-effects/              # 文字特效展示頁面
│   └── page.tsx
├── display/                   # 即時顯示功能
│   ├── page.tsx
│   └── DisplayClient.tsx
├── api/                       # API 路由
│   ├── content/
│   │   ├── current/route.ts
│   │   └── publish/route.ts
│   └── stream/route.ts
├── page.tsx                   # 主頁面
└── layout.tsx
```

## 🎯 使用方式

### 基本使用
```tsx
import GlitchText from "./components/GlitchText";
import OutlineStackText from "./components/OutlineStackText";
import LiquidText from "./components/LiquidText";
import ParticleText from "./components/ParticleText";

export default function Page() {
  return (
    <main className="bg-black text-white min-h-screen p-24">
      <GlitchText text="DISTORT REALITY" />
      <OutlineStackText text="CREATIVE / CODE / ENERGY" />
      <LiquidText text="FLUID FUTURE" />
      <ParticleText text="MOVE" />
    </main>
  );
}
```

### 自定義樣式
每個組件都支援 `className` prop 來添加自定義樣式：

```tsx
<GlitchText 
  text="CUSTOM STYLE" 
  className="text-blue-500 scale-150" 
/>
```

## 🛠 技術棧

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Upstash Redis
- **Real-time**: Server-Sent Events (SSE)
- **Animation**: Canvas API, SVG Filters, CSS Transforms
- **Validation**: Zod

## 🎨 設計理念

這些文字特效的設計遵循以下原則：

1. **模組化**: 每個特效都是獨立的 React 組件
2. **可重用**: 通過 `text` prop 支援動態內容
3. **漸進增強**: 從簡單的 CSS 到複雜的 Canvas 實現
4. **響應式**: 支援各種螢幕尺寸
5. **性能優化**: 合理使用 requestAnimationFrame 和記憶體管理

## 📚 延伸學習

### CSS 層級特效
- mix-blend-mode 混合模式
- CSS transforms 和 filters
- CSS 自定義屬性 (CSS Variables)

### SVG 進階特效
- feTurbulence 噪波生成
- feDisplacementMap 位移映射
- SVG 路徑動畫

### Canvas 創意編程
- getImageData 像素操作
- 粒子系統設計
- 物理模擬 (spring, damping)

### WebGL/Shader 下一步
- Fragment Shader 扭曲效果
- react-three-fiber 3D 文字
- SDF (Signed Distance Field) 字體渲染

## 🚀 開發與部署

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 構建專案
npm run build

# 啟動生產版本
npm start
```

## 📄 授權

MIT License - 自由使用、修改和分發。

---

這個專案展示了如何在現代 Web 應用中實現創意文字特效，從基礎的 CSS 技巧到進階的 Canvas 動畫，為你的專案增添視覺衝擊力。