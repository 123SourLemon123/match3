export type CellType = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export interface Cell {
  type: CellType;
  id: string;
}

export interface Position {
  row: number;
  col: number;
}

