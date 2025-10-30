"use client";

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * 創建一個只在客戶端渲染的組件
 * 這是解決 hydration 問題的最佳方案
 */
export function createClientOnlyComponent<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: () => <>{fallback}</>,
  });
}

/**
 * 使用簡單的 typeof window 檢查的 ClientOnly 組件
 * 注意：這個組件在使用時需要確保 fallback 和 children 具有相同的 DOM 結構
 */
export function ClientOnly({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}) {
  // 在渲染階段進行檢查，但這要求 fallback 和 children 有相同的 DOM 結構
  if (typeof window === 'undefined') {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}