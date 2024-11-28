'use client'

import React, { useState, useEffect } from 'react';
import { Cell } from './cell';
import SliceEffect from './slice-effect';
import { StartScreen } from './start-screen';
import { Leaderboard } from './leaderboard';
import { Cell as CellType, Position, EMOJI_COLORS } from '../types';
import { createInitialGrid, checkForMatches, removeMatches, GRID_SIZE, canSwap } from '../utils';
import { Button } from "@/components/ui/button"
import { User } from '../lib/db';
import { logout } from '../actions/auth';
import { endGame } from '../actions/game';

interface MatchThreeGameProps {
  initialLeaderboard: User[];
}

export const MatchThreeGame: React.FC<MatchThreeGameProps> = ({ initialLeaderboard }) => {
  const [gameState, setGameState] = useState<'notStarted' | 'playing' | 'finished'>('notStarted');
  const [playerName, setPlayerName] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [grid, setGrid] = useState<CellType[][]>(createInitialGrid());
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [invalidMove, setInvalidMove] = useState<boolean>(false);
  const [sliceEffects, setSliceEffects] = useState<Position[]>([]);
  const [leaderboard, setLeaderboard] = useState<User[]>(initialLeaderboard);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const matches = checkForMatches(grid);
    if (matches.length > 0) {
      setSliceEffects(matches);
      setTimeout(() => {
        setGrid(removeMatches(grid, matches));
        setSliceEffects([]);
        setScore(prevScore => {
          const newScore = prevScore + matches.length;
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          return newScore;
        });
      }, 500);
    }
  }, [grid, highScore]);

  const handleCellClick = (row: number, col: number) => {
    if (!selectedCell) {
      setSelectedCell({ row, col });
      setInvalidMove(false);
    } else {
      const dx = Math.abs(selectedCell.col - col);
      const dy = Math.abs(selectedCell.row - row);

      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        if (canSwap(grid, selectedCell, { row, col })) {
          const newGrid = [...grid];
          [newGrid[selectedCell.row][selectedCell.col], newGrid[row][col]] = 
          [newGrid[row][col], newGrid[selectedCell.row][selectedCell.col]];
          setGrid(newGrid);
          setInvalidMove(false);
        } else {
          setInvalidMove(true);
          setTimeout(() => setInvalidMove(false), 500);
        }
      }

      setSelectedCell(null);
    }
  };

  const handleGameStart = (name: string, user: User) => {
    console.log('Client: handleGameStart called with:', name, user);
    setPlayerName(name);
    setHighScore(user.highScore);
    setTotalScore(user.totalScore);
    setGameState('playing');
    setScore(0);
    setGrid(createInitialGrid());
  };

  const handleGameEnd = async () => {
    setIsLoading(true);
    try {
      console.log('Client: Ending game for player:', playerName, 'Score:', score, 'High Score:', highScore);
      const result = await endGame(playerName, highScore, score);
      if (result.success && result.updatedUser && result.updatedLeaderboard) {
        setTotalScore(result.updatedUser.totalScore);
        setHighScore(result.updatedUser.highScore);
        setLeaderboard(result.updatedLeaderboard);
        setGameState('finished');
        console.log('Client: Game ended successfully');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Client: Error ending game:', error);
      setError(`Произошла ошибка при завершении игры: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setGameState('notStarted');
      setPlayerName('');
      setScore(0);
      setHighScore(0);
      setTotalScore(0);
    } catch (error) {
      console.error('Error during logout:', error);
      setError(`Произошла ошибка при выходе: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Ошибка</h1>
        <p>{error}</p>
        <Button className="mt-4 bg-black text-white hover:bg-gray-800" onClick={() => setError(null)} disabled={isLoading}>
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (gameState === 'notStarted') {
    return <StartScreen onStart={handleGameStart} initialLeaderboard={leaderboard} />;
  }

  if (gameState === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-8">
        <h1 className="text-4xl font-bold text-black">Игра окончена!</h1>
        <p className="text-2xl">Ваш счет за эту игру: {score}</p>
        <p className="text-2xl">Ваш рекорд: {highScore}</p>
        <p className="text-2xl">Ваши общие очки: {totalScore}</p>
        <Button 
          onClick={() => {
            setGameState('playing');
            setScore(0);
            setGrid(createInitialGrid());
          }} 
          disabled={isLoading}
          className="bg-black text-white hover:bg-gray-800"
        >
          Начать новую игру
        </Button>
        <Button onClick={handleLogout} disabled={isLoading} className="bg-black text-white hover:bg-gray-800">Выйти</Button>
        <Leaderboard scores={leaderboard} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-black">Три в ряд v1.009</h1>
      <div className="mb-4 text-lg">
        <span className="font-bold">{playerName}</span> - Текущий счет: {score} | Рекорд: {highScore} | Общие очки: {totalScore}
      </div>
      <div 
        className={`relative grid bg-white p-4 rounded-lg shadow-lg ${invalidMove ? 'animate-shake' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 40px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 40px)`,
          gap: '4px',
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="relative">
              <Cell
                cell={cell}
                isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
              {sliceEffects.some(pos => pos.row === rowIndex && pos.col === colIndex) && (
                <SliceEffect
                  color={EMOJI_COLORS[cell.type]}
                  onComplete={() => {}}
                />
              )}
            </div>
          ))
        )}
      </div>
      <Button className="mt-4 bg-black text-white hover:bg-gray-800" onClick={handleGameEnd} disabled={isLoading}>Завершить игру</Button>
    </div>
  );
};

