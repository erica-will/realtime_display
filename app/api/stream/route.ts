export const runtime = 'edge';

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const channel = process.env.CHANNEL!;

  // 與 Upstash 建立 SSE 訂閱
  const upstream = await fetch(`${url}/subscribe/${channel}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'text/event-stream',
    },
  });

  if (!upstream.ok || !upstream.body) {
    return new Response('Upstream error', { status: 502 });
  }

  // 將 Upstash 的 SSE 原封轉發給瀏覽器
  const stream = new ReadableStream({
    start(controller) {
      const reader = upstream.body!.getReader();
      const pump = () =>
        reader.read().then(({ done, value }) => {
          if (done) return controller.close();
          controller.enqueue(value);
          return pump();
        });
      pump();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
