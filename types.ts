export type CellType = '🍎' | '🍊' | 'ozon' | '🍓' | '🍋';

export interface Cell {
  type: CellType;
  id: string;
}

export interface Position {
  row: number;
  col: number;
}

export interface PlayerScore {
  name: string;
  totalScore: number;
  highScore: number;
}

export const EMOJI_COLORS: Record<CellType, string> = {
  '🍎': '#FF0000', // Красный
  '🍊': '#FFA500', // Оранжевый
  'ozon': '#0066FF', // Синий (Ozon)
  '🍓': '#FF69B4', // Розовый
  '🍋': '#FFFF00', // Желтый
};

