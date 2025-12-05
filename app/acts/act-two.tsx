"use client";
import RainSplash from "../components/RainSplash";

export default function ActTwo() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <RainSplash />
      <div className="w-full h-full fixed flex flex-col justify-start items-start pt-20 px-5">
        <h1 className="text-2xl">
          忠孝復興站外死亡車禍 砂石車<span className="text-red-600 animate-drip">碾斃</span>
          機車騎士
        </h1>
        <br />
        <p className="text-gray-400">2023/12/03 18:20 記者王元岳/台北報導</p>
        <br />
        <br />
        <p className="text-base">
          一輛砂石車行徑忠孝東路，要右轉復興南路時，疑似因大車的內輪差，與騎乘機車的42歲婦人發生碰撞，騎士當場遭輾斃。經檢測，砂石車駕駛無酒駕情形，責任歸屬仍待交通單位調查。
        </p>
      </div>
    </div>
  );
}
