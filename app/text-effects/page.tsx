import ClientGlitchText from "../components/ClientGlitchText";
import ClientOutlineStackText from "../components/ClientOutlineStackText";
import ClientLiquidText from "../components/ClientLiquidText";
import ClientParticleText from "../components/ClientParticleText";
import ClientPathMoveText from "../components/ClientPathMoveText";
import ClientWaveText from "../components/ClientWaveText";
import ClientSquashStretchText from "../components/ClientSquashStretchText";
import ClientJitterText from "../components/ClientJitterText";
import ClientAdvancedInfinityText from "../components/ClientAdvancedInfinityText";
import ClientInfinityText from "../components/ClientInfinityText";

export default function TextEffectsPage() {
  return (
    <main className="bg-black text-white min-h-screen flex flex-col items-center gap-24 py-24">
      <div className="text-center">
        <h1 className="text-2xl mb-4 text-gray-400">Creative Text Effects</h1>
        <p className="text-sm text-gray-500 mb-12">
          十二種不同層級的文字特效：從簡到瘋
        </p>
      </div>

      {/* 靜態文字特效 */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xl text-center text-gray-300 mb-12">靜態視覺特效</h2>
        
        {/* Glitch Effect */}
        <section className="text-center mb-16">
          <h3 className="text-lg text-gray-400 mb-6">1. Glitch / Chromatic Aberration</h3>
          <ClientGlitchText text="NEO SIGNAL" />
        </section>

        {/* Outline Stack Effect */}
        <section className="text-center mb-16">
          <h3 className="text-lg text-gray-400 mb-6">2. Outline Stack / Offset Text</h3>
          <ClientOutlineStackText text="HANDMADE / TYPE / ENERGY" />
        </section>

        {/* Liquid Effect */}
        <section className="text-center mb-16">
          <h3 className="text-lg text-gray-400 mb-6">3. Liquid / SVG Distortion</h3>
          <ClientLiquidText text="MELT ME" />
        </section>

        {/* Particle Effect */}
        <section className="text-center mb-16">
          <h3 className="text-lg text-gray-400 mb-6">4. Particle Text / Canvas Animation</h3>
          <ClientParticleText text="MOVE" />
        </section>
      </div>

      {/* 動態運動特效 */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xl text-center text-gray-300 mb-12">動態運動特效</h2>
        
        {/* Path Move Effect */}
        <section className="text-center mb-16">
          <h3 className="text-lg text-gray-400 mb-6">5. Path Movement / CSS offset-path</h3>
          <ClientPathMoveText text="FOLLOW THE PATH" />
        </section>

        {/* Wave Effect */}
        <section className="text-center mb-16">
          <h3 className="text-lg text-gray-400 mb-6">6. Wave Animation / Sine Wave Motion</h3>
          <ClientWaveText text="OCEAN WAVES" />
        </section>

        {/* Squash Stretch Effect */}
        <section className="text-center mb-16">
          <h3 className="text-lg text-gray-400 mb-6">7. Squash & Stretch / Elastic Physics</h3>
          <ClientSquashStretchText text="ELASTIC MOTION" />
        </section>

        {/* Jitter Effect */}
        <section className="text-center mb-16">
          <h3 className="text-lg text-gray-400 mb-6">8. Jitter / Noise-based Movement</h3>
          <ClientJitterText text="NERVOUS ENERGY" />
        </section>
      </div>

      {/* 無限循環特效 */}
      <div className="w-full max-w-6xl">
        <h2 className="text-xl text-center text-gray-300 mb-12">無限循環特效</h2>
        
        {/* Basic Infinity */}
        <section className="text-center mb-16">
          <h3 className="text-lg text-gray-400 mb-6">9. Basic Infinity Loop / Lissajous Curve</h3>
          <div className="flex justify-center">
            <ClientInfinityText text="INFINITE LOOP BASIC INFINITY ANIMATION" />
          </div>
        </section>

        {/* Advanced Multi-Ring */}
        <section className="text-center mb-16">
          <h3 className="text-lg text-gray-400 mb-6">10. Multi-Ring Infinity / Layered Paths</h3>
          <div className="flex justify-center">
            <ClientAdvancedInfinityText 
              texts={[
                "OUTER RING MOVING ALONG INFINITY PATH",
                "SECOND LAYER DIFFERENT SPEED",
                "THIRD CIRCLE UNIQUE RHYTHM",
                "INNER CORE FINAL LAYER"
              ]}
            />
          </div>
        </section>

        {/* Sparse Mode */}
        <section className="text-center mb-16">
          <h3 className="text-lg text-gray-400 mb-6">11. Sparse Mode / Minimalist Dots</h3>
          <div className="flex justify-center">
            <ClientAdvancedInfinityText 
              texts={[
                "SPARSE MODE DEMONSTRATION WITH FEWER LETTERS",
                "DOTS REPLACE SOME CHARACTERS FOR CLEAN AESTHETIC",
                "MINIMALIST VISUAL FOCUS PATTERN",
                "ELEGANT SIMPLIFIED ANIMATION"
              ]}
              sparseMode={true}
            />
          </div>
        </section>
      </div>

      <div className="text-center mt-16 max-w-4xl">
        <p className="text-sm text-gray-500">
          這十二種做法涵蓋了從基礎 CSS 到高級 Canvas 的完整特效譜系。<br />
          包含靜態視覺、動態運動、數學曲線等多種實現方式。<br />
          每個元件都支援動態 props，可以輕鬆整合到任何專案中。
        </p>
      </div>
    </main>
  );
}