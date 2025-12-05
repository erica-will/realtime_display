"use client";
import BackgroundNoise from "../components/BackgroundNoise";
import ClientJitterText from "../components/ClientJitterText";

export default function ActOne() {
  return (
    <>
      <div className="fixed inset-0 flex flex-col justify-center items-center">
        <BackgroundNoise />
        <div className="w-full h-full flex flex-col justify-center items-center px-5">
          <ClientJitterText
            text="在這座公園，請保持開啟此頁面"
            className="text-base text-center flex justify-center items-center text-red-50"
          />
          <ClientJitterText
            text="請勿隨意跳開畫面，否則你將徹底與人世隔絕"
            className="text-base text-center flex justify-center items-center text-red-50"
          />
        </div>
      </div>
    </>
  );
}
