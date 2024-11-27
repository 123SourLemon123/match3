import React, { useState, useEffect } from 'react';
import { Cell } from './Cell';
import { Cell as CellType, Position } from './types';
import { createInitialGrid, checkForMatches, removeMatches, GRID_SIZE } from './utils';

export const MatchThreeGame: React.FC = () => {
  const [grid, setGrid] = useState<CellType[][]>(createInitialGrid());
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);

  useEffect(() => {
    const matches = checkForMatches(grid);
    if (matches.length > 0) {
      setTimeout(() => {
        setGrid(removeMatches(grid, matches));
      }, 300);
    }
  }, [grid]);

  const handleCellClick = (row: number, col: number) => {
    if (!selectedCell) {
      setSelectedCell({ row, col });
    } else {
      const dx = Math.abs(selectedCell.col - col);
      const dy = Math.abs(selectedCell.row - row);

      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        const newGrid = [...grid];
        [newGrid[selectedCell.row][selectedCell.col], newGrid[row][col]] = [newGrid[row][col], newGrid[selectedCell.row][selectedCell.col]];
        setGrid(newGrid);
      }

      setSelectedCell(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Три в ряд</h1>
      <div className="grid grid-cols-15 gap-1 bg-white p-2 rounded-lg shadow-lg">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};

