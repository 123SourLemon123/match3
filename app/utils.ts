import { Cell, CellType, Position } from './types';

export const GRID_SIZE = 15;
export const CELL_TYPES: CellType[] = ['🍎', '🍊', 'ozon', '🍓', '🍋'];

export function createInitialGrid(): Cell[][] {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({
      type: CELL_TYPES[Math.floor(Math.random() * CELL_TYPES.length)],
      id: Math.random().toString(36).substr(2, 9)
    }))
  );
}

export function checkForMatches(grid: Cell[][]): Position[] {
  const matches: Position[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE - 2; col++) {
      if (
        grid[row][col].type === grid[row][col + 1].type &&
        grid[row][col].type === grid[row][col + 2].type
      ) {
        matches.push({ row, col });
        matches.push({ row, col: col + 1 });
        matches.push({ row, col: col + 2 });
      }
    }
  }

  for (let row = 0; row < GRID_SIZE - 2; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (
        grid[row][col].type === grid[row + 1][col].type &&
        grid[row][col].type === grid[row + 2][col].type
      ) {
        matches.push({ row, col });
        matches.push({ row: row + 1, col });
        matches.push({ row: row + 2, col });
      }
    }
  }

  return matches;
}

export function removeMatches(grid: Cell[][], matches: Position[]): Cell[][] {
  const newGrid = grid.map(row => [...row]);

  matches.forEach(({ row, col }) => {
    for (let i = row; i > 0; i--) {
      newGrid[i][col] = newGrid[i - 1][col];
    }
    newGrid[0][col] = {
      type: CELL_TYPES[Math.floor(Math.random() * CELL_TYPES.length)],
      id: Math.random().toString(36).substr(2, 9)
    };
  });

  return newGrid;
}

export function canSwap(grid: Cell[][], pos1: Position, pos2: Position): boolean {
  const newGrid = grid.map(row => [...row]);

  [newGrid[pos1.row][pos1.col], newGrid[pos2.row][pos2.col]] = 
  [newGrid[pos2.row][pos2.col], newGrid[pos1.row][pos1.col]];

  const matches = checkForMatches(newGrid);

  return matches.length > 0;
}

