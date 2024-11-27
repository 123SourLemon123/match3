import { Redis } from '@upstash/redis'

let redis: Redis | null = null;

export async function getRedisClient() {
  if (typeof window !== 'undefined') {
    console.log('Running on client side, skipping Redis initialization');
    return null;
  }

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error('KV_REST_API_URL or KV_REST_API_TOKEN is not set');
    throw new Error('Необходимо настроить переменные окружения KV_REST_API_URL и KV_REST_API_TOKEN в настройках проекта на Vercel');
  }

  if (!redis) {
    console.log('Creating new Redis client...');
    console.log('KV_REST_API_URL:', process.env.KV_REST_API_URL);
    console.log('KV_REST_API_TOKEN:', process.env.KV_REST_API_TOKEN ? '[REDACTED]' : 'Not set');
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
    console.log('Redis client created successfully');
  }
  return redis;
}

export async function checkRedisConnection() {
  try {
    console.log('Attempting to get Redis client...');
    const client = await getRedisClient();
    if (!client) {
      console.log('Redis client is null, skipping connection check');
      return false;
    }
    console.log('Redis client obtained, attempting to ping...');
    const pong = await client.ping();
    console.log('Redis ping response:', pong);
    return pong === 'PONG';
  } catch (error) {
    console.error('Failed to connect to Upstash Redis:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return false;
  }
}

