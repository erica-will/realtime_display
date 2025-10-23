import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();
export const CHANNEL = process.env.CHANNEL!;
export const CURRENT_KEY = process.env.CURRENT_KEY!;
