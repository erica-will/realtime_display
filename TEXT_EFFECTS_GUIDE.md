# 創意文字特效系統

這個 Next.js 專案包含了十二種不同層級的創意文字特效，從基礎 CSS 到高級 Canvas 動畫，涵蓋了完整的文字視覺設計譜系。

## 🎨 特效分類

### 1. 靜態視覺特效
使用 CSS 和 SVG 技術實現的靜態視覺效果。

#### GlitchText - 故障文字
- **技術**: CSS Filters + Animations
- **特色**: 色彩分離、位移抖動、掃描線效果
- **用途**: 科技感、未來感設計
- **文件**: `app/components/GlitchText.tsx`

#### OutlineStackText - 輪廓堆疊
- **技術**: CSS text-stroke + transform
- **特色**: 多層輪廓、偏移堆疊、手作感
- **用途**: 復古海報、品牌標題
- **文件**: `app/components/OutlineStackText.tsx`

#### LiquidText - 液體文字
- **技術**: SVG Filter Effects (feTurbulence)
- **特色**: 液態變形、噪波扭曲、有機質感
- **用途**: 藝術設計、動態品牌
- **文件**: `app/components/LiquidText.tsx`

#### ParticleText - 粒子文字
- **技術**: Canvas 2D API + 粒子系統
- **特色**: 文字輪廓粒子化、動態重組
- **用途**: 科技展示、互動設計
- **文件**: `app/components/ParticleText.tsx`

### 2. 動態運動特效
基於 CSS 動畫和 Canvas 的動態文字運動效果。

#### PathMoveText - 路徑移動
- **技術**: CSS offset-path + SVG
- **特色**: 沿 SVG 路徑移動、支援自定義路徑
- **用途**: 導航動畫、過場效果
- **文件**: `app/components/PathMoveText.tsx`

#### WaveText - 波浪動畫
- **技術**: CSS Keyframes + transform
- **特色**: 正弦波律動、字母延遲效果
- **用途**: 音樂視覺、律動感設計
- **文件**: `app/components/WaveText.tsx`

#### SquashStretchText - 拉伸動畫
- **技術**: CSS transform + 物理動畫
- **特色**: 彈性拉伸、物理回彈
- **用途**: 卡通動畫、可愛風格
- **文件**: `app/components/SquashStretchText.tsx`

#### JitterText - 抖動動畫
- **技術**: CSS transform + 噪波算法
- **特色**: 隨機位置抖動、緊張感營造
- **用途**: 恐怖遊戲、緊張氛圍
- **文件**: `app/components/JitterText.tsx`

### 3. 無限循環特效
使用數學曲線和 Canvas 實現的複雜循環動畫。

#### InfinityText - 基礎無限循環
- **技術**: Canvas + Lissajous 曲線
- **特色**: 文字沿無限符號路徑移動
- **用途**: Logo 動畫、品牌展示
- **文件**: `app/components/InfinityText.tsx`

#### AdvancedInfinityText - 多圈循環
- **技術**: Canvas + 多層圓形佈局
- **特色**: 多個文字圈、不同速度、稀疏模式
- **用途**: 複雜資訊展示、藝術裝置
- **文件**: `app/components/AdvancedInfinityText.tsx`

## 🔧 技術架構

### Next.js 整合
- **App Router**: 使用 Next.js 16 App Router
- **TypeScript**: 完整 TypeScript 支援
- **Dynamic Import**: 所有 Canvas 特效使用 Dynamic Import 避免 SSR 問題
- **Client Components**: 適當的客戶端渲染策略

### 組件結構
每個特效都有兩個文件：
1. `XxxText.tsx` - 核心實現
2. `ClientXxxText.tsx` - Dynamic Import 包裝器

### 樣式系統
- **Tailwind CSS**: 主要樣式框架
- **CSS Modules**: 特效專用樣式
- **響應式設計**: 支援各種螢幕尺寸

## 📱 使用方式

### 基本使用
```tsx
import ClientGlitchText from "@/app/components/ClientGlitchText";

<ClientGlitchText text="YOUR TEXT" />
```

### 進階配置
```tsx
// 多文字圈的無限循環
<ClientAdvancedInfinityText 
  texts={[
    "FIRST RING TEXT",
    "SECOND RING TEXT", 
    "THIRD RING TEXT"
  ]}
  sparseMode={true}  // 稀疏模式
/>

// 自定義路徑移動
<ClientPathMoveText 
  text="MOVING TEXT" 
  durationMs={5000}  // 自定義持續時間
/>
```

## 🎯 應用場景

### 品牌設計
- Logo 動畫
- 品牌標題效果
- 產品展示頁面

### 互動媒體
- 遊戲介面
- 互動裝置
- 藝術展覽

### 網頁設計
- Hero Section
- 過場動畫
- 按鈕效果

### 數據視覺化
- 動態圖表標題
- 資訊展示動畫
- 進度指示器

## 🚀 效能考量

### 最佳化策略
1. **Dynamic Import**: 避免 SSR 渲染問題
2. **requestAnimationFrame**: 流暢的動畫循環
3. **Canvas 最佳化**: 適當的重繪策略
4. **記憶體管理**: 適當清理動畫資源

### 瀏覽器相容性
- **現代瀏覽器**: 支援 Canvas 2D API
- **CSS 特效**: 支援 CSS Filters 和 Transforms
- **SVG 支援**: 支援 SVG Filter Effects

## 📄 檔案結構

```
app/
├── components/
│   ├── GlitchText.tsx              # 故障效果
│   ├── ClientGlitchText.tsx        # 客戶端包裝
│   ├── OutlineStackText.tsx        # 輪廓堆疊
│   ├── ClientOutlineStackText.tsx  # 客戶端包裝
│   ├── LiquidText.tsx              # 液體效果
│   ├── ClientLiquidText.tsx        # 客戶端包裝
│   ├── ParticleText.tsx            # 粒子效果
│   ├── ClientParticleText.tsx      # 客戶端包裝
│   ├── PathMoveText.tsx            # 路徑移動
│   ├── ClientPathMoveText.tsx      # 客戶端包裝
│   ├── WaveText.tsx                # 波浪動畫
│   ├── ClientWaveText.tsx          # 客戶端包裝
│   ├── SquashStretchText.tsx       # 拉伸動畫
│   ├── ClientSquashStretchText.tsx # 客戶端包裝
│   ├── JitterText.tsx              # 抖動動畫
│   ├── ClientJitterText.tsx        # 客戶端包裝
│   ├── InfinityText.tsx            # 基礎無限循環
│   ├── ClientInfinityText.tsx      # 客戶端包裝
│   ├── AdvancedInfinityText.tsx    # 進階無限循環
│   └── ClientAdvancedInfinityText.tsx # 客戶端包裝
├── text-effects/
│   └── page.tsx                    # 特效展示頁面
├── motion-type/
│   └── page.tsx                    # 動態文字展示頁面
└── page.tsx                        # 主頁
```

## 🎨 設計原則

### 漸進式複雜度
1. **Level 1**: CSS 基礎效果 (Glitch, Outline)
2. **Level 2**: SVG 進階效果 (Liquid)
3. **Level 3**: Canvas 互動效果 (Particle)
4. **Level 4**: 數學曲線動畫 (Infinity)

### 模組化設計
- 每個特效獨立封裝
- 統一的 Props 介面
- 可組合的設計模式

### 效能優先
- 適當的重繪策略
- 記憶體管理
- 流暢的動畫體驗

這個文字特效系統提供了從簡單到複雜的完整解決方案，適合各種創意專案的需求。