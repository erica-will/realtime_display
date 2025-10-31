import Link from 'next/link';

export default function ConeNavigation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-white">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            3D 圓錐體展示
          </h1>
          <p className="text-xl text-gray-300">
            使用 Three.js + React Three Fiber 製作的互動式 3D 圓錐體
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 基礎版本 */}
          <Link href="/cone" className="group">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🔷</span>
                </div>
                <h2 className="text-2xl font-bold group-hover:text-blue-300 transition-colors">基礎展示</h2>
              </div>
              <p className="text-gray-300 mb-4">
                展示多個不同尺寸和角度的圓錐體，包含基礎圓錐、橢圓錐、旋轉效果等範例。
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• 多種圓錐體範例</p>
                <p>• 自由視角控制</p>
                <p>• 3D 參考格線</p>
                <p>• 座標軸指示器</p>
              </div>
            </div>
          </Link>

          {/* 互動版本 */}
          <Link href="/cone/interactive" className="group">
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🎛️</span>
                </div>
                <h2 className="text-2xl font-bold group-hover:text-purple-300 transition-colors">互動控制器</h2>
              </div>
              <p className="text-gray-300 mb-4">
                即時調整圓錐體的長寬高、位置、旋轉角度和顏色，體驗完全可控的 3D 物件配置。
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• 即時參數調整</p>
                <p>• 尺寸控制面板</p>
                <p>• 位置與旋轉設定</p>
                <p>• 顏色選擇器</p>
              </div>
            </div>
          </Link>

          {/* 簡化版本 */}
          <Link href="/cone/simple" className="group">
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h2 className="text-2xl font-bold group-hover:text-green-300 transition-colors">簡化使用</h2>
              </div>
              <p className="text-gray-300 mb-4">
                使用可重用的組件架構，展示如何在其他專案中快速整合 3D 圓錐體功能。
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• 組件化設計</p>
                <p>• 簡潔 API</p>
                <p>• 易於擴展</p>
                <p>• 最佳實踐</p>
              </div>
            </div>
          </Link>

          {/* 回到主頁 */}
          <Link href="/" className="group">
            <div className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 border border-gray-500/30 rounded-xl p-6 hover:border-gray-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-500/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <h2 className="text-2xl font-bold group-hover:text-gray-300 transition-colors">回到主頁</h2>
              </div>
              <p className="text-gray-300 mb-4">
                返回專案主頁，查看其他功能如即時顯示系統、文字效果等。
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• 即時顯示系統</p>
                <p>• 文字效果展示</p>
                <p>• 管理介面</p>
                <p>• 更多功能...</p>
              </div>
            </div>
          </Link>
        </div>

        {/* 技術說明 */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-center">🛠️ 技術棧</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-orange-500 rounded-lg mx-auto flex items-center justify-center">
                <span className="text-xl font-bold text-white">3D</span>
              </div>
              <p className="text-sm">Three.js</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto flex items-center justify-center">
                <span className="text-xl font-bold text-white">⚛️</span>
              </div>
              <p className="text-sm">React Three Fiber</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto flex items-center justify-center">
                <span className="text-xl font-bold text-white">🎨</span>
              </div>
              <p className="text-sm">React Three Drei</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto flex items-center justify-center">
                <span className="text-xl font-bold text-white">▲</span>
              </div>
              <p className="text-sm">Next.js</p>
            </div>
          </div>
        </div>

        {/* 操作說明 */}
        <div className="mt-8 text-center text-gray-400">
          <p className="text-sm">
            💡 提示：所有 3D 場景都支援滑鼠拖曳旋轉視角、滾輪縮放、右鍵平移
          </p>
        </div>
      </div>
    </div>
  );
}