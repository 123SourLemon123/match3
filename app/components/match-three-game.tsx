'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Cell } from './cell';
import { Leaderboard } from './leaderboard';
import { StartScreen } from './start-screen';
import { Cell as CellType, Position, PlayerScore } from '../types';
import { createInitialGrid, checkForMatches, removeMatches, GRID_SIZE, canSwap } from '../utils';
import { EMOJI_COLORS } from '../types';
import { Button } from "../../components/ui/button"
import Firework from './firework';
import SliceEffect from './slice-effect';
import { endGame } from '../actions/game';
import { logout } from '../actions/auth';

interface MatchThreeGameProps {
  initialLeaderboard: PlayerScore[];
}

export const MatchThreeGame: React.FC<MatchThreeGameProps> = ({ initialLeaderboard }) => {
  const [grid, setGrid] = useState<CellType[][]>(createInitialGrid());
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<PlayerScore[]>(initialLeaderboard);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [effects, setEffects] = useState<{ type: 'firework' | 'slice', position: Position, color: string }[]>([]);

  useEffect(() => {
    const matches = checkForMatches(grid);
    if (matches.length > 0) {
      const newGrid = removeMatches(grid, matches);
      setGrid(newGrid);
      setScore(prevScore => prevScore + matches.length);
      setHighScore(prevHighScore => Math.max(prevHighScore, prevScore + matches.length));
      
      matches.forEach(match => {
        const cellType = grid[match.row][match.col].type;
        const color = EMOJI_COLORS[cellType];
        setEffects(prev => [...prev, { type: 'slice', position: match, color }]);
      });
    }
  }, [grid]);

  const handleCellClick = (row: number, col: number) => {
    if (selectedCell) {
      const dx = Math.abs(selectedCell.col - col);
      const dy = Math.abs(selectedCell.row - row);

      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        if (canSwap(grid, selectedCell, { row, col })) {
          const newGrid = [...grid];
          [newGrid[selectedCell.row][selectedCell.col], newGrid[row][col]] = 
            [newGrid[row][col], newGrid[selectedCell.row][selectedCell.col]];
          setGrid(newGrid);
        } else {
          // Анимация тряски при невозможности свапа
          const cellElement = document.getElementById(`cell-${row}-${col}`);
          if (cellElement) {
            cellElement.classList.add('animate-shake');
            setTimeout(() => cellElement.classList.remove('animate-shake'), 500);
          }
        }
      }
      setSelectedCell(null);
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleStartGame = (name: string) => {
    setPlayerName(name);
    setGameState('playing');
    setScore(0);
    setGrid(createInitialGrid());
  };

  const handleEndGame = useCallback(async () => {
    if (playerName) {
      const result = await endGame(playerName, highScore, score);
      if (result.success && result.updatedLeaderboard) {
        setLeaderboard(result.updatedLeaderboard);
      }
    }
    setGameState('gameOver');
    setEffects(prev => [...prev, { type: 'firework', position: { row: GRID_SIZE / 2, col: GRID_SIZE / 2 }, color: '#FFD700' }]);
  }, [playerName, highScore, score]);

  const handleLogout = async () => {
    await logout();
    setPlayerName(null);
    setGameState('start');
  };

  const removeEffect = (index: number) => {
    setEffects(prev => prev.filter((_, i) => i !== index));
  };

  if (gameState === 'start') {
    return <StartScreen onStartGame={handleStartGame} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Три в ряд</h1>
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <p className="text-xl font-semibold">Игрок: {playerName}</p>
            <p className="text-xl">Счет: {score}</p>
            <p className="text-xl">Рекорд: {highScore}</p>
          </div>
          <div className="grid grid-cols-15 gap-1 bg-white p-2 rounded-lg shadow-lg relative">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} id={`cell-${rowIndex}-${colIndex}`} className="w-8 h-8">
                  <Cell
                    cell={cell}
                    isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  />
                </div>
              ))
            )}
            {effects.map((effect, index) => (
              effect.type === 'firework' ? (
                <Firework
                  key={index}
                  color={effect.color}
                  onComplete={() => removeEffect(index)}
                />
              ) : (
                <SliceEffect
                  key={index}
                  color={effect.color}
                  onComplete={() => removeEffect(index)}
                />
              )
            ))}
          </div>
          <div className="mt-4 space-x-4">
            <Button onClick={handleEndGame}>Закончить игру</Button>
            <Button onClick={handleLogout} variant="outline">Выйти</Button>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <Leaderboard scores={leaderboard} />
        </div>
      </div>
    </div>
  );
};

