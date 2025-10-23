export type TransitionEffect =
  | { type: 'fade'; duration: number }
  | { type: 'slide'; direction: 'left'|'right'|'up'|'down'; duration: number }
  | { type: 'scale'; duration: number }
  | { type: 'custom'; name: string; duration: number; params?: Record<string, unknown> };

export interface DisplayContent {
  version: string;
  title: string;
  body: string;
  imageUrl: string;
  effect: TransitionEffect;
}

export const DEFAULT_CONTENT: DisplayContent = {
  version: new Date().toISOString(),
  title: '等待發佈',
  body: '目前尚未有內容，請稍後或由後台發佈。',
  imageUrl: `https://crucial-gar-7626.upstash.io/1200x630/eee/aaa.png&text=Coming+Soon`,
  effect: { type: 'fade', duration: 400 }
};
