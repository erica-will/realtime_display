import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { redis, CURRENT_KEY, CHANNEL } from '@/lib/kv';
import type { DisplayContent } from '@/types/content';

const effectSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('fade'),
    duration: z.number(),
  }),
  z.object({
    type: z.literal('slide'),
    direction: z.enum(['left', 'right', 'up', 'down']),
    duration: z.number(),
  }),
  z.object({
    type: z.literal('scale'),
    duration: z.number(),
  }),
  z.object({
    type: z.literal('custom'),
    name: z.string(),
    duration: z.number(),
    params: z.record(z.string(), z.unknown()).optional(),
  }),
]);

const schema = z.object({
  title: z.string(),
  body: z.string(),
  imageUrl: z.string().url(),
  effect: effectSchema,
  version: z.string().optional(),
});

function withVersionQuery(url: string, v: string) {
  const enc = encodeURIComponent(v);
  return url.includes('?') ? `${url}&v=${enc}` : `${url}?v=${enc}`;
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-admin-token') !== process.env.ADMIN_TOKEN) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const body = await req.json();
  const parsed = schema.parse(body);
  const version = parsed.version ?? new Date().toISOString();

  const payload: DisplayContent = {
    ...parsed,
    version,
    imageUrl: withVersionQuery(parsed.imageUrl, version),
  };

  // 1) 寫入「單一真相」
  await redis.set(CURRENT_KEY, payload);
  console.log('內容已儲存到 Redis:', payload.title);
  
  // 2) 廣播（所有訂閱者都會收到）
  await redis.publish(CHANNEL, JSON.stringify(payload));
  console.log('內容已廣播到頻道:', CHANNEL);

  return NextResponse.json({ ok: true, version });
}
