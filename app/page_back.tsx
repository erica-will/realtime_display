      // <div className="min-h-screen bg-black text-white relative overflow-hidden">
      //   {/* 背景動態元素 */}
      //   <div className="absolute top-1/4 left-1/4 opacity-20 pointer-events-none">
      //     <ClientPathMoveText text="CREATIVE ENERGY" durationMs={10000} />
      //   </div>

      //   <div className="absolute bottom-1/4 right-1/4 opacity-10 pointer-events-none scale-50">
      //     <ClientAdvancedInfinityText
      //       texts={["INFINITE", "MOTION", "LOOP"]}
      //       sparseMode={true}
      //     />
      //   </div>

      //   {/* Hero Section with Text Effects */}
      //   <section className="flex flex-col items-center justify-center min-h-screen px-8 relative z-10">
      //     <div className="text-center mb-16">
      //       <ClientWaveText text="REALTIME" className="mb-4" />
      //       <ClientOutlineStackText text="DISPLAY" className="mb-12" />
      //       <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
      //         一個結合即時顯示功能與創意文字特效的 Next.js 專案
      //       </p>
      //     </div>

      //     {/* Navigation Cards */}
      //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
      //       <Link
      //         href="/display"
      //         className="group p-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-105"
      //       >
      //         <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
      //           即時顯示
      //         </h3>
      //         <p className="text-gray-400 text-sm leading-relaxed">
      //           查看即時內容顯示，支援 SSE 串流更新
      //         </p>
      //       </Link>

      //       <Link
      //         href="/text-effects"
      //         className="group p-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-105"
      //       >
      //         <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">
      //           文字特效
      //         </h3>
      //         <p className="text-gray-400 text-sm leading-relaxed">
      //           十二種創意文字特效：靜態視覺、動態運動、無限循環
      //         </p>
      //       </Link>

      //       <Link
      //         href="/motion-type"
      //         className="group p-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-105"
      //       >
      //         <h3 className="text-xl font-bold mb-3 text-white group-hover:text-green-400 transition-colors">
      //           動態文字
      //         </h3>
      //         <p className="text-gray-400 text-sm leading-relaxed">
      //           路徑移動、波浪律動、拉伸彈跳、噪波抖動
      //         </p>
      //       </Link>

      //       <Link
      //         href="/admin"
      //         className="group p-8 rounded-xl bg-gradient-to-br from-red-900 to-red-800 border border-red-700 hover:border-red-500 transition-all duration-300 hover:scale-105"
      //       >
      //         <h3 className="text-xl font-bold mb-3 text-white group-hover:text-red-400 transition-colors">
      //           後台管理
      //         </h3>
      //         <p className="text-gray-400 text-sm leading-relaxed">
      //           內容發佈管理，更新即時顯示內容
      //         </p>
      //       </Link>

      //       <div className="group p-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-500 transition-all duration-300 md:col-span-2">
      //         <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-400 transition-colors">
      //           API 端點
      //         </h3>
      //         <p className="text-gray-400 text-sm leading-relaxed mb-4">
      //           RESTful API 用於內容發佈與串流
      //         </p>
      //         <div className="space-y-2 text-xs">
      //           <div className="text-cyan-400">/api/content/publish</div>
      //           <div className="text-cyan-400">/api/content/current</div>
      //           <div className="text-cyan-400">/api/stream</div>
      //         </div>
      //       </div>
      //     </div>
      //   </section>

      //   {/* Features Section */}
      //   <section className="py-20 px-8 border-t border-gray-800">
      //     <div className="max-w-6xl mx-auto">
      //       <h2 className="text-3xl font-bold text-center mb-16 text-white">
      //         技術特色
      //       </h2>

      //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      //         <div className="text-center">
      //           <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
      //             <span className="text-2xl">⚡</span>
      //           </div>
      //           <h3 className="text-lg font-semibold mb-2">即時更新</h3>
      //           <p className="text-gray-400 text-sm">
      //             使用 SSE 技術實現即時內容串流
      //           </p>
      //         </div>

      //         <div className="text-center">
      //           <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
      //             <span className="text-2xl">🎨</span>
      //           </div>
      //           <h3 className="text-lg font-semibold mb-2">創意特效</h3>
      //           <p className="text-gray-400 text-sm">
      //             十二種文字特效：CSS、SVG、Canvas 全方位實現
      //           </p>
      //         </div>

      //         <div className="text-center">
      //           <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
      //             <span className="text-2xl">🔧</span>
      //           </div>
      //           <h3 className="text-lg font-semibold mb-2">模組化設計</h3>
      //           <p className="text-gray-400 text-sm">
      //             元件化架構，支援 text prop 動態更換
      //           </p>
      //         </div>

      //         <div className="text-center">
      //           <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
      //             <span className="text-2xl">📱</span>
      //           </div>
      //           <h3 className="text-lg font-semibold mb-2">響應式</h3>
      //           <p className="text-gray-400 text-sm">
      //             支援各種螢幕尺寸的適應性顯示
      //           </p>
      //         </div>
      //       </div>
      //     </div>
      //   </section>

      //   {/* Footer */}
      //   <footer className="py-12 px-8 border-t border-gray-800 text-center">
      //     <div className="max-w-4xl mx-auto">
      //       <p className="text-gray-500 text-sm">
      //         Built with Next.js 16, TypeScript, Tailwind CSS, and creative
      //         coding techniques
      //       </p>
      //       <div className="mt-4 flex justify-center space-x-6">
      //         <a
      //           href="https://nextjs.org"
      //           target="_blank"
      //           rel="noopener noreferrer"
      //           className="text-gray-400 hover:text-white transition-colors text-sm"
      //         >
      //           Next.js
      //         </a>
      //         <a
      //           href="https://tailwindcss.com"
      //           target="_blank"
      //           rel="noopener noreferrer"
      //           className="text-gray-400 hover:text-white transition-colors text-sm"
      //         >
      //           Tailwind CSS
      //         </a>
      //         <a
      //           href="https://upstash.com"
      //           target="_blank"
      //           rel="noopener noreferrer"
      //           className="text-gray-400 hover:text-white transition-colors text-sm"
      //         >
      //           Upstash Redis
      //         </a>
      //       </div>
      //     </div>
      //   </footer>
      // </div>