# 文字特效組件使用指南

## 🎨 可用組件

### 所有組件（客戶端版本，確保無 hydration 問題）
- `ClientGlitchText` - 故障風格文字
- `ClientOutlineStackText` - 疊描邊文字效果
- `ClientLiquidText` - 液態扭曲文字  
- `ClientParticleText` - 粒子化文字

## 📖 基本使用

### 導入組件
```tsx
// 所有組件都使用客戶端版本以避免 hydration 問題
import ClientGlitchText from "./components/ClientGlitchText";
import ClientOutlineStackText from "./components/ClientOutlineStackText";
import ClientLiquidText from "./components/ClientLiquidText";
import ClientParticleText from "./components/ClientParticleText";
```

### 使用範例
```tsx
export default function MyPage() {
  return (
    <div className="bg-black text-white min-h-screen p-8">
      {/* 所有文字效果都是客戶端渲染，確保穩定性 */}
      <ClientOutlineStackText text="WELCOME" />
      <ClientGlitchText text="CYBER PUNK" />
      <ClientLiquidText text="FLUID MOTION" />
      <ClientParticleText text="PARTICLES" />
    </div>
  );
}
```

## 🎛 組件屬性

### 通用屬性
所有組件都支援以下屬性：

```tsx
interface TextEffectProps {
  text: string;        // 必需：要顯示的文字
  className?: string;  // 可選：額外的 CSS 類別
}
```

### 使用範例
```tsx
<ClientGlitchText 
  text="CUSTOM TEXT" 
  className="mb-8 opacity-80" 
/>
```

## 🎨 各組件特色

### 1. ClientOutlineStackText - 疊描邊文字
```tsx
<ClientOutlineStackText text="DESIGN TITLE" />
```
- **技術**：純 CSS（客戶端渲染避免 hydration 問題）
- **特色**：立體疊印效果
- **適用場景**：標題、重點文字
- **載入**：客戶端動態載入

### 2. ClientGlitchText - 故障風格文字
```tsx
<ClientGlitchText text="ERROR 404" />
```
- **技術**：CSS + JavaScript 動畫
- **特色**：數位故障、色彩偏移
- **適用場景**：科技感標題、警告文字
- **載入**：客戶端動態載入

### 3. ClientLiquidText - 液態扭曲文字
```tsx
<ClientLiquidText text="FLOWING TEXT" />
```
- **技術**：SVG Filter + 動畫
- **特色**：流體扭曲效果
- **適用場景**：創意標題、藝術展示
- **載入**：客戶端動態載入

### 4. ClientParticleText - 粒子化文字
```tsx
<ClientParticleText text="EXPLODE" />
```
- **技術**：Canvas + 粒子系統
- **特色**：粒子聚合動畫
- **適用場景**：互動展示、科技演示
- **載入**：客戶端動態載入

## 📱 響應式設計

所有組件都內建響應式設計：

```tsx
// 自動適應螢幕大小
<ClientGlitchText text="RESPONSIVE" />
```

文字大小使用 `clamp()` 函數：
- 手機：較小字體
- 平板：中等字體  
- 桌面：完整字體

## 🎨 自定義樣式

### 使用 className 覆蓋樣式
```tsx
<ClientGlitchText 
  text="BLUE GLITCH" 
  className="text-blue-500 scale-150 rotate-12" 
/>
```

### 容器包裝
```tsx
<div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-lg">
  <ClientLiquidText text="GRADIENT BACKGROUND" />
</div>
```

## ⚡ 性能優化

### 動畫組件載入策略
- **初始載入**：顯示 "Loading..." 文字
- **組件就緒**：平滑過渡到動畫效果
- **Bundle 分割**：動畫組件按需載入

### 使用建議
```tsx
// ✅ 推薦：所有文字效果都使用客戶端版本
<ClientOutlineStackText text="MAIN TITLE" />        
<ClientGlitchText text="ANIMATED SUBTITLE" />  

// ❌ 避免：混用原始組件和客戶端組件
```

## 🔧 開發模式

### 查看載入狀態
開發時可以看到組件載入過程：
1. 首先顯示 loading 文字
2. 組件載入完成後切換到動畫

### 調試動畫
```tsx
// 在瀏覽器開發工具中檢查
// - CSS 變量值（GlitchText）
// - SVG filter 效果（LiquidText）  
// - Canvas 渲染（ParticleText）
```

## 📐 佈局建議

### 頁面結構範例
```tsx
export default function LandingPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen">
        <ClientGlitchText text="BRAND NAME" className="mb-4" />
        <ClientOutlineStackText text="TAGLINE" className="mb-8" />
        <p className="text-gray-400">Description text...</p>
      </section>
      
      {/* Feature Section */}
      <section className="py-20">
        <ClientLiquidText text="FEATURES" />
        {/* 其他內容 */}
      </section>
    </main>
  );
}
```

### 間距控制
```tsx
<div className="space-y-12">
  <ClientGlitchText text="TITLE 1" />
  <ClientLiquidText text="TITLE 2" />
  <ClientParticleText text="TITLE 3" />
</div>
```

## 🚀 生產環境

### 建議配置
- 確保已設定適當的 loading 狀態
- 測試不同網路速度下的載入體驗
- 檢查 SEO 影響（動畫組件不會被搜尋引擎索引）

### SEO 考量
```tsx
// 對於重要的 SEO 文字，使用具有意義的 loading 狀態
<ClientOutlineStackText text="SEO IMPORTANT TITLE" />

// 所有組件都會在客戶端正確渲染，但載入時會顯示 "Loading..."
<ClientGlitchText text="VISUAL DECORATION" />
```

## 🎯 最佳實踐

1. **統一使用客戶端版本**：確保所有文字效果都無 hydration 問題
2. **性能優化**：所有組件都按需載入，首屏載入更快
3. **視覺一致性**：loading 狀態與最終效果保持一致的佈局
4. **響應式測試**：在不同裝置上測試效果
5. **載入優化**：每個組件都提供有意義的 loading 狀態

這些組件讓你可以輕鬆為專案增加專業級的文字視覺效果！