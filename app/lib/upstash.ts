import { Redis } from '@upstash/redis'

let redis: Redis | null = null;

export async function getRedisClient() {
  console.log('getRedisClient called');
  
  if (typeof window !== 'undefined') {
    console.log('Running on client side, Redis operations are not allowed');
    throw new Error('Redis operations are not allowed on the client side');
  }

  console.log('KV_REST_API_URL:', process.env.KV_REST_API_URL ? 'Set' : 'Not set');
  console.log('KV_REST_API_TOKEN:', process.env.KV_REST_API_TOKEN ? 'Set' : 'Not set');

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error('KV_REST_API_URL or KV_REST_API_TOKEN is not set');
    throw new Error('Необходимо настроить переменные окружения KV_REST_API_URL и KV_REST_API_TOKEN в настройках проекта на Vercel');
  }

  if (!redis) {
    console.log('Creating new Redis client...');
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
    console.log('Checking Redis connection...');
    const client = await getRedisClient();
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

