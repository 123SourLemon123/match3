import { MatchThreeGame } from './components/match-three-game'
import { getLeaderboard } from './lib/db'
import { DebugLog } from './components/debug-log'

export default async function Home() {
  let initialLeaderboard = [];
  let error = null;

  try {
    console.log('Attempting to load leaderboard...');
    initialLeaderboard = await getLeaderboard();
    console.log('Leaderboard loaded successfully', initialLeaderboard);
  } catch (err) {
    console.error('Error loading leaderboard:', err);
    error = err instanceof Error ? err : new Error('An unknown error occurred');
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Ошибка загрузки</h1>
        <p>Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.</p>
        <p className="mt-2 text-sm text-gray-600">
          Детали ошибки: {error.message}
        </p>
        {error.stack && (
          <pre className="mt-2 text-xs text-gray-500 max-w-md overflow-auto">
            Стек вызовов: {error.stack}
          </pre>
        )}
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Попробовать снова
        </button>
        <DebugLog />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MatchThreeGame initialLeaderboard={initialLeaderboard} />
      <DebugLog />
    </div>
  );
}

