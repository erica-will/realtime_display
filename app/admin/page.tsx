"use client";

import { useState } from "react";
import Link from "next/link";
import { TransitionEffect } from "@/types/content";

type AdminFormData = {
  title: string;
  body: string;
  imageUrl: string;
  effect: TransitionEffect;
  adminToken: string;
};

const defaultEffect: TransitionEffect = { type: 'fade', duration: 400 };

export default function AdminPanel() {
  const [formData, setFormData] = useState<AdminFormData>({
    title: "",
    body: "",
    imageUrl: "",
    effect: defaultEffect,
    adminToken: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  // URL 驗證函數
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const loadCurrentContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/content/current');
      if (response.ok) {
        const content = await response.json();
        setFormData(prev => ({
          ...prev,
          title: content.title || "",
          body: content.body || "",
          imageUrl: content.imageUrl || "",
          effect: content.effect || defaultEffect,
        }));
      }
    } catch (error) {
      console.error('Failed to load current content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage("");

    try {
      const response = await fetch('/api/content/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': formData.adminToken,
        },
        body: JSON.stringify({
          title: formData.title,
          body: formData.body,
          imageUrl: formData.imageUrl,
          effect: formData.effect,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to publish');
      }

      await response.json();
      setSubmitStatus('success');
      
      // 清空表單（除了 token）
      setFormData(prev => ({
        ...prev,
        title: "",
        body: "",
        imageUrl: "",
        effect: defaultEffect,
      }));
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateEffect = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      effect: {
        ...prev.effect,
        [field]: value,
      } as TransitionEffect,
    }));
  };

  const setEffectType = (type: TransitionEffect['type']) => {
    let newEffect: TransitionEffect;
    switch (type) {
      case 'fade':
        newEffect = { type: 'fade', duration: 400 };
        break;
      case 'slide':
        newEffect = { type: 'slide', direction: 'right', duration: 400 };
        break;
      case 'scale':
        newEffect = { type: 'scale', duration: 400 };
        break;
      case 'custom':
        newEffect = { type: 'custom', name: 'custom-effect', duration: 400 };
        break;
    }
    setFormData(prev => ({ ...prev, effect: newEffect }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">內容管理後台</h1>
              <p className="text-gray-600">更新即時顯示的內容和轉場效果</p>
            </div>
            <button
              type="button"
              onClick={loadCurrentContent}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '載入中...' : '載入當前內容'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Admin Token */}
          <div>
            <label htmlFor="adminToken" className="block text-sm font-medium text-gray-700 mb-2">
              管理員 Token *
            </label>
            <input
              type="password"
              id="adminToken"
              value={formData.adminToken}
              onChange={(e) => setFormData(prev => ({ ...prev, adminToken: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="請輸入管理員 Token"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              標題 *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="輸入內容標題"
              required
            />
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
              內容 *
            </label>
            <textarea
              id="body"
              rows={4}
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="輸入內容描述"
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              圖片 URL *
            </label>
            <input
              type="url"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
              required
            />
            {formData.imageUrl && isValidUrl(formData.imageUrl) && (
              <div className="mt-2">
                {/* 使用標準 img 標籤來預覽用戶輸入的 URL，避免 Next.js Image 的主機名限制 */}
                <img 
                  src={formData.imageUrl} 
                  alt="預覽" 
                  className="max-w-full h-32 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = 'block';
                  }}
                />
              </div>
            )}
            {formData.imageUrl && !isValidUrl(formData.imageUrl) && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                ⚠️ 請輸入有效的 URL 格式 (以 http:// 或 https:// 開頭)
              </div>
            )}
          </div>

          {/* Effect Type */}
          <div>
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">
                轉場效果
              </legend>
              <div className="grid grid-cols-2 gap-3 mb-4">
              {(['fade', 'slide', 'scale', 'custom'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEffectType(type)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    formData.effect.type === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Effect Duration */}
            <div className="mb-3">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-600 mb-1">
                持續時間 (毫秒)
              </label>
              <input
                type="number"
                id="duration"
                value={formData.effect.duration}
                onChange={(e) => updateEffect('duration', Number.parseInt(e.target.value) || 400)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="100"
                max="3000"
                step="100"
              />
            </div>

            {/* Slide Direction */}
            {formData.effect.type === 'slide' && (
              <div>
                <label htmlFor="slideDirection" className="block text-sm font-medium text-gray-600 mb-1">
                  滑動方向
                </label>
                <select
                  id="slideDirection"
                  value={formData.effect.direction}
                  onChange={(e) => updateEffect('direction', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="left">左</option>
                  <option value="right">右</option>
                  <option value="up">上</option>
                  <option value="down">下</option>
                </select>
              </div>
            )}

            {/* Custom Effect Name */}
            {formData.effect.type === 'custom' && (
              <div>
                <label htmlFor="customName" className="block text-sm font-medium text-gray-600 mb-1">
                  自定義效果名稱
                </label>
                <input
                  type="text"
                  id="customName"
                  value={formData.effect.name}
                  onChange={(e) => updateEffect('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="custom-effect"
                />
              </div>
            )}
            </fieldset>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isSubmitting ? '發佈中...' : '發佈內容'}
            </button>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">✅ 內容發佈成功！</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">❌ 發佈失敗：{errorMessage}</p>
            </div>
          )}
        </form>

        {/* Quick Templates */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">快速範本</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                title: "歡迎使用",
                body: "這是一個即時顯示系統的示範內容。",
                imageUrl: "https://crucial-gar-7626.upstash.io/1200x630/4f46e5/ffffff.png&text=Welcome",
                effect: { type: 'fade', duration: 600 }
              }))}
              className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              歡迎訊息
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                title: "系統更新",
                body: "系統即將進行維護更新，預計需要 30 分鐘。",
                imageUrl: "https://crucial-gar-7626.upstash.io/1200x630/ff6b35/ffffff.png&text=Update",
                effect: { type: 'slide', direction: 'up', duration: 800 }
              }))}
              className="px-4 py-2 text-sm text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50 transition-colors"
            >
              更新通知
            </button>
            <Link 
              href="/display" 
              target="_blank"
              className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors text-center"
            >
              即時預覽 ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}