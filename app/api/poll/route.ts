import { NextRequest, NextResponse } from 'next/server';
import { redis, CURRENT_KEY } from '@/lib/kv';
import type { DisplayContent } from '@/types/content';

export async function GET(req: NextRequest) {
  try {
    // 獲取查詢參數中的最後版本號
    const url = new URL(req.url);
    const lastVersion = url.searchParams.get('lastVersion');

    const content = await redis.get(CURRENT_KEY) as DisplayContent | null;
    if (!content) {
      return NextResponse.json({ hasUpdate: false });
    }

    // 如果沒有傳入 lastVersion，或者版本不同，就回傳新內容
    if (!lastVersion || content.version !== lastVersion) {
      return NextResponse.json({ 
        hasUpdate: true, 
        content: content 
      });
    }

    // 版本相同，沒有更新
    return NextResponse.json({ hasUpdate: false });
  } catch (error) {
    console.error('輪詢檢查錯誤:', error);
    return NextResponse.json({ hasUpdate: false, error: 'Server error' }, { status: 500 });
  }
}