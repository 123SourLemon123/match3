import { Redis } from '@upstash/redis'

if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error('KV_REST_API_URL and KV_REST_API_TOKEN must be set')
}

let redis: Redis | null = null;

export async function getRedisClient() {
  if (!redis) {
    console.log('Creating new Redis client...');
    console.log('Using KV_REST_API_URL:', process.env.KV_REST_API_URL);
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

