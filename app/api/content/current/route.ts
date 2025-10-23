import { NextResponse } from 'next/server';
import { redis, CURRENT_KEY } from '@/lib/kv';
import { DEFAULT_CONTENT } from '@/types/content';

export const revalidate = 0;

export async function GET() {
  const data = await redis.get(CURRENT_KEY);
  if (!data) {
    // 首次尚未發佈 → 寫入預設內容，並回傳它
    await redis.set(CURRENT_KEY, DEFAULT_CONTENT);
    return NextResponse.json(DEFAULT_CONTENT);
  }
  return NextResponse.json(data);
}
