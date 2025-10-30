import Pusher from 'pusher';

// 檢查是否有完整的 Pusher 配置
const hasPusherConfig = !!(
  process.env.PUSHER_APP_ID && 
  process.env.PUSHER_KEY && 
  process.env.PUSHER_SECRET && 
  process.env.PUSHER_CLUSTER
);

export const pusher = hasPusherConfig ? new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true
}) : null;

// 頻道和事件名稱常數
export const PUSHER_CONFIG = {
  CHANNEL: 'content-updates',
  EVENT: 'content-changed'
};

// 檢查 Pusher 是否可用
export const isPusherAvailable = () => pusher !== null;