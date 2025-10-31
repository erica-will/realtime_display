import Link from 'next/link';

export default function CylinderTextNavigation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-8">
      <div className="max-w-6xl mx-auto text-white">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🎯 3D 圓柱文字系統
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            在圓柱體表面沿著自訂軌道放置 3D 文字
          </p>
          <p className="text-lg text-purple-300">
            支援螺旋、環形、波浪等多種曲線類型 + 即時動畫效果
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* 基礎展示 */}
          <Link href="/cylinder-text" className="group">
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 h-full">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🌀</span>
                </div>
                <h2 className="text-xl font-bold group-hover:text-blue-300 transition-colors">基礎展示</h2>
              </div>
              <p className="text-gray-300 mb-4 text-sm">
                展示螺旋、環形、波浪三種曲線類型的 3D 文字效果，包含動畫和多種顏色搭配。
              </p>
              <div className="space-y-1 text-xs text-gray-400">
                <p>• 🌀 螺旋文字軌道</p>
                <p>• ⭕ 環形跑馬燈</p>
                <p>• 🌊 波浪曲線文字</p>
                <p>• ✨ 自動動畫效果</p>
              </div>
            </div>
          </Link>

          {/* 互動控制器 */}
          <Link href="/cylinder-text/interactive" className="group">
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 h-full">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🎛️</span>
                </div>
                <h2 className="text-xl font-bold group-hover:text-purple-300 transition-colors">互動控制器</h2>
              </div>
              <p className="text-gray-300 mb-4 text-sm">
                完整的控制面板，即時調整圓柱尺寸、曲線參數、文字內容、動畫速度和顏色。
              </p>
              <div className="space-y-1 text-xs text-gray-400">
                <p>• 📏 圓柱尺寸調整</p>
                <p>• 🌊 曲線類型切換</p>
                <p>• ✍️ 文字內容編輯</p>
                <p>• 🎨 顏色自訂選擇</p>
                <p>• ⚡ 動畫速度控制</p>
              </div>
            </div>
          </Link>

          {/* 組件展示 */}
          <Link href="/cylinder-text/simple" className="group">
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 h-full">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h2 className="text-xl font-bold group-hover:text-green-300 transition-colors">組件展示</h2>
              </div>
              <p className="text-gray-300 mb-4 text-sm">
                展示可重用組件的使用方式，包含浮空文字、透明效果等進階功能。
              </p>
              <div className="space-y-1 text-xs text-gray-400">
                <p>• 📦 組件化設計</p>
                <p>• 👻 浮空文字效果</p>
                <p>• 💎 透明材質支援</p>
                <p>• 🔧 簡潔 API 設計</p>
                <p>• 📝 程式碼範例</p>
              </div>
            </div>
          </Link>
        </div>

        {/* 技術特色 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold mb-4 text-cyan-400">🛠️ 技術實作</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">Three.js Curve 系統</p>
                  <p className="text-xs text-gray-400">自訂 CylinderSpiralCurve, CylinderRingCurve, CylinderWaveCurve</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">向量計算</p>
                  <p className="text-xs text-gray-400">切線、法線、上方向的座標系計算</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">React Three Fiber</p>
                  <p className="text-xs text-gray-400">React 組件化的 3D 場景管理</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold mb-4 text-pink-400">✨ 核心功能</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">軌道自訂</p>
                  <p className="text-xs text-gray-400">螺旋、環形、波浪等多種 3D 曲線</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">文字動畫</p>
                  <p className="text-xs text-gray-400">跑馬燈效果、速度可調</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">即時控制</p>
                  <p className="text-xs text-gray-400">參數即時調整、視覺化反饋</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 使用範例 */}
        <div className="bg-gray-800/20 rounded-xl p-6 border border-gray-700/50 mb-8">
          <h3 className="text-xl font-bold mb-4 text-center text-green-400">💡 快速使用</h3>
          <div className="bg-gray-900/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import { CylinderWithText } from './components/CylinderTextComponents';

<CylinderWithText
  radius={1}                    // 圓柱半徑
  height={2}                    // 圓柱高度
  turns={2}                     // 螺旋圈數
  text="HELLO WORLD ✨"         // 文字內容
  fontSize={0.12}               // 字體大小
  spacing={0.03}                // 字距
  curveType="spiral"            // 軌道類型
  animationSpeed={0.1}          // 動畫速度
  cylinderColor="#1e293b"       // 圓柱顏色
  textColor="#60a5fa"           // 文字顏色
/>`}
            </pre>
          </div>
        </div>

        {/* 返回按鈕 */}
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            <span className="text-xl">🏠</span>
            <span>返回主頁</span>
          </Link>
        </div>

        {/* 操作提示 */}
        <div className="mt-8 text-center text-gray-400">
          <p className="text-sm">
            💡 提示：所有 3D 場景都支援滑鼠拖曳旋轉、滾輪縮放、右鍵平移
          </p>
        </div>
      </div>
    </div>
  );
}