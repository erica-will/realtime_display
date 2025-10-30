# Hydration 問題修復指南

## 問題描述

在使用 Next.js SSR (Server-Side Rendering) 時遇到 hydration 錯誤：

```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

## 問題根因

### 1. 動態 ID 生成不一致
- **問題**：`useId()` 在 SSR 和客戶端可能產生不同的 ID
- **影響組件**：`LiquidText` (使用 SVG filter ID)

### 2. 隨機值在渲染階段使用
- **問題**：`Math.random()` 或 `Date.now()` 在組件渲染時被調用
- **結果**：服務端和客戶端產生不同的 HTML

# Hydration 問題修復指南

## 問題描述

在使用 Next.js SSR (Server-Side Rendering) 時遇到 hydration 錯誤：

```
Hydration failed because the server rendered HTML didn't match the client.
```

## 問題根因

### 1. 動態 ID 生成不一致
- **問題**：`useId()` 在 SSR 和客戶端可能產生不同的 ID
- **影響組件**：`LiquidText` (使用 SVG filter ID)

### 2. CSS 變量初始化時機
- **問題**：`GlitchText` 的 CSS 變量在 SSR 和客戶端初始化不同步
- **結果**：服務端和客戶端產生不同的 style 屬性

### 3. 動畫組件的初始狀態
- **問題**：有動畫效果的組件在 SSR 時無法正確初始化
- **影響組件**：所有使用 `requestAnimationFrame` 的組件

## 最終解決方案：使用 Next.js Dynamic Import

### 為什麼選擇 Dynamic Import？

1. **完全避免 SSR**：確保動畫組件只在客戶端渲染
2. **優雅的 Loading 狀態**：提供一致的載入體驗
3. **性能優化**：減少初始 bundle 大小
4. **零 hydration 風險**：徹底解決服務端/客戶端不匹配問題

### 實施步驟

#### 1. 創建客戶端專用組件包裝器

**ClientGlitchText.tsx**：
```tsx
"use client";

import dynamic from 'next/dynamic';
import GlitchText from './GlitchText';

const ClientGlitchText = dynamic(() => Promise.resolve(GlitchText), {
  ssr: false,
  loading: () => (
    <div className="relative font-extrabold text-[clamp(2rem,4vw,4rem)] leading-none tracking-tight uppercase select-none">
      <span className="text-white block relative">Loading...</span>
    </div>
  ),
});

export default ClientGlitchText;
```

#### 2. 對所有動畫組件創建客戶端版本

- `ClientGlitchText.tsx` - Glitch 效果包裝器
- `ClientLiquidText.tsx` - 液態文字包裝器
- `ClientParticleText.tsx` - 粒子效果包裝器

#### 3. 保持基礎 ID 生成的確定性

**LiquidText.tsx 中的修復**：
```tsx
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

