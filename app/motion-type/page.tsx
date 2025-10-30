import ClientPathMoveText from "../components/ClientPathMoveText";
import ClientWaveText from "../components/ClientWaveText";
import ClientSquashStretchText from "../components/ClientSquashStretchText";
import ClientJitterText from "../components/ClientJitterText";

export default function MotionTypePage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section with Multiple Motion Effects */}
      <section className="flex flex-col items-center justify-center min-h-screen gap-16 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl mb-4 text-gray-400">Dynamic Motion Typography</h1>
          <p className="text-sm text-gray-500 mb-12">
            四種文字在平面上移動、晃動、抖動、拉伸、扭曲的動畫效果
          </p>
        </div>

        {/* 背景在飄的字 - 大面積視覺 */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-30 pointer-events-none">
          <ClientPathMoveText text="SYNTH FLOW MOTION" durationMs={8000} />
        </div>

        {/* 主標 - 有波浪律動，讀得清楚 */}
        <div className="text-center z-10">
          <h2 className="text-lg text-gray-400 mb-6">1. Wave Motion - 波浪式律動</h2>
          <ClientWaveText
            text="CREATIVE MOTION SYSTEM"
            className="relative text-center"
          />
        </div>

        {/* 副標 - 有重量的彈性感 */}
        <div className="text-center z-10">
          <h2 className="text-lg text-gray-400 mb-6">2. Squash & Stretch - 拉伸彈跳</h2>
          <ClientSquashStretchText
            text="ENERGY IN EVERY LETTER"
            className="text-center"
          />
        </div>

        {/* 小標 - 噪波式抖動，當成 tagline */}
        <div className="text-center z-10">
          <h2 className="text-lg text-gray-400 mb-6">3. Jitter Motion - 噪波抖動</h2>
          <ClientJitterText
            text="REALTIME TYPE PERFORMANCE"
            intensity={1.5}
            speed={1}
            className="text-center text-[clamp(1rem,1.2vw,1.25rem)] font-medium tracking-wide"
          />
        </div>
      </section>

      {/* 詳細說明區塊 */}
      <section className="py-20 px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-white">
            動態文字技術詳解
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">路徑移動</h3>
              <p className="text-gray-400 text-sm">使用 CSS offset-path 沿貝茲曲線移動</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">波浪律動</h3>
              <p className="text-gray-400 text-sm">逐字母時間差位移形成波浪效果</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">拉伸彈跳</h3>
              <p className="text-gray-400 text-sm">動態 scaleX/Y 製造卡通物理效果</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">噪波抖動</h3>
              <p className="text-gray-400 text-sm">使用 JavaScript 模擬噪波干擾效果</p>
            </div>
          </div>
        </div>
      </section>

      {/* 背景第二組路徑移動 */}
      <div className="absolute bottom-20 left-1/4 opacity-20 pointer-events-none">
        <ClientPathMoveText text="INFINITE ENERGY" durationMs={12000} />
      </div>
    </main>
  );
}