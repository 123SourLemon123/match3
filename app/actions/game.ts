'use server'

import { updateUserScores, getUser, getLeaderboard, User } from '../lib/db';

export async function endGame(playerName: string, highScore: number, score: number): Promise<{ success: boolean; message: string; updatedUser?: User; updatedLeaderboard?: User[] }> {
  console.log('Server: Ending game for player:', playerName, 'Score:', score, 'High Score:', highScore);
  try {
    await updateUserScores(playerName, highScore, score);
    const updatedUser = await getUser(playerName);
    const updatedLeaderboard = await getLeaderboard();
    
    if (!updatedUser) {
      throw new Error('User not found after updating scores');
    }

    console.log('Server: Game ended successfully');
    return { 
      success: true, 
      message: 'Игра успешно завершена', 
      updatedUser, 
      updatedLeaderboard 
    };
  } catch (error) {
    console.error('Server: Error ending game:', error);
    return { 
      success: false, 
      message: `Произошла ошибка при завершении игры: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` 
    };
  }
}

