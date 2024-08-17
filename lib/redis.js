// lib/redis.js
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.NEXT_PRIVATE_UPSTASH_REDIS_URL,
  token: process.env.NEXT_PRIVATE_UPSTASH_REDIS_TOKEN,
});

export default redis;
