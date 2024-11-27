import { MatchThreeGame } from './components/match-three-game'
import { getLeaderboard, User } from './lib/db'
import { DebugLog } from './components/debug-log'

export default async function Home() {
  let initialLeaderboard: User[] = [];
  let error: Error | null = null;

  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      throw new Error(
        'Необходимо настроить переменные окружения. Пожалуйста, добавьте KV_REST_API_URL и KV_REST_API_TOKEN в настройках проекта на Vercel.'
      );
    }

    console.log('Attempting to load leaderboard...');
    initialLeaderboard = await getLeaderboard();
    console.log('Leaderboard loaded successfully', initialLeaderboard);
  } catch (err) {
    console.error('Error loading leaderboard:', err);
    error = err instanceof Error ? err : new Error('Произошла неизвестная ошибка');
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Ошибка конфигурации</h1>
        <p className="text-center max-w-md mb-4">{error.message}</p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-md">
          <p className="text-sm text-yellow-700">
            Для настройки переменных окружения:
            <ol className="list-decimal ml-5 mt-2">
              <li>Перейдите в настройки проекта на Vercel</li>
              <li>Найдите раздел "Environment Variables"</li>
              <li>Добавьте переменные KV_REST_API_URL и KV_REST_API_TOKEN</li>
              <li>Значения можно получить в панели управления Upstash</li>
              <li>После добавления переменных, перезапустите деплой</li>
            </ol>
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <MatchThreeGame initialLeaderboard={initialLeaderboard} />
      <DebugLog />
    </main>
  );
}

