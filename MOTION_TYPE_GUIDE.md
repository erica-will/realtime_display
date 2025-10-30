# 動態文字運動效果使用指南

## 🎯 動態文字 vs 靜態特效

### 靜態特效（之前實現的）
- 文字本身被扭曲、分裂、粒子化
- 效果：`GlitchText`, `LiquidText`, `ParticleText`, `OutlineStackText`

### 動態運動（新增功能）⭐
- 文字在平面上移動、晃動、抖動、拉伸、扭曲
- 有路徑感和節奏感的運動動畫
- 效果：`PathMoveText`, `WaveText`, `SquashStretchText`, `JitterText`

## 🎨 四種動態運動效果

### 1. ClientPathMoveText - 沿路徑移動
```tsx
<ClientPathMoveText 
  text="SYNTH FLOW MOTION" 
  durationMs={8000} 
/>
```

**特色**：
- 🛤️ 沿貝茲曲線路徑移動
- 🔄 支援無限循環動畫
- 🎨 可視化路徑軌跡（debug 模式）
- ⚙️ 可自訂移動速度

**技術**：CSS `offset-path` + 動態 keyframes
**適用場景**：背景動態元素、展示頁面裝飾

### 2. ClientWaveText - 波浪式律動
```tsx
<ClientWaveText 
  text="CREATIVE MOTION SYSTEM"
  amplitude={12}
  periodMs={1200}
/>
```

**特色**：
- 🌊 逐字母波浪式上下浮動
- ⏱️ 可調整波幅和週期
- 📖 保持文字可讀性
- 🎵 有機律動感

**技術**：逐字母 CSS animation + 時間差
**適用場景**：主標題、Hero headline

### 3. ClientSquashStretchText - 拉伸彈跳
```tsx
<ClientSquashStretchText 
  text="ENERGY IN EVERY LETTER"
  periodMs={900}
/>
```

**特色**：
- 🔄 Squash & Stretch 動畫原理
- 💫 卡通式物理張力效果
- ⚖️ 模擬重量和彈性
- 🎪 活潑有趣的視覺效果

**技術**：動態 `scaleX/scaleY` 變換
**適用場景**：年輕品牌、活潑標題、互動元素

### 4. ClientJitterText - 噪波抖動
```tsx
<ClientJitterText 
  text="REALTIME TYPE PERFORMANCE"
  intensity={1.5}
  speed={1}
/>
```

**特色**：
- ⚡ 類似電子干擾的抖動
- 🎛️ 可調抖動強度和速度
- 🤖 Cyberpunk / 科技感
- 🔬 模擬噪波算法

**技術**：JavaScript `requestAnimationFrame` + Sin/Cos 函數
**適用場景**：科技品牌、藝術展示、警告標語

## 📖 基本使用方式

### 導入組件
```tsx
import ClientPathMoveText from "./components/ClientPathMoveText";
import ClientWaveText from "./components/ClientWaveText";
import ClientSquashStretchText from "./components/ClientSquashStretchText";
import ClientJitterText from "./components/ClientJitterText";
```

### 組合使用範例
```tsx
export default function MotionPage() {
  return (
    <main className="bg-black text-white min-h-screen relative overflow-hidden">
      {/* 背景裝飾 - 路徑移動 */}
      <div className="absolute top-1/4 left-1/4 opacity-20 pointer-events-none">
        <ClientPathMoveText text="BACKGROUND FLOW" durationMs={10000} />
      </div>

      {/* 主要內容區 */}
      <section className="flex flex-col items-center justify-center min-h-screen gap-16 p-8 relative z-10">
        {/* 主標題 - 波浪律動 */}
        <ClientWaveText text="MAIN HEADLINE" />
        
        {/* 副標題 - 拉伸彈跳 */}
        <ClientSquashStretchText text="DYNAMIC SUBTITLE" />
        
        {/* 標語 - 噪波抖動 */}
        <ClientJitterText 
          text="TECH TAGLINE" 
          intensity={1}
          className="text-lg"
        />
      </section>
    </main>
  );
}
```

## 🎛️ 詳細參數配置

### PathMoveText 參數
```tsx
interface PathMoveTextProps {
  text: string;           // 移動的文字內容
  className?: string;     // 額外 CSS 類別
  durationMs?: number;    // 完整路徑移動時間（毫秒，預設 6000）
}
```

