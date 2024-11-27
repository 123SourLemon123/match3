import { createClient } from 'redis';

const client = createClient({
  password: 'D0UeA25e2KuFg5COi2bpopqLKS8RrHkZ',
  socket: {
    host: 'redis-15764.c17.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 15764
  }
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client Connected'));
client.on('ready', () => console.log('Redis Client Ready'));

export async function getRedisClient() {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

export async function checkRedisConnection() {
  try {
    const client = await getRedisClient();
    const pong = await client.ping();
    console.log('Redis PING response:', pong);
    return pong === 'PONG';
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return false;
  }
}

