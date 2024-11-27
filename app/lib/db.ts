import { getRedisClient, checkRedisConnection } from './upstash'

export interface User {
  name: string;
  password: string;
  highScore: number;
  totalScore: number;
}

async function ensureRedisConnection() {
  console.log('Ensuring Redis connection...');
  const isConnected = await checkRedisConnection();
  if (!isConnected) {
    console.error('Upstash Redis connection failed');
    throw new Error('Unable to connect to Upstash Redis');
  }
  console.log('Redis connection confirmed');
}

export async function getUser(name: string): Promise<User | null> {
  console.log('Attempting to get user:', name);
  await ensureRedisConnection();
  try {
    const redis = await getRedisClient();
    const userData = await redis.get(`user:${name}`);
    if (!userData) return null;
    console.log('User data retrieved:', userData);
    if (typeof userData === 'string') {
      return JSON.parse(userData);
    } else if (typeof userData === 'object') {
      return userData as User;
    } else {
      throw new Error(`Unexpected user data type: ${typeof userData}`);
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function createUser(user: User): Promise<void> {
  console.log('Attempting to create user:', user.name);
  await ensureRedisConnection();
  try {
    const redis = await getRedisClient();
    await redis.set(`user:${user.name}`, JSON.stringify(user));
    console.log('User created successfully:', user.name);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUserScores(name: string, highScore: number, totalScore: number): Promise<void> {
  console.log('Attempting to update user scores:', name, 'High Score:', highScore, 'Total Score:', totalScore);
  await ensureRedisConnection();
  try {
    const redis = await getRedisClient();
    const user = await getUser(name);
    if (user) {
      user.highScore = Math.max(user.highScore, highScore);
      user.totalScore += totalScore;
      await redis.set(`user:${user.name}`, JSON.stringify(user));
      console.log('User scores updated successfully:', name, 'New High Score:', user.highScore, 'New Total Score:', user.totalScore);
    } else {
      console.error('User not found for score update:', name);
      throw new Error(`User not found: ${name}`);
    }
  } catch (error) {
    console.error('Error updating user scores:', error);
    throw error;
  }
}

export async function getLeaderboard(): Promise<User[]> {
  console.log('Attempting to get leaderboard');
  await ensureRedisConnection();
  try {
    const redis = await getRedisClient();
    const keys = await redis.keys('user:*');
    console.log('User keys fetched:', keys);
    const users = await Promise.all(
      keys.map(async (key) => {
        const userData = await redis.get(key);
        console.log(`Data for ${key}:`, userData);
        if (typeof userData === 'string') {
          try {
            return JSON.parse(userData) as User;
          } catch (error) {
            console.error(`Error parsing data for ${key}:`, error);
            return null;
          }
        } else if (typeof userData === 'object' && userData !== null) {
          return userData as User;
        } else {
          console.error(`Unexpected data type for ${key}:`, typeof userData);
          return null;
        }
      })
    );
    console.log('Leaderboard data fetched');
    return users.filter((user): user is User => user !== null)
      .sort((a, b) => b.totalScore - a.totalScore);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

