import DisplayClient from './DisplayClient';
import { DEFAULT_CONTENT } from '@/types/content';

export default async function Page() {
  // 小提醒：本機開發請把 NEXT_PUBLIC_BASE_URL 設為 http://localhost:3000
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${base}/api/content/current`, { cache: 'no-store' });
  const initial = await res.json();
  return <DisplayClient initial={initial ?? DEFAULT_CONTENT} />;
}