### WaveText 參數
```tsx
interface WaveTextProps {
  text: string;           // 波動的文字內容
  className?: string;     // 額外 CSS 類別
  amplitude?: number;     // 波浪高度（px，預設 12）
  periodMs?: number;      // 完整週期時間（毫秒，預設 1200）
}
```

### SquashStretchText 參數
```tsx
interface SquashStretchTextProps {
  text: string;           // 彈跳的文字內容
  className?: string;     // 額外 CSS 類別
  periodMs?: number;      // 完整彈跳週期（毫秒，預設 900）
}
```

### JitterText 參數
```tsx
interface JitterTextProps {
  text: string;           // 抖動的文字內容
  className?: string;     // 額外 CSS 類別
  intensity?: number;     // 抖動幅度（px，預設 2）
  speed?: number;         // 抖動速度倍數（預設 1）
}
```

## 🎨 設計模式與組合

### Hero Section 設計
```tsx
// 多層次動態效果
<section className="relative min-h-screen">
  {/* 背景層 - 慢速路徑移動 */}
  <ClientPathMoveText 
    text="AMBIENT MOTION" 
    durationMs={15000}
    className="absolute opacity-10"
  />
  
  {/* 主內容層 - 波浪主標 */}
  <ClientWaveText 
    text="HERO TITLE"
    className="relative z-10"
  />
  
  {/* 裝飾層 - 微抖動標語 */}
  <ClientJitterText 
    text="SUBTLE TAGLINE"
    intensity={0.5}
    className="text-sm opacity-80"
  />
</section>
```

### 品牌風格搭配

#### 🤖 科技/Cyberpunk 風格
```tsx
<ClientJitterText text="SYSTEM ERROR" intensity={3} speed={2} />
<ClientPathMoveText text="DATA FLOW" durationMs={4000} />
```

#### 🎨 創意/藝術風格
```tsx
<ClientWaveText text="CREATIVE ENERGY" amplitude={20} />
<ClientSquashStretchText text="ORGANIC MOTION" />
```

#### 🏢 商業/專業風格
```tsx
<ClientWaveText text="INNOVATION" amplitude={8} periodMs={2000} />
<ClientPathMoveText text="EXCELLENCE" durationMs={8000} />
```

## ⚡ 性能優化建議

### 合理使用動畫
```tsx
// ✅ 推薦：重點區域使用動態效果
<ClientWaveText text="MAIN TITLE" />
<p>靜態內容文字...</p>

// ❌ 避免：全頁面都是動畫
```

### 背景裝飾優化
```tsx
// ✅ 使用 opacity 和 pointer-events: none
<div className="absolute opacity-20 pointer-events-none">
  <ClientPathMoveText text="BACKGROUND" />
</div>
```

### 控制動畫複雜度
```tsx
// ✅ 適中的參數設置
<ClientJitterText intensity={1.5} speed={1} />

// ❌ 避免過度的動畫參數
<ClientJitterText intensity={10} speed={5} /> // 太激烈
```

## 🚀 進階技巧

### 響應式動畫
```tsx
// 使用 clamp() 讓動畫參數響應螢幕大小
<ClientWaveText 
  amplitude={Math.max(8, window.innerWidth * 0.01)} 
  text="RESPONSIVE MOTION" 
/>
```

### 動畫組合
```tsx
// 組合多種效果創造獨特視覺
<div className="relative">
  <ClientWaveText text="BASE LAYER" />
  <div className="absolute inset-0 mix-blend-multiply">
    <ClientJitterText text="OVERLAY LAYER" intensity={0.5} />
  </div>
</div>
```

### 自訂路徑
```tsx
// 修改 PathMoveText.tsx 中的 pathD 變數來自訂路徑
const pathD = "M 0 100 C 200 0, 400 200, 600 100"; // 自訂曲線
```

## 📱 響應式設計

所有動態文字組件都內建響應式：
- 文字大小使用 `clamp()` 自動適應
- 動畫參數可根據螢幕大小調整
- 在小螢幕上自動降低動畫強度

## 🎯 最佳實踐

1. **層次分明**：主要內容用較溫和的動畫，裝飾元素可以更動態
2. **性能優先**：避免同時運行過多複雜動畫
3. **可讀性**：確保動畫不影響文字閱讀
4. **品牌一致**：選擇符合品牌調性的動畫風格
5. **用戶體驗**：提供減少動畫的選項（accessibility）

這些動態文字效果讓你的網站擁有 Behance 級別的視覺衝擊力！🚀