const filterId = useMemo(() => {
  return `liquid-filter-${simpleHash(text)}`;
}, [text]);
```

### 使用方式

**修復前**：
```tsx
<GlitchText text="NEO SIGNAL" />
```

**修復後**：
```tsx
<ClientGlitchText text="NEO SIGNAL" />
```

## 技術優勢

### ✅ 解決方案優點

1. **零 Hydration 錯誤**：動畫組件完全跳過 SSR
2. **一致的用戶體驗**：提供 loading 狀態替代閃爍
3. **性能優化**：減少初始頁面載入時間
4. **開發友好**：原始組件代碼無需修改
5. **可維護性**：清晰的客戶端/服務端分離

### 🚀 性能表現

- **首屏載入**：更快（跳過複雜動畫的 SSR）
- **交互就緒時間**：更短（動畫在背景載入）
- **Bundle 分割**：動畫組件按需載入

## 文件結構

```
app/components/
├── GlitchText.tsx          # 原始動畫組件
├── ClientGlitchText.tsx    # 客戶端專用包裝器
├── LiquidText.tsx          # 修復 ID 生成的組件
├── ClientLiquidText.tsx    # 客戶端專用包裝器
├── ParticleText.tsx        # 原始動畫組件
├── ClientParticleText.tsx  # 客戶端專用包裝器
└── OutlineStackText.tsx    # 純 CSS 組件（無需包裝器）
```

## 最佳實踐

### ✅ 推薦做法

1. **動畫組件使用 Dynamic Import**
```tsx
const ClientAnimationComponent = dynamic(() => import('./AnimationComponent'), {
  ssr: false,
  loading: () => <StaticFallback />
});
```

2. **提供有意義的 Loading 狀態**
```tsx
loading: () => (
  <div className="same-layout-classes">
    Loading Animation...
  </div>
)
```

3. **純 CSS 效果無需包裝**
```tsx
// OutlineStackText 使用純 CSS，可以直接 SSR
<OutlineStackText text="STATIC TEXT" />
```

### ❌ 避免的做法

1. **混合動態和靜態內容在同一組件**
```tsx
// ❌ 這會導致 hydration 問題
function MixedComponent() {
  const [random] = useState(Math.random());
  return <div style={{transform: `rotate(${random}deg)`}}>Text</div>;
}
```

2. **在 Loading 組件中使用不同的 DOM 結構**
```tsx
// ❌ 這可能導致佈局閃爍
loading: () => <span>Loading</span> // 原組件是 <div>
```

## 驗證修復

1. **構建測試**：`npm run build` ✅
2. **開發模式**：`npm run dev` - 無 hydration 警告 ✅
3. **頁面載入**：首屏顯示 loading，然後平滑過渡到動畫 ✅

## 總結

通過使用 Next.js 的 `dynamic` import 和 `ssr: false` 選項，我們：

1. ✅ 完全消除了 hydration 錯誤
2. ✅ 保持了原始組件的功能完整性
3. ✅ 提供了優雅的載入體驗
4. ✅ 提升了整體性能表現

這個解決方案是處理複雜動畫組件 hydration 問題的最佳實踐。

## 最佳實踐

### ✅ 好的做法

1. **在 useEffect 中處理隨機值**
```tsx
useEffect(() => {
  const randomValue = Math.random();
  // 使用 randomValue...
}, []);
```

2. **使用確定性算法生成 ID**
```tsx
const id = useMemo(() => {
  return `component-${hashFunction(uniqueString)}`;
}, [uniqueString]);
```

3. **提供 fallback 內容**
```tsx
<ClientOnly fallback={<StaticVersion />}>
  <DynamicComponent />
</ClientOnly>
```

### ❌ 避免的做法

1. **在渲染時使用隨機值**
```tsx
// ❌ 錯誤
const randomId = Math.random().toString();
return <div id={randomId}>...</div>;
```

2. **在 useEffect 中直接設置 state**
```tsx
// ❌ 在 Next.js 16 中會警告
useEffect(() => {
  setState(value); // 可能造成級聯渲染
}, []);
```

3. **依賴瀏覽器特定 API 進行初始渲染**
```tsx
// ❌ SSR 時 window 不存在
const width = window.innerWidth; // 會導致 hydration 不匹配
```

## 修復後的組件結構

```
app/components/
├── ClientOnly.tsx          # 客戶端專用包裝組件
├── GlitchText.tsx         # ✅ 無 hydration 問題 (隨機值在 useEffect 中)
├── OutlineStackText.tsx   # ✅ 無 hydration 問題 (純 CSS)
├── LiquidText.tsx         # ✅ 已修復 (使用確定性 ID)
└── ParticleText.tsx       # ✅ 無 hydration 問題 (Canvas 在 useEffect 中)
```

## 驗證修復

1. **構建測試**：`npm run build` 成功
2. **開發模式**：`npm run dev` 無 hydration 警告
3. **生產模式**：部署後無控制台錯誤

## 延伸閱讀

- [Next.js Hydration 文檔](https://nextjs.org/docs/messages/react-hydration-error)
- [React 18 SSR & Hydration](https://reactjs.org/docs/react-dom-server.html)
- [避免 Hydration 不匹配的最佳實踐](https://nextjs.org/docs/app/building-your-application/rendering/client-components#hydration-errors)

## 總結

通過以下步驟成功解決了 hydration 問題：

1. ✅ 替換 `useId()` 為確定性 ID 生成
2. ✅ 創建 `ClientOnly` 組件處理動態內容
3. ✅ 確保所有隨機值都在 `useEffect` 中生成
4. ✅ 為動態組件提供靜態 fallback

這些修復確保了服務端和客戶端渲染的 HTML 完全一致，消除了 hydration 不匹配錯誤。