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

  return (
    <main className="min-h-screen bg-gray-100">
      <MatchThreeGame initialLeaderboard={initialLeaderboard} />
      <DebugLog />
    </main>
  );
}